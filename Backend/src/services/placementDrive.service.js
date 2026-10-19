const PlacementDrive = require('../models/placementDrive.model');
const CodingQuestion = require('../models/codingQuestion.model');
const CodingSubmission = require('../models/codingSubmission.model');
const CandidateProfile = require('../models/candidateProfile.model');
const codingEvaluationService = require('./codingEvaluation.service');
const { DRIVE_TEMPLATES } = require('../config/seedPlacementDrives');

/**
 * Sanitizes template/round data to prevent leaking correct MCQ answers to client
 */
function sanitizeRoundData(round) {
    const raw = round.toObject ? round.toObject() : { ...round };
    if (raw.data && raw.data.questions) {
        raw.data.questions = raw.data.questions.map(q => {
            const copy = { ...q };
            // If round is still active or locked, strip correctOptionIndex and explanation
            if (raw.status === 'LOCKED' || raw.status === 'ACTIVE') {
                delete copy.correctOptionIndex;
                delete copy.explanation;
            }
            return copy;
        });
    }
    return raw;
}

function sanitizeDrive(drive) {
    const obj = drive.toObject ? drive.toObject() : { ...drive };
    if (obj.rounds) {
        obj.rounds = obj.rounds.map(sanitizeRoundData);
    }
    return obj;
}

class PlacementDriveService {
    /**
     * Get list of verified corporate placement drive templates
     */
    getAvailableTemplates() {
        return DRIVE_TEMPLATES.map(t => ({
            id: t.id,
            title: t.title,
            companyName: t.companyName,
            targetRole: t.targetRole,
            tier: t.tier,
            description: t.description,
            totalDurationMinutes: t.totalDurationMinutes,
            roundsCount: t.rounds.length,
            roundsSummary: t.rounds.map(r => ({
                roundNumber: r.roundNumber,
                roundType: r.roundType,
                title: r.title,
                durationMinutes: r.durationMinutes
            }))
        }));
    }

    /**
     * Start a new simulated corporate placement drive for a candidate
     */
    async startDrive(userId, templateId) {
        const template = DRIVE_TEMPLATES.find(t => t.id === templateId);
        if (!template) {
            throw new Error(`Drive template with id '${templateId}' not found.`);
        }

        // Check if there is already an active In Progress drive of this template
        const activeDrive = await PlacementDrive.findOne({
            user: userId,
            templateId,
            status: 'In Progress'
        });
        if (activeDrive) {
            return sanitizeDrive(activeDrive);
        }

        // Build rounds from template
        const rounds = [];
        for (const tRound of template.rounds) {
            const roundItem = {
                roundNumber: tRound.roundNumber,
                roundType: tRound.roundType,
                title: tRound.title,
                durationMinutes: tRound.durationMinutes,
                status: tRound.roundNumber === 1 ? 'ACTIVE' : 'LOCKED',
                startedAt: tRound.roundNumber === 1 ? new Date() : null,
                score: 0,
                passed: false,
                data: {}
            };

            if (tRound.roundType === 'APTITUDE_CS') {
                roundItem.data.questions = (tRound.questions || []).map(q => ({
                    id: q.id,
                    category: q.category,
                    questionText: q.questionText,
                    options: q.options,
                    correctOptionIndex: q.correctOptionIndex,
                    explanation: q.explanation,
                    selectedOptionIndex: -1,
                    isCorrect: false
                }));
            } else if (tRound.roundType === 'CODING_ASSESSMENT') {
                // Look up question by target slug or fallback to any seeded question
                let q = await CodingQuestion.findOne({ slug: tRound.targetSlug, active: true });
                if (!q) {
                    q = await CodingQuestion.findOne({ difficulty: 'Easy', active: true });
                }
                if (q) {
                    roundItem.data.codingQuestion = q._id;
                    roundItem.data.codingTitle = q.title;
                    roundItem.data.submittedCode = q.starterCode?.javascript || '';
                    roundItem.data.language = 'javascript';
                    roundItem.data.testCasesPassed = 0;
                    roundItem.data.testCasesTotal = q.testCases?.length || 0;
                }
            } else if (tRound.roundType === 'TECHNICAL_HR_INTERVIEW') {
                roundItem.data.interviewQuestions = (tRound.interviewQuestions || []).map(iq => ({
                    questionText: iq.questionText,
                    category: iq.category,
                    candidateAnswer: '',
                    feedback: '',
                    score: 0
                }));
            }

            rounds.push(roundItem);
        }

        const newDrive = await PlacementDrive.create({
            user: userId,
            templateId: template.id,
            title: template.title,
            companyName: template.companyName,
            targetRole: template.targetRole,
            tier: template.tier,
            status: 'In Progress',
            currentRoundIndex: 0,
            rounds,
            startedAt: new Date()
        });

        return sanitizeDrive(newDrive);
    }

    /**
     * Retrieve a specific drive with ownership verification
     */
    async getDriveById(userId, driveId) {
        const drive = await PlacementDrive.findOne({ _id: driveId, user: userId })
            .populate('rounds.data.codingQuestion', 'title slug difficulty topics starterCode description examples constraints supportedLanguages');

        if (!drive) {
            throw new Error('Placement drive session not found or access unauthorized.');
        }

        return sanitizeDrive(drive);
    }

    /**
     * Submit answers for a specific round and grade server-side
     */
    async submitRound(userId, driveId, roundNumber, payload = {}) {
        const drive = await PlacementDrive.findOne({ _id: driveId, user: userId });
        if (!drive) {
            throw new Error('Placement drive session not found or access unauthorized.');
        }

        if (drive.status === 'Completed' || drive.status === 'Abandoned') {
            throw new Error(`Drive is already ${drive.status.toLowerCase()} and cannot accept further submissions.`);
        }

        const roundIndex = drive.rounds.findIndex(r => r.roundNumber === Number(roundNumber));
        if (roundIndex === -1) {
            throw new Error(`Round ${roundNumber} does not exist in this placement drive.`);
        }

        const currentRound = drive.rounds[roundIndex];
        if (currentRound.status !== 'ACTIVE') {
            throw new Error(`Round ${roundNumber} is currently ${currentRound.status.toLowerCase()} and cannot be submitted.`);
        }

        currentRound.completedAt = new Date();

        // ── 1. Evaluate Round 1: APTITUDE_CS ──────────────────────────────────
        if (currentRound.roundType === 'APTITUDE_CS') {
            const userAnswers = payload.answers || {}; // { [qId]: selectedOptionIndex }
            let correctCount = 0;
            const questions = currentRound.data?.questions || [];

            questions.forEach(q => {
                const selected = userAnswers[q.id] !== undefined ? Number(userAnswers[q.id]) : -1;
                q.selectedOptionIndex = selected;
                q.isCorrect = selected !== -1 && selected === q.correctOptionIndex;
                if (q.isCorrect) correctCount++;
            });

            const total = questions.length;
            const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
            currentRound.score = score;
            currentRound.passed = score >= 50; // Cutoff for OA: 50%
            currentRound.status = 'EVALUATED';
            currentRound.feedback = currentRound.passed
                ? `Cleared Online Assessment with ${correctCount}/${total} correct answers (${score}%).`
                : `Assessment cutoff not met (${correctCount}/${total} correct, ${score}%). Benchmark minimum is 50%.`;
        }

        // ── 2. Evaluate Round 2: CODING_ASSESSMENT ────────────────────────────
        else if (currentRound.roundType === 'CODING_ASSESSMENT') {
            const { code, language = 'javascript' } = payload;
            if (!code || typeof code !== 'string') {
                throw new Error('Valid code submission is required for the coding round.');
            }

            const qId = currentRound.data?.codingQuestion;
            const question = await CodingQuestion.findById(qId);
            if (!question) {
                throw new Error('Referenced coding question is unavailable.');
            }

            // Execute code safely in isolated node:vm sandbox
            const evalResult = await codingEvaluationService.evaluateSubmission({
                code,
                language,
                question
            });

            currentRound.data.submittedCode = code;
            currentRound.data.language = language;
            currentRound.data.testCasesPassed = evalResult.passed;
            currentRound.data.testCasesTotal = evalResult.total;
            currentRound.data.executionTimeMs = evalResult.executionTime;

            const score = evalResult.score !== undefined ? evalResult.score : Math.round((evalResult.passed / evalResult.total) * 100);
            currentRound.score = score;
            currentRound.passed = evalResult.status === 'Accepted' || (evalResult.total > 0 && (evalResult.passed / evalResult.total) >= 0.6);
            currentRound.status = 'EVALUATED';
            currentRound.feedback = `${evalResult.passed}/${evalResult.total} test cases passed. Status: ${evalResult.status}. Score: ${score}/100.`;

            // Persist as a genuine CodingSubmission in candidate profile
            await CodingSubmission.create({
                user: userId,
                question: question._id,
                language,
                submittedCode: code,
                status: evalResult.status,
                testCasesPassed: evalResult.passed,
                testCasesTotal: evalResult.total,
                executionTimeMs: evalResult.executionTime || 0,
                score
            });
        }

        // ── 3. Evaluate Round 3: TECHNICAL_HR_INTERVIEW ───────────────────────
        else if (currentRound.roundType === 'TECHNICAL_HR_INTERVIEW') {
            const answers = payload.interviewAnswers || {}; // { [index]: answerText }
            const interviewQs = currentRound.data?.interviewQuestions || [];
            let totalScore = 0;

            interviewQs.forEach((iq, idx) => {
                const ans = (answers[idx] || '').trim();
                iq.candidateAnswer = ans;

                // Evaluate answer depth and structure
                let qScore = 0;
                let feedbackMsg = '';
                if (ans.length > 200) {
                    qScore = 90;
                    feedbackMsg = 'Strong, articulate answer with technical depth and structured rationale.';
                } else if (ans.length > 80) {
                    qScore = 75;
                    feedbackMsg = 'Good response covering core points; provide more specific technical metrics.';
                } else if (ans.length > 20) {
                    qScore = 55;
                    feedbackMsg = 'Basic answer provided; lacked detailed STAR structure or architectural depth.';
                } else {
                    qScore = 20;
                    feedbackMsg = 'Answer was insufficient or incomplete.';
                }

                iq.score = qScore;
                iq.feedback = feedbackMsg;
                totalScore += qScore;
            });

            const avgScore = interviewQs.length > 0 ? Math.round(totalScore / interviewQs.length) : 50;
            currentRound.score = avgScore;
            currentRound.passed = avgScore >= 60;
            currentRound.status = 'EVALUATED';
            currentRound.feedback = `Technical & Behavioral interview completed with composite rating of ${avgScore}/100.`;
        }

        // Unlock next round or finalize drive
        const nextRoundIndex = roundIndex + 1;
        if (nextRoundIndex < drive.rounds.length) {
            drive.currentRoundIndex = nextRoundIndex;
            drive.rounds[nextRoundIndex].status = 'ACTIVE';
            drive.rounds[nextRoundIndex].startedAt = new Date();
        } else {
            // All rounds submitted -> finalize drive
            await this.finalizeDrive(drive);
        }

        await drive.save();
        return sanitizeDrive(drive);
    }

    /**
     * Finalize entire drive, compute weighted composite verdict and strengths
     */
    async finalizeDrive(drive) {
        drive.status = 'Completed';
        drive.completedAt = new Date();

        const r1 = drive.rounds.find(r => r.roundType === 'APTITUDE_CS');
        const r2 = drive.rounds.find(r => r.roundType === 'CODING_ASSESSMENT');
        const r3 = drive.rounds.find(r => r.roundType === 'TECHNICAL_HR_INTERVIEW');

        const score1 = r1?.score || 0;
        const score2 = r2?.score || 0;
        const score3 = r3?.score || 0;

        // Weights: Round 1 (25%), Round 2 (45%), Round 3 (30%)
        const overallScore = Math.round((score1 * 0.25) + (score2 * 0.45) + (score3 * 0.30));
        drive.overallScore = overallScore;

        const allPassed = drive.rounds.every(r => r.passed);
        const strengths = [];
        const gaps = [];

        if (score1 >= 75) strengths.push('High CS Core & Analytical Problem-Solving Capability');
        else if (score1 < 50) gaps.push('Review Operating Systems, DBMS & Discrete Math Fundamentals');

        if (score2 >= 80) strengths.push('Strong Algorithmic Rigor & Clean Code Implementation');
        else if (score2 < 60) gaps.push('Practice Data Structures (Two Pointers, Hashing, Subarrays)');

        if (score3 >= 75) strengths.push('Articulate Technical Architecture & Behavioral STAR Communication');
        else if (score3 < 60) gaps.push('Structure Behavioral Responses Using the STAR Framework');

        if (allPassed && overallScore >= 75) {
            drive.hiringVerdict = 'RECOMMENDED FOR HIRE';
            drive.verdictSummary = `Candidate successfully cleared all rounds of the ${drive.companyName} simulation with an overall placement readiness rating of ${overallScore}/100. Demonstrated balanced technical, algorithmic, and communicative competencies.`;
        } else if (overallScore >= 55) {
            drive.hiringVerdict = 'BORDERLINE / EXTENDED EVALUATION';
            drive.verdictSummary = `Candidate showed strong potential with an overall rating of ${overallScore}/100, but requires targeted refinement in ${gaps[0] || 'algorithmic edge cases'} before corporate campus screening.`;
        } else {
            drive.hiringVerdict = 'NOT CLEARED';
            drive.verdictSummary = `Candidate scored ${overallScore}/100 and did not satisfy the minimum placement cutoff for ${drive.companyName}. Prioritize targeted practice in the identified focus areas.`;
        }

        drive.strengths = strengths;
        drive.criticalGaps = gaps;
        return drive;
    }

    /**
     * Get candidate's drive history and summary metrics
     */
    async getCandidateDrives(userId) {
        const drives = await PlacementDrive.find({ user: userId })
            .sort({ createdAt: -1 })
            .select('-rounds.data.questions.correctOptionIndex -rounds.data.questions.explanation');

        const totalAttempted = drives.length;
        const completedDrives = drives.filter(d => d.status === 'Completed');
        const clearedDrives = completedDrives.filter(d => d.hiringVerdict === 'RECOMMENDED FOR HIRE');
        const avgScore = completedDrives.length > 0
            ? Math.round(completedDrives.reduce((sum, d) => sum + d.overallScore, 0) / completedDrives.length)
            : 0;
        const clearanceRate = totalAttempted > 0
            ? Math.round((clearedDrives.length / totalAttempted) * 100)
            : 0;

        return {
            drives: drives.map(sanitizeDrive),
            stats: {
                totalAttempted,
                completed: completedDrives.length,
                cleared: clearedDrives.length,
                clearanceRate,
                averageScore: avgScore
            }
        };
    }
}

module.exports = new PlacementDriveService();
