const AptitudeQuestion = require('../models/aptitudeQuestion.model');
const AptitudeAttempt = require('../models/aptitudeAttempt.model');
const AptitudeAssessment = require('../models/aptitudeAssessment.model');

class AptitudeEvaluationService {
    /**
     * Sanitizes question document to prevent leaking answers and explanations
     */
    sanitizeQuestion(qDoc, includeSolution = false) {
        if (!qDoc) return null;
        const q = qDoc.toObject ? qDoc.toObject() : { ...qDoc };
        if (!includeSolution) {
            delete q.correctOptionIndex;
            delete q.explanation;
        }
        return q;
    }

    /**
     * Evaluates a single answer against the question's correct solution
     */
    evaluateAnswer(questionDoc, selectedOptionIndex) {
        const isUnattempted = selectedOptionIndex === -1 || selectedOptionIndex === null || selectedOptionIndex === undefined;
        const marks = Number(questionDoc.marks) || 1;
        const negativeMarks = Number(questionDoc.negativeMarks) || 0.25;

        if (isUnattempted) {
            return {
                isAttempted: false,
                isCorrect: false,
                score: 0,
                correctOptionIndex: questionDoc.correctOptionIndex,
                explanation: questionDoc.explanation
            };
        }

        const isCorrect = Number(selectedOptionIndex) === Number(questionDoc.correctOptionIndex);
        const score = isCorrect ? marks : -negativeMarks;

        return {
            isAttempted: true,
            isCorrect,
            score: Number(score.toFixed(2)),
            correctOptionIndex: questionDoc.correctOptionIndex,
            explanation: questionDoc.explanation
        };
    }

    /**
     * Evaluates a complete timed assessment session
     */
    async evaluateAssessment(assessmentId, candidateAnswers = [], userId) {
        const assessment = await AptitudeAssessment.findOne({ _id: assessmentId, user: userId })
            .populate('questions');

        if (!assessment) {
            throw new Error('Assessment not found or access denied.');
        }

        if (assessment.status === 'Completed') {
            return assessment;
        }

        const now = new Date();
        const answersMap = new Map();
        (candidateAnswers || []).forEach(ans => {
            if (ans && ans.questionId) {
                answersMap.set(ans.questionId.toString(), ans);
            }
        });

        let correctCount = 0;
        let incorrectCount = 0;
        let unattemptedCount = 0;
        let totalScore = 0;
        let maxPossibleScore = 0;
        let totalTimeUsed = 0;

        const evaluatedAnswers = [];
        const categoryMap = new Map();
        const difficultyMap = new Map();
        const topicMap = new Map();

        const questions = assessment.questions || [];

        for (const q of questions) {
            const qIdStr = q._id.toString();
            const candidateAns = answersMap.get(qIdStr) || {};
            const selectedIdx = candidateAns.selectedOptionIndex !== undefined ? Number(candidateAns.selectedOptionIndex) : -1;
            const isMarkedForReview = Boolean(candidateAns.isMarkedForReview);
            const timeSpent = Math.max(0, Number(candidateAns.timeSpentSeconds) || 0);

            totalTimeUsed += timeSpent;
            const qMarks = Number(q.marks) || 1;
            maxPossibleScore += qMarks;

            // Track category stats
            const cat = q.category || 'Quantitative Aptitude';
            if (!categoryMap.has(cat)) {
                categoryMap.set(cat, { total: 0, correct: 0 });
            }
            categoryMap.get(cat).total += 1;

            // Track difficulty stats
            const diff = q.difficulty || 'Medium';
            if (!difficultyMap.has(diff)) {
                difficultyMap.set(diff, { total: 0, correct: 0 });
            }
            difficultyMap.get(diff).total += 1;

            // Track topic stats
            const topic = q.topic || 'General';
            if (!topicMap.has(topic)) {
                topicMap.set(topic, { total: 0, correct: 0 });
            }
            topicMap.get(topic).total += 1;

            const isUnattempted = selectedIdx < 0 || selectedIdx > 3;
            let isCorrect = false;
            let itemScore = 0;

            if (isUnattempted) {
                unattemptedCount += 1;
                itemScore = 0;
            } else if (selectedIdx === q.correctOptionIndex) {
                correctCount += 1;
                isCorrect = true;
                itemScore = qMarks;
                categoryMap.get(cat).correct += 1;
                difficultyMap.get(diff).correct += 1;
                topicMap.get(topic).correct += 1;
            } else {
                incorrectCount += 1;
                isCorrect = false;
                itemScore = -(Number(q.negativeMarks) || 0.25);
            }

            totalScore += itemScore;

            evaluatedAnswers.push({
                question: q._id,
                selectedOptionIndex: selectedIdx,
                isMarkedForReview,
                isCorrect,
                score: Number(itemScore.toFixed(2)),
                timeSpentSeconds: timeSpent
            });

            // If question was attempted, also record individual AptitudeAttempt
            if (!isUnattempted) {
                await AptitudeAttempt.findOneAndUpdate(
                    { user: userId, question: q._id },
                    {
                        user: userId,
                        question: q._id,
                        selectedOptionIndex: selectedIdx,
                        isCorrect,
                        score: itemScore,
                        timeSpentSeconds: timeSpent
                    },
                    { upsert: true, new: true }
                );
            }
        }

        const attemptedCount = correctCount + incorrectCount;
        const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
        const percentageScore = maxPossibleScore > 0 ? Math.max(0, Math.round((totalScore / maxPossibleScore) * 100)) : 0;

        // Build category breakdown
        const categoryBreakdown = [];
        categoryMap.forEach((val, key) => {
            categoryBreakdown.push({
                category: key,
                total: val.total,
                correct: val.correct,
                accuracy: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0
            });
        });

        // Build difficulty breakdown
        const difficultyBreakdown = [];
        difficultyMap.forEach((val, key) => {
            difficultyBreakdown.push({
                difficulty: key,
                total: val.total,
                correct: val.correct,
                accuracy: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0
            });
        });

        // Compute strongest and weakest topics
        const topicList = [];
        topicMap.forEach((val, topicName) => {
            const acc = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
            topicList.push({ topic: topicName, accuracy: acc, total: val.total, correct: val.correct });
        });

        const strongestAreas = topicList
            .filter(t => t.accuracy >= 70)
            .sort((a, b) => b.accuracy - a.accuracy)
            .map(t => `${t.topic} (${t.accuracy}% Accuracy)`)
            .slice(0, 3);

        const weakestAreas = topicList
            .filter(t => t.accuracy < 70)
            .sort((a, b) => a.accuracy - b.accuracy)
            .map(t => `${t.topic} (${t.accuracy}% Accuracy)`)
            .slice(0, 3);

        const recommendedPractice = topicList
            .filter(t => t.accuracy < 70)
            .sort((a, b) => a.accuracy - b.accuracy)
            .map(t => `Practice ${t.topic} problems in Practice Workspace`)
            .slice(0, 3);

        if (recommendedPractice.length === 0) {
            recommendedPractice.push("Take advanced timed screening assessment to sustain speed and precision");
        }

        assessment.status = 'Completed';
        assessment.submittedAt = now;
        assessment.answers = evaluatedAnswers;
        assessment.overallScore = percentageScore;
        assessment.accuracy = accuracy;
        assessment.correctCount = correctCount;
        assessment.incorrectCount = incorrectCount;
        assessment.unattemptedCount = unattemptedCount;
        assessment.timeUsedSeconds = totalTimeUsed;
        assessment.categoryBreakdown = categoryBreakdown;
        assessment.difficultyBreakdown = difficultyBreakdown;
        assessment.strongestAreas = strongestAreas;
        assessment.weakestAreas = weakestAreas;
        assessment.recommendedPractice = recommendedPractice;

        await assessment.save();
        return assessment;
    }

    /**
     * Aggregates genuine candidate aptitude metrics
     */
    async getCandidateAptitudeStats(userId) {
        const [attempts, assessments] = await Promise.all([
            AptitudeAttempt.find({ user: userId }).populate('question'),
            AptitudeAssessment.find({ user: userId, status: 'Completed' }).sort({ submittedAt: -1 })
        ]);

        if (attempts.length === 0 && assessments.length === 0) {
            return {
                hasData: false,
                totalAttempts: 0,
                questionsSolved: 0,
                overallAccuracy: 0,
                quantitativeAccuracy: 0,
                logicalAccuracy: 0,
                verbalAccuracy: 0,
                averageTimeSeconds: 0,
                latestAssessmentScore: null,
                completedAssessmentsCount: 0,
                weakestAreas: [],
                recentPerformance: []
            };
        }

        const validAttempts = attempts.filter(a => a.question);
        const solvedCount = validAttempts.filter(a => a.isCorrect).length;
        const totalAttempts = validAttempts.length;
        const overallAccuracy = totalAttempts > 0 ? Math.round((solvedCount / totalAttempts) * 100) : 0;

        // Group by category
        const catStats = {
            'Quantitative Aptitude': { total: 0, correct: 0 },
            'Logical Reasoning': { total: 0, correct: 0 },
            'Verbal Ability': { total: 0, correct: 0 }
        };

        let totalTimeSpent = 0;

        validAttempts.forEach(att => {
            const cat = att.question.category;
            if (catStats[cat]) {
                catStats[cat].total += 1;
                if (att.isCorrect) catStats[cat].correct += 1;
            }
            totalTimeSpent += (att.timeSpentSeconds || 0);
        });

        const quantAcc = catStats['Quantitative Aptitude'].total > 0
            ? Math.round((catStats['Quantitative Aptitude'].correct / catStats['Quantitative Aptitude'].total) * 100)
            : 0;

        const logicalAcc = catStats['Logical Reasoning'].total > 0
            ? Math.round((catStats['Logical Reasoning'].correct / catStats['Logical Reasoning'].total) * 100)
            : 0;

        const verbalAcc = catStats['Verbal Ability'].total > 0
            ? Math.round((catStats['Verbal Ability'].correct / catStats['Verbal Ability'].total) * 100)
            : 0;

        const avgTime = totalAttempts > 0 ? Math.round(totalTimeSpent / totalAttempts) : 0;
        const latestAssessment = assessments.length > 0 ? assessments[0] : null;

        // Weakest areas from attempts and latest assessments
        const weakest = [];
        if (catStats['Quantitative Aptitude'].total > 0 && quantAcc < 60) weakest.push('Quantitative Aptitude');
        if (catStats['Logical Reasoning'].total > 0 && logicalAcc < 60) weakest.push('Logical Reasoning');
        if (catStats['Verbal Ability'].total > 0 && verbalAcc < 60) weakest.push('Verbal Ability');

        return {
            hasData: true,
            totalAttempts,
            questionsSolved: solvedCount,
            overallAccuracy,
            quantitativeAccuracy: quantAcc,
            logicalAccuracy: logicalAcc,
            verbalAccuracy: verbalAcc,
            averageTimeSeconds: avgTime,
            latestAssessmentScore: latestAssessment ? latestAssessment.overallScore : null,
            completedAssessmentsCount: assessments.length,
            weakestAreas: weakest,
            recentPerformance: assessments.slice(0, 5).map(a => ({
                id: a._id,
                title: a.title,
                score: a.overallScore,
                accuracy: a.accuracy,
                date: a.submittedAt
            }))
        };
    }
}

module.exports = new AptitudeEvaluationService();
