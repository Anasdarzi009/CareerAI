/**
 * Deterministic AI Mock Interview Evaluation Service
 * Combines Voice (30%), Content (50%), and Video (20%) into verifiable, evidence-based metrics.
 */

const { analyzeVoice } = require('./interviewVoiceAnalysis.service');
const InterviewAttempt = require('../models/interviewAttempt.model');
const InterviewQuestion = require('../models/interviewQuestion.model');

const UNCERTAINTY_PATTERNS = [
    /\bi (don't|do not) know\b/gi,
    /\bnot sure\b/gi,
    /\bno idea\b/gi,
    /\bmaybe\b/gi,
    /\bprobably\b/gi,
    /\bi guess\b/gi,
    /\bhonestly no clue\b/gi
];

/**
 * Evaluate answer content against expected key concepts and question rubric
 */
function evaluateContent(transcript = '', question = {}) {
    const text = (transcript || '').toLowerCase().trim();
    if (!text || text.length < 5) {
        return {
            technicalCorrectness: 0,
            relevance: 0,
            completeness: 0,
            confidence: 0,
            matchedConcepts: [],
            missingConcepts: question.expectedKeyPoints || [],
            feedback: 'No answer provided.'
        };
    }

    const keyPoints = question.expectedKeyPoints || [];
    const coreConcepts = question.evaluationRubric?.coreConcepts || [];
    const keywords = question.evaluationRubric?.keywords || [];

    // Concept matching (case-insensitive substring and token matching)
    const matchedConcepts = [];
    const missingConcepts = [];

    // Combine expected points and core concepts to evaluate
    const targets = keyPoints.length > 0 ? keyPoints : coreConcepts;
    
    targets.forEach((target) => {
        const wordsInTarget = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
        const matchCount = wordsInTarget.filter(w => text.includes(w)).length;
        const matchRatio = wordsInTarget.length > 0 ? matchCount / wordsInTarget.length : 0;

        if (matchRatio >= 0.4 || text.includes(target.toLowerCase())) {
            matchedConcepts.push(target);
        } else {
            missingConcepts.push(target);
        }
    });

    // Also check keywords if defined
    let keywordHits = 0;
    if (keywords.length > 0) {
        keywords.forEach(kw => {
            if (text.includes(kw.toLowerCase())) keywordHits++;
        });
    }

    const targetCount = Math.max(targets.length, 1);
    const conceptRatio = matchedConcepts.length / targetCount;
    const keywordRatio = keywords.length > 0 ? keywordHits / keywords.length : conceptRatio;

    // 1. Technical Correctness (or Behavioral Substance)
    let technicalCorrectness = 0;
    if (question.category === 'Technical' || question.category === 'System Design') {
        technicalCorrectness = Math.round((conceptRatio * 60) + (keywordRatio * 40));
        // Bonus for length / depth if concepts are mentioned
        if (matchedConcepts.length > 0 && text.split(/\s+/).length > 50) {
            technicalCorrectness = Math.min(technicalCorrectness + 10, 98);
        }
    } else {
        // Behavioral / HR: Check for STAR elements or personal narrative
        const starHits = (text.match(/\b(situation|context|task|challenge|action|decision|implemented|result|outcome|impact|learned)\b/gi) || []).length;
        technicalCorrectness = Math.min(Math.round(50 + (starHits * 8) + (conceptRatio * 30)), 96);
    }
    technicalCorrectness = Math.max(10, Math.min(technicalCorrectness, 98));

    // 2. Relevance (is the candidate answering the topic)
    const qWords = (question.question || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
    const relevantOverlap = qWords.filter(w => text.includes(w)).length;
    const qOverlapRatio = qWords.length > 0 ? relevantOverlap / qWords.length : 0.5;
    let relevance = Math.round((qOverlapRatio * 50) + (conceptRatio * 50));
    relevance = Math.max(20, Math.min(relevance, 98));

    // 3. Completeness (how many expected points were covered)
    let completeness = Math.round(conceptRatio * 100);
    completeness = Math.max(15, Math.min(completeness, 98));

    // 4. Confidence (structural directness without uncertainty tokens)
    let uncertaintyCount = 0;
    UNCERTAINTY_PATTERNS.forEach(pat => {
        const matches = text.match(pat);
        if (matches) uncertaintyCount += matches.length;
    });

    let confidence = 90 - (uncertaintyCount * 15);
    if (text.split(/\s+/).length < 20) confidence -= 20;
    confidence = Math.max(15, Math.min(confidence, 96));

    // Actionable Feedback Generator
    let feedback = '';
    if (technicalCorrectness >= 80) {
        feedback = `Excellent answer. Clear technical depth addressing ${matchedConcepts.length} core concepts.`;
    } else if (technicalCorrectness >= 60) {
        feedback = `Good foundational response. To reach top-tier rating, articulate: ${missingConcepts.slice(0, 2).join('; ') || 'additional trade-offs'}.`;
    } else {
        feedback = `Basic response. Missing key technical concepts: ${missingConcepts.slice(0, 2).join('; ') || 'core principles'}.`;
    }

    return {
        technicalCorrectness,
        relevance,
        completeness,
        confidence,
        matchedConcepts,
        missingConcepts,
        feedback
    };
}

/**
 * Evaluate video computer-vision metrics
 */
function evaluateVideo(videoData = {}) {
    const {
        hasVideo = false,
        faceDetectedPercent = 0,
        eyeContactPercent = 0,
        headStabilityPercent = 0,
        nervousnessIndicators = []
    } = videoData;

    if (!hasVideo) {
        return {
            hasVideo: false,
            videoScore: 0,
            eyeContactPercent: 0,
            headStabilityPercent: 0,
            engagementScore: 0,
            nervousnessIndicators: []
        };
    }

    // Engagement score (presence and attentiveness)
    const engagementScore = Math.min(Math.round(faceDetectedPercent), 100);

    // Eye contact score
    const eyeContact = Math.min(Math.round(eyeContactPercent), 100);

    // Head stability
    const headStability = Math.min(Math.round(headStabilityPercent), 100);

    // Nervousness penalty
    const penalty = Math.min((nervousnessIndicators.length || 0) * 8, 30);

    const videoScore = Math.max(15, Math.round((eyeContact * 0.40) + (headStability * 0.30) + (engagementScore * 0.30) - penalty));

    return {
        hasVideo: true,
        videoScore,
        eyeContactPercent: eyeContact,
        headStabilityPercent: headStability,
        engagementScore,
        nervousnessIndicators
    };
}

/**
 * Full Answer Evaluation Orchestrator
 */
function evaluateAnswer(payload = {}, question = {}) {
    const {
        candidateAnswer = '',
        transcript = '',
        audioDurationSeconds = 0,
        rawAudioData = {},
        videoMetrics = {}
    } = payload;

    const answerText = transcript || candidateAnswer || '';

    // 1. Voice Analysis
    const voiceResult = analyzeVoice(answerText, audioDurationSeconds, rawAudioData);

    // 2. Content Analysis
    const contentResult = evaluateContent(answerText, question);

    // 3. Video Analysis
    const videoResult = evaluateVideo(videoMetrics);

    // Calculate Question Composite Score
    let questionScore = 0;
    if (videoResult.hasVideo) {
        // Voice 30%, Content 50%, Video 20%
        const contentComposite = (contentResult.technicalCorrectness * 0.45) + (contentResult.relevance * 0.25) + (contentResult.completeness * 0.20) + (contentResult.confidence * 0.10);
        questionScore = Math.round((voiceResult.voiceScore * 0.30) + (contentComposite * 0.50) + (videoResult.videoScore * 0.20));
    } else {
        // Voice 35%, Content 65% (rebalanced when candidate opts out of webcam)
        const contentComposite = (contentResult.technicalCorrectness * 0.45) + (contentResult.relevance * 0.25) + (contentResult.completeness * 0.20) + (contentResult.confidence * 0.10);
        questionScore = Math.round((voiceResult.voiceScore * 0.35) + (contentComposite * 0.65));
    }

    return {
        candidateAnswer: answerText,
        transcript: answerText,
        audioDurationSeconds: +audioDurationSeconds || 0,
        voiceMetrics: {
            wpm: voiceResult.wpm,
            speechClarity: voiceResult.speechClarity,
            fluency: voiceResult.fluency,
            fillerCount: voiceResult.fillerCount,
            fillerRate: voiceResult.fillerRate,
            topFillers: voiceResult.topFillers,
            pauseCount: voiceResult.pauseCount,
            longPauseCount: voiceResult.longPauseCount,
            averagePauseSec: voiceResult.averagePauseSec
        },
        contentMetrics: {
            technicalCorrectness: contentResult.technicalCorrectness,
            relevance: contentResult.relevance,
            completeness: contentResult.completeness,
            confidence: contentResult.confidence,
            matchedConcepts: contentResult.matchedConcepts,
            missingConcepts: contentResult.missingConcepts
        },
        videoMetrics: {
            faceDetectedPercent: videoResult.engagementScore,
            eyeContactPercent: videoResult.eyeContactPercent,
            headStabilityPercent: videoResult.headStabilityPercent,
            engagementScore: videoResult.engagementScore,
            nervousnessIndicators: videoResult.nervousnessIndicators
        },
        questionScore,
        feedback: contentResult.feedback
    };
}

/**
 * Finalize and Grade Completed Interview Attempt
 */
function finalizeInterviewAttempt(attempt) {
    const questions = attempt.questions || [];
    const answeredCount = questions.filter(q => !q.isSkipped && q.candidateAnswer).length;

    if (questions.length === 0 || answeredCount === 0) {
        if (attempt.status !== 'terminated_due_to_violation') {
            attempt.status = 'Completed';
        }
        attempt.overallScore = 0;
        attempt.voiceScore = 0;
        attempt.contentScore = 0;
        attempt.videoScore = 0;
        attempt.completedAt = new Date();
        attempt.strongestAreas = ['Participation'];
        attempt.weakestAreas = ['No answers recorded'];
        attempt.recommendations = ['Complete mock interview with verbal responses.'];
        return attempt;
    }

    // Averages across questions
    let totalVoice = 0;
    let totalContent = 0;
    let totalVideo = 0;
    let totalWpm = 0;
    let totalFillers = 0;
    let totalPauses = 0;
    let totalCorrectness = 0;
    let totalRelevance = 0;
    let totalCompleteness = 0;
    let totalEyeContact = 0;
    let totalHeadStability = 0;
    let totalEngagement = 0;

    questions.forEach(q => {
        const vm = q.voiceMetrics || {};
        const cm = q.contentMetrics || {};
        const vid = q.videoMetrics || {};

        const voicePart = Math.round((vm.speechClarity || 0) * 0.3 + (vm.fluency || 0) * 0.4 + (vm.wpm > 90 ? 80 : 50) * 0.3);
        const contentPart = Math.round((cm.technicalCorrectness || 0) * 0.45 + (cm.relevance || 0) * 0.25 + (cm.completeness || 0) * 0.20 + (cm.confidence || 0) * 0.10);
        const videoPart = Math.round((vid.eyeContactPercent || 0) * 0.4 + (vid.headStabilityPercent || 0) * 0.3 + (vid.engagementScore || 0) * 0.3);

        totalVoice += voicePart;
        totalContent += contentPart;
        totalVideo += videoPart;

        totalWpm += vm.wpm || 0;
        totalFillers += vm.fillerCount || 0;
        totalPauses += vm.pauseCount || 0;

        totalCorrectness += cm.technicalCorrectness || 0;
        totalRelevance += cm.relevance || 0;
        totalCompleteness += cm.completeness || 0;

        totalEyeContact += vid.eyeContactPercent || 0;
        totalHeadStability += vid.headStabilityPercent || 0;
        totalEngagement += vid.engagementScore || 0;
    });

    const N = questions.length;
    const avgVoice = Math.round(totalVoice / N);
    const avgContent = Math.round(totalContent / N);
    const avgVideo = Math.round(totalVideo / N);

    let overallScore = 0;
    if (attempt.hasVideo) {
        overallScore = Math.round((avgVoice * 0.30) + (avgContent * 0.50) + (avgVideo * 0.20));
    } else {
        overallScore = Math.round((avgVoice * 0.35) + (avgContent * 0.65));
    }

    attempt.overallScore = Math.min(Math.max(overallScore, 5), 98);
    attempt.voiceScore = avgVoice;
    attempt.contentScore = avgContent;
    attempt.videoScore = attempt.hasVideo ? avgVideo : 0;

    attempt.voiceSummary = {
        averageWpm: Math.round(totalWpm / N),
        totalFillers,
        totalPauses,
        fluencyRating: avgVoice >= 80 ? 'Fluent & Articulate' : (avgVoice >= 60 ? 'Standard Cadence' : 'Hesitant / Fillers Present')
    };

    attempt.contentSummary = {
        averageCorrectness: Math.round(totalCorrectness / N),
        averageRelevance: Math.round(totalRelevance / N),
        averageCompleteness: Math.round(totalCompleteness / N)
    };

    attempt.videoSummary = {
        averageEyeContact: Math.round(totalEyeContact / N),
        averageHeadStability: Math.round(totalHeadStability / N),
        averageEngagement: Math.round(totalEngagement / N)
    };

    // Diagnostic Strengths & Weaknesses
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    if (avgContent >= 75) strengths.push('Strong Technical & Domain Knowledge');
    else {
        weaknesses.push('Technical Depth & Concept Completeness');
        recommendations.push('Review system architecture and technical trade-offs before interviewing.');
    }

    if (avgVoice >= 75) strengths.push('Clear Speech Cadence & High Fluency');
    else {
        weaknesses.push('High Verbal Filler Density or Speech Hesitation');
        recommendations.push('Practice pausing silently rather than using verbal filler words.');
    }

    if (attempt.hasVideo) {
        if (avgVideo >= 75) strengths.push('Consistent Camera Eye Contact & Presentation');
        else {
            weaknesses.push('Gaze Shift Away from Camera / Presentation Stability');
            recommendations.push('Position your camera at eye level and maintain direct gaze while responding.');
        }
    }

    if (strengths.length === 0) strengths.push('Interview Completion & Structural Effort');
    if (weaknesses.length === 0) weaknesses.push('None - Balanced Performance');
    if (attempt.status === 'terminated_due_to_violation') {
        recommendations.unshift('Session was terminated due to a monitoring violation (e.g. browser tab switch). Maintain continuous workspace focus.');
    } else {
        attempt.status = 'Completed';
    }
    attempt.completedAt = new Date();

    return attempt;
}

/**
 * Get Candidate Aggregated Interview Statistics
 */
async function getCandidateInterviewStats(userId) {
    const attempts = await InterviewAttempt.find({ user: userId, status: { $in: ['Completed', 'terminated_due_to_violation'] } }).sort({ createdAt: -1 });

    if (!attempts || attempts.length === 0) {
        return {
            hasData: false,
            totalInterviews: 0,
            bestScore: 0,
            averageScore: 0,
            voicePerformance: 0,
            contentPerformance: 0,
            videoPerformance: 0,
            totalQuestionsAnswered: 0,
            recentAttempts: []
        };
    }

    const total = attempts.length;
    const bestScore = Math.max(...attempts.map(a => a.overallScore || 0));
    const averageScore = Math.round(attempts.reduce((sum, a) => sum + (a.overallScore || 0), 0) / total);
    const voicePerformance = Math.round(attempts.reduce((sum, a) => sum + (a.voiceScore || 0), 0) / total);
    const contentPerformance = Math.round(attempts.reduce((sum, a) => sum + (a.contentScore || 0), 0) / total);
    const videoPerformance = Math.round(attempts.reduce((sum, a) => sum + (a.videoScore || 0), 0) / total);
    
    let totalQuestions = 0;
    attempts.forEach(a => {
        totalQuestions += (a.questions || []).filter(q => q.candidateAnswer).length;
    });

    return {
        hasData: true,
        totalInterviews: total,
        bestScore,
        averageScore,
        voicePerformance,
        contentPerformance,
        videoPerformance,
        totalQuestionsAnswered: totalQuestions,
        recentAttempts: attempts.slice(0, 5)
    };
}

module.exports = {
    evaluateContent,
    evaluateVideo,
    evaluateAnswer,
    finalizeInterviewAttempt,
    getCandidateInterviewStats
};
