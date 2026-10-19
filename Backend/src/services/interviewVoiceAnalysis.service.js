/**
 * Deterministic Voice Analysis Service
 * Evaluates candidate speech data: Speech Clarity, Fluency, Speaking Speed (WPM), Pauses, and Filler Words.
 */

const FILLER_PATTERNS = [
    { word: 'um', regex: /\bum+\b/gi },
    { word: 'uh', regex: /\buh+\b/gi },
    { word: 'hmm', regex: /\bhmm+\b/gi },
    { word: 'like', regex: /\blike\b/gi },
    { word: 'basically', regex: /\bbasically\b/gi },
    { word: 'actually', regex: /\bactually\b/gi },
    { word: 'you know', regex: /\byou know\b/gi },
    { word: 'so', regex: /\bso\b/gi },
    { word: 'well', regex: /\bwell\b/gi },
    { word: 'i mean', regex: /\bi mean\b/gi }
];

/**
 * Analyze candidate transcript and audio duration
 * @param {string} transcript - Verbatim candidate transcript
 * @param {number} durationSeconds - Actual audio answer duration in seconds
 * @param {object} rawAudioData - Optional timestamp or silence metadata
 */
function analyzeVoice(transcript = '', durationSeconds = 0, rawAudioData = {}) {
    const text = (transcript || '').trim();
    const durationMin = Math.max((durationSeconds || 0) / 60, 0.05);

    // Words extraction
    const words = text ? text.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    // 1. Speaking Speed (Words Per Minute)
    const wpm = durationSeconds > 0 ? Math.round(wordCount / durationMin) : 0;
    
    // Optimal WPM: 110 - 160 WPM
    let speedScore = 0;
    if (wpm >= 110 && wpm <= 160) {
        speedScore = 95;
    } else if (wpm >= 90 && wpm < 110) {
        speedScore = 80;
    } else if (wpm > 160 && wpm <= 190) {
        speedScore = 80;
    } else if (wpm > 0 && wpm < 90) {
        speedScore = 60; // Too hesitant
    } else if (wpm > 190) {
        speedScore = 65; // Rushed
    } else {
        speedScore = 0; // Empty
    }

    // 2. Filler Words Detection
    const detectedFillers = [];
    let totalFillers = 0;

    FILLER_PATTERNS.forEach(({ word, regex }) => {
        const matches = text.match(regex);
        if (matches && matches.length > 0) {
            totalFillers += matches.length;
            detectedFillers.push({ word, count: matches.length });
        }
    });

    detectedFillers.sort((a, b) => b.count - a.count);
    const topFillers = detectedFillers.slice(0, 3).map(f => `${f.word} (${f.count})`);

    // Filler rate per 100 words
    const fillerRate = wordCount > 0 ? +((totalFillers / wordCount) * 100).toFixed(1) : 0;

    // Filler score (lower filler rate = higher score)
    let fillerScore = 95;
    if (fillerRate > 12) fillerScore = 40;
    else if (fillerRate > 8) fillerScore = 60;
    else if (fillerRate > 4) fillerScore = 75;
    else if (fillerRate > 1) fillerScore = 88;

    // 3. Pauses Analysis
    // Pauses can be passed from client Web Audio silence detector or estimated from punctuation / duration-to-word cadence
    let pauseCount = rawAudioData.pauseCount || 0;
    let longPauseCount = rawAudioData.longPauseCount || 0;
    let averagePauseSec = rawAudioData.averagePauseSec || 0;

    if (!pauseCount && text) {
        // Fallback: Estimate pauses from punctuation, ellipses, and speech density
        const pausePunctuation = (text.match(/(\.\.\.|—|\. |, |; )/g) || []).length;
        pauseCount = Math.max(pausePunctuation, Math.floor(durationSeconds / 8));
        
        // If candidate took 60 seconds to speak 20 words, significant pauses occurred
        if (durationSeconds > 15 && wpm < 70) {
            longPauseCount = Math.floor((durationSeconds - (wordCount * 0.4)) / 4);
        }
        averagePauseSec = pauseCount > 0 ? +((durationSeconds * 0.2) / pauseCount).toFixed(1) : 0;
    }

    let pauseScore = 90;
    if (longPauseCount > 4) pauseScore = 55;
    else if (longPauseCount > 2) pauseScore = 70;
    else if (longPauseCount > 0) pauseScore = 82;

    // 4. Fluency (continuity, sentence cadence, lack of repeated restarts)
    // Checks for repeated consecutive words e.g. "I I think think"
    const repeatedWords = (text.match(/\b(\w+)\s+\1\b/gi) || []).length;
    let fluency = Math.round((speedScore * 0.35) + (fillerScore * 0.35) + (pauseScore * 0.30) - (repeatedWords * 5));
    fluency = Math.max(10, Math.min(fluency, 98));

    // 5. Speech Clarity
    // Derived from word count adequacy, sentence structure, and low filler distortion
    let clarity = 0;
    if (wordCount >= 30) {
        clarity = Math.round(92 - (fillerRate * 1.5) - (repeatedWords * 3));
    } else if (wordCount >= 10) {
        clarity = 70;
    } else if (wordCount > 0) {
        clarity = 45;
    } else {
        clarity = 0;
    }
    clarity = wordCount > 0 ? Math.max(10, Math.min(clarity, 98)) : 0;

    // Overall Voice Score
    const voiceScore = text ? Math.round((clarity * 0.30) + (fluency * 0.30) + (speedScore * 0.20) + (fillerScore * 0.20)) : 0;

    return {
        wpm,
        speechClarity: clarity,
        fluency,
        fillerCount: totalFillers,
        fillerRate,
        topFillers,
        pauseCount,
        longPauseCount,
        averagePauseSec,
        voiceScore
    };
}

module.exports = {
    analyzeVoice
};
