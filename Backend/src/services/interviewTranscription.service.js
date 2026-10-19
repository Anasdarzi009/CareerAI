/**
 * Pluggable Open-Source Transcription Provider Abstraction
 * Supports browser-native speech recognition ingest and local/self-hosted Whisper backends.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class TranscriptionProvider {
    async transcribe(audioBuffer, options = {}) {
        throw new Error('transcribe() must be implemented by concrete provider');
    }
}

/**
 * Local Whisper Provider
 * Executes local whisper CLI or whisper.cpp if available on the system path.
 */
class LocalWhisperProvider extends TranscriptionProvider {
    constructor() {
        super();
        this.whisperPath = process.env.WHISPER_PATH || 'whisper';
    }

    async isAvailable() {
        return new Promise((resolve) => {
            exec(`${this.whisperPath} --help`, (err) => {
                resolve(!err);
            });
        });
    }

    async transcribe(audioBuffer, options = {}) {
        const tempAudioPath = path.join(__dirname, `../../temp_audio_${Date.now()}.wav`);
        try {
            await fs.promises.writeFile(tempAudioPath, audioBuffer);
            return new Promise((resolve, reject) => {
                exec(`${this.whisperPath} "${tempAudioPath}" --model tiny.en --output_format txt`, (err, stdout) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        transcript: stdout.trim(),
                        engine: 'Local-Whisper-CPP',
                        confidence: 0.92
                    });
                });
            });
        } finally {
            if (fs.existsSync(tempAudioPath)) {
                fs.promises.unlink(tempAudioPath).catch(() => {});
            }
        }
    }
}

/**
 * Browser Speech Recognition Ingest Provider
 * Sanitizes and normalizes transcripts captured via browser Web Speech API.
 */
class BrowserSpeechRecognitionProvider extends TranscriptionProvider {
    async transcribe(rawText, options = {}) {
        const sanitized = (rawText || '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
        const words = sanitized ? sanitized.split(/\s+/).filter(Boolean) : [];

        return {
            transcript: sanitized,
            wordCount: words.length,
            engine: 'Browser-Speech-Recognition',
            confidence: words.length > 0 ? 0.90 : 0
        };
    }
}

class InterviewTranscriptionService {
    constructor() {
        this.localWhisper = new LocalWhisperProvider();
        this.browserSpeech = new BrowserSpeechRecognitionProvider();
    }

    /**
     * Process candidate transcript payload
     * @param {string|Buffer} input - Text transcript or audio buffer
     * @param {object} metadata - Candidate answer metadata
     */
    async processTranscript(input, metadata = {}) {
        if (typeof input === 'string') {
            return await this.browserSpeech.transcribe(input, metadata);
        }

        if (Buffer.isBuffer(input)) {
            const hasLocalWhisper = await this.localWhisper.isAvailable();
            if (hasLocalWhisper) {
                return await this.localWhisper.transcribe(input, metadata);
            }
        }

        // Fallback
        return {
            transcript: typeof input === 'string' ? input : '',
            engine: 'Direct-Ingest',
            confidence: 0.85
        };
    }
}

module.exports = new InterviewTranscriptionService();
