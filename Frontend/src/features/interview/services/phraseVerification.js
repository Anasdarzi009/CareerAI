/**
 * Phrase verification helper for Pre-Flight Microphone Voice Readiness Check.
 * Normalizes speech input and verifies whether it substantially matches the target phrase:
 * "I am ready to start the interview"
 *
 * Requirements:
 * - Normalizes: lowercase, strip punctuation/apostrophes, collapse whitespace.
 * - Rejects short sounds, noise, clapping, "hmm", "hello", "test", or random single words.
 * - Accepts reasonable speech recognition variants ("I'm ready to start the interview", "ready to start the interview", etc.)
 */

export const TARGET_PHRASE = 'I am ready to start the interview';

export function normalizeSpeechText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .toLowerCase()
        .replace(/['’]/g, '') // "i'm" -> "im"
        .replace(/[^a-z0-9\s]/g, ' ') // replace punctuation with spaces
        .replace(/\s+/g, ' ') // collapse multiple spaces
        .trim();
}

export function verifyInterviewPhrase(spokenText) {
    if (!spokenText || typeof spokenText !== 'string') {
        return {
            valid: false,
            normalized: '',
            similarity: 0,
            reason: 'No speech detected.'
        };
    }

    const normalized = normalizeSpeechText(spokenText);
    const words = normalized.split(' ').filter(Boolean);

    // Hard reject short sounds or single/double words (e.g. "hmm", "hello", "test", "ok")
    if (words.length < 3) {
        return {
            valid: false,
            normalized,
            similarity: 0.1,
            reason: `Too short (${words.length} word${words.length === 1 ? '' : 's'}). Please speak the complete phrase.`
        };
    }

    // Required keyword concepts
    const hasReady = normalized.includes('ready');
    const hasStartOrBegin = normalized.includes('start') || normalized.includes('begin');
    const hasInterview = normalized.includes('interview');

    // Count matched core keywords
    const matchedCount = [hasReady, hasStartOrBegin, hasInterview].filter(Boolean).length;

    // Reject if fewer than 2 core keywords are present
    if (matchedCount < 2) {
        return {
            valid: false,
            normalized,
            similarity: 0.3,
            reason: `Phrase mismatch. Essential keywords ('ready', 'start/interview') not detected.`
        };
    }

    // Exact or near-exact match
    const targetTokens = ['ready', 'start', 'interview'];
    let tokenHits = 0;
    for (const t of targetTokens) {
        if (normalized.includes(t)) tokenHits++;
    }

    const similarity = Math.min(1.0, 0.5 + (tokenHits * 0.17));

    return {
        valid: true,
        normalized,
        similarity,
        reason: 'Voice phrase verified successfully.'
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TARGET_PHRASE,
        normalizeSpeechText,
        verifyInterviewPhrase
    };
}

