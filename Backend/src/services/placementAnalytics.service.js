const crypto = require('crypto');
const PlacementAnalytics = require('../models/placementAnalytics.model');
const CandidateProfile = require('../models/candidateProfile.model');
const CodingSubmission = require('../models/codingSubmission.model');
const CodingAssessment = require('../models/codingAssessment.model');
const AptitudeAttempt = require('../models/aptitudeAttempt.model');
const AptitudeAssessment = require('../models/aptitudeAssessment.model');
const PlacementDrive = require('../models/placementDrive.model');
const InterviewReport = require('../models/interviewReport.model');
const InterviewAttempt = require('../models/interviewAttempt.model');
const SkillGap = require('../models/skillGap.model');
const JobApplication = require('../models/jobApplication.model');

class PlacementAnalyticsService {
    /**
     * Compute comprehensive recruitment gates from real database models
     */
    evaluateRecruitmentGates(profile, codingSubs, codingAssessments, drives, interviews, skillGapDoc, aptitudeAttempts = [], aptitudeAssessments = [], mockInterviews = []) {
        // ── Gate 1: Academic & First-Round Online Screening Gate ──────────
        const ssc = profile?.academics?.ssc?.percentage || 0;
        const hsc = profile?.academics?.hsc?.percentage || profile?.academics?.diploma?.percentageOrCgpa || 0;
        const rawCgpa = profile?.academics?.undergraduate?.cgpaOrPercentage || 0;
        const cgpa = rawCgpa <= 10 ? rawCgpa : (rawCgpa / 10); // normalize 0-10
        const backlogs = profile?.academics?.undergraduate?.activeBacklogs || 0;

        let academicScore = 0;
        let academicStatus = 'BLOCKED';
        let academicBottleneck = null;

        if (ssc >= 75 && hsc >= 75 && cgpa >= 8.0 && backlogs === 0) {
            academicScore = 95;
            academicStatus = 'CLEARED';
        } else if (ssc >= 65 && hsc >= 65 && cgpa >= 7.0 && backlogs === 0) {
            academicScore = 80;
            academicStatus = 'COMPETITIVE';
        } else if (ssc >= 60 && hsc >= 60 && cgpa >= 6.0) {
            academicScore = 65;
            academicStatus = 'RISK';
            academicBottleneck = 'Meets basic 60% mass-hiring cutoff but excluded from Tier-1 70-75% criteria.';
        } else if (ssc > 0 || hsc > 0 || cgpa > 0) {
            academicScore = 40;
            academicStatus = 'BLOCKED';
            academicBottleneck = 'Below 60% minimum cutoff in secondary or undergraduate academics.';
        } else {
            academicScore = 0;
            academicStatus = 'BLOCKED';
            academicBottleneck = 'Academic profile is unpopulated. Complete SSC, HSC and CGPA records.';
        }

        const solvedApt = (aptitudeAttempts || []).filter(a => a.isCorrect).length;
        const compApt = (aptitudeAssessments || []).filter(a => a.status === 'Completed');
        const avgAptScore = compApt.length > 0
            ? Math.round(compApt.reduce((acc, a) => acc + (a.overallScore || 0), 0) / compApt.length)
            : 0;

        let aptStr = '';
        if (solvedApt > 0 || compApt.length > 0) {
            aptStr = ` | Aptitude: ${solvedApt} solved${compApt.length > 0 ? ` (Assessment: ${avgAptScore}%)` : ''}`;
            if (academicScore > 0 && (solvedApt >= 5 || avgAptScore >= 70)) {
                academicScore = Math.min(100, academicScore + 5);
                if (academicScore >= 85) academicStatus = 'CLEARED';
            }
        }

        const academicEvidence = (ssc > 0 || cgpa > 0)
            ? `10th: ${ssc || 'N/A'}% | 12th: ${hsc || 'N/A'}% | UG CGPA: ${cgpa || 'N/A'} | Backlogs: ${backlogs}${aptStr}`
            : 'No academic records submitted.';

        // ── Gate 2: Coding & Algorithmic Rigor Gate ────────────────────────
        const acceptedSubs = codingSubs.filter(s => s.status === 'Accepted' || (s.testCasesTotal > 0 && (s.testCasesPassed / s.testCasesTotal) >= 0.7));
        const totalSubs = codingSubs.length;
        const completedAssessments = codingAssessments.filter(a => a.status === 'Completed');
        const avgAssessScore = completedAssessments.length > 0
            ? Math.round(completedAssessments.reduce((acc, a) => acc + (a.score || 0), 0) / completedAssessments.length)
            : 0;

        let codingScore = 0;
        let codingStatus = 'BLOCKED';
        let codingBottleneck = null;

        if (acceptedSubs.length >= 8 || avgAssessScore >= 80) {
            codingScore = Math.min(Math.round(60 + (acceptedSubs.length * 4) + (avgAssessScore * 0.2)), 100);
            codingStatus = codingScore >= 85 ? 'CLEARED' : 'COMPETITIVE';
        } else if (acceptedSubs.length >= 3 || avgAssessScore >= 50) {
            codingScore = Math.round(40 + (acceptedSubs.length * 5) + (avgAssessScore * 0.2));
            codingStatus = 'RISK';
            codingBottleneck = 'Basic algorithmic competence demonstrated; needs medium/hard graph & DP practice.';
        } else if (totalSubs > 0) {
            codingScore = 30;
            codingStatus = 'RISK';
            codingBottleneck = 'Submissions recorded but acceptance rate is low. Refine edge-case testing.';
        } else {
            codingScore = 0;
            codingStatus = 'BLOCKED';
            codingBottleneck = 'Zero verified algorithmic coding submissions or assessments completed.';
        }

        const codingEvidence = totalSubs > 0
            ? `${acceptedSubs.length}/${totalSubs} solved/accepted submissions | ${completedAssessments.length} timed assessments (Avg: ${avgAssessScore}%)`
            : 'No coding submissions on record.';

        // ── Gate 3: Domain Skills & Project Experience Gate ────────────────
        const skillsCount = profile?.skills?.length || 0;
        const projectsCount = profile?.projects?.length || 0;
        const missingGaps = skillGapDoc?.missingSkills?.length || 0;
        const coveredSkills = skillGapDoc?.matchedSkills?.length || 0;

        let skillScore = 0;
        let skillStatus = 'BLOCKED';
        let skillBottleneck = null;

        if (skillsCount >= 5 && projectsCount >= 2) {
            skillScore = Math.min(Math.round(50 + (skillsCount * 4) + (projectsCount * 10) - (missingGaps * 3)), 100);
            skillStatus = skillScore >= 80 ? 'CLEARED' : 'COMPETITIVE';
        } else if (skillsCount >= 2 || projectsCount >= 1) {
            skillScore = Math.round(30 + (skillsCount * 5) + (projectsCount * 10));
            skillStatus = 'RISK';
            skillBottleneck = 'Add at least 2 full-stack/production-grade projects with GitHub links.';
        } else {
            skillScore = 0;
            skillStatus = 'BLOCKED';
            skillBottleneck = 'Skills inventory and technical projects are missing from profile.';
        }

        const skillEvidence = `${skillsCount} verified skills | ${projectsCount} technical projects | ${coveredSkills} target skills covered`;

        // ── Gate 4: Technical & HR Interview Depth Gate ────────────────────
        const validInterviews = (interviews || []).filter(i => (i.matchScore || i.score || 0) > 0);
        const validMocks = (mockInterviews || []).filter(m => (m.overallScore || 0) > 0);
        const allScores = [
            ...validInterviews.map(i => i.matchScore || i.score || 0),
            ...validMocks.map(m => m.overallScore || 0)
        ];
        const totalValid = allScores.length;
        const avgInterview = totalValid > 0
            ? Math.round(allScores.reduce((acc, s) => acc + s, 0) / totalValid)
            : 0;

        let interviewScore = 0;
        let interviewStatus = 'BLOCKED';
        let interviewBottleneck = null;

        if (totalValid >= 2 && avgInterview >= 75) {
            interviewScore = Math.min(avgInterview, 98);
            interviewStatus = 'CLEARED';
        } else if (totalValid >= 1 && avgInterview >= 60) {
            interviewScore = avgInterview;
            interviewStatus = 'COMPETITIVE';
        } else if (totalValid >= 1) {
            interviewScore = Math.max(avgInterview, 35);
            interviewStatus = 'RISK';
            interviewBottleneck = 'Interview scores below 60%. Structure technical rationale using the STAR format.';
        } else {
            interviewScore = 0;
            interviewStatus = 'BLOCKED';
            interviewBottleneck = 'No mock technical interviews completed.';
        }

        const interviewEvidence = totalValid > 0
            ? `${totalValid} interview sessions verified (${validMocks.length} live mock, ${validInterviews.length} prep plans) | Avg: ${avgInterview}%`
            : 'No interview sessions completed.';

        // ── Gate 5: Mock Placement Drive Gate ──────────────────────────────
        const completedDrives = drives.filter(d => d.status === 'Completed');
        const clearedDrives = completedDrives.filter(d => d.hiringVerdict === 'RECOMMENDED FOR HIRE');
        const borderlineDrives = completedDrives.filter(d => d.hiringVerdict === 'BORDERLINE / EXTENDED EVALUATION');

        let driveScore = 0;
        let driveStatus = 'BLOCKED';
        let driveBottleneck = null;

        if (clearedDrives.length >= 1) {
            driveScore = Math.min(85 + (clearedDrives.length * 5), 100);
            driveStatus = 'CLEARED';
        } else if (borderlineDrives.length >= 1) {
            driveScore = 65;
            driveStatus = 'COMPETITIVE';
            driveBottleneck = 'Placement drive marked for extended evaluation. Retake to achieve direct hire verdict.';
        } else if (completedDrives.length >= 1) {
            driveScore = 45;
            driveStatus = 'RISK';
            driveBottleneck = 'Placement drive completed but cutoff was not cleared.';
        } else {
            driveScore = 0;
            driveStatus = 'BLOCKED';
            driveBottleneck = 'Candidate has not completed any full corporate placement drive simulation.';
        }

        const driveEvidence = completedDrives.length > 0
            ? `${completedDrives.length} drives attempted | ${clearedDrives.length} cleared with direct hire verdict`
            : 'No corporate placement drives attempted.';

        return [
            {
                gateName: 'ACADEMIC_CRITERIA',
                displayName: 'Academic Eligibility Cutoffs',
                score: academicScore,
                status: academicStatus,
                evidence: academicEvidence,
                bottleneckReason: academicBottleneck
            },
            {
                gateName: 'CODING_RIGOR',
                displayName: 'Algorithmic Problem-Solving',
                score: codingScore,
                status: codingStatus,
                evidence: codingEvidence,
                bottleneckReason: codingBottleneck
            },
            {
                gateName: 'DOMAIN_SKILLS',
                displayName: 'Domain Skills & Project Portfolio',
                score: skillScore,
                status: skillStatus,
                evidence: skillEvidence,
                bottleneckReason: skillBottleneck
            },
            {
                gateName: 'INTERVIEW_DEPTH',
                displayName: 'Technical & Behavioral Communication',
                score: interviewScore,
                status: interviewStatus,
                evidence: interviewEvidence,
                bottleneckReason: interviewBottleneck
            },
            {
                gateName: 'DRIVE_VALIDATION',
                displayName: 'Corporate Drive Simulation',
                score: driveScore,
                status: driveStatus,
                evidence: driveEvidence,
                bottleneckReason: driveBottleneck
            }
        ];
    }

    /**
     * Compute tier-specific offer probabilities using industry gateway models
     */
    calculateTierProbabilities(gates) {
        const getGate = (name) => gates.find(g => g.gateName === name)?.score || 0;
        const gAcad = getGate('ACADEMIC_CRITERIA');
        const gCode = getGate('CODING_RIGOR');
        const gSkill = getGate('DOMAIN_SKILLS');
        const gInt = getGate('INTERVIEW_DEPTH');
        const gDrive = getGate('DRIVE_VALIDATION');

        // 1. Tier 1 Product (FAANG+, Google, Amazon, Microsoft, Uber, Atlassian)
        // Strictest: Heavy on DSA Coding (40%) and Academic (20%) + Drive (20%)
        let pTier1 = Math.round((gCode * 0.40) + (gAcad * 0.20) + (gDrive * 0.20) + (gInt * 0.15) + (gSkill * 0.05));

        // 2. Tier 1 Startup / Unicorn (Razorpay, Swiggy, Zerodha, Cred)
        // High emphasis on Coding (35%) + Real Projects/Skills (35%) + Interview (15%) + Drive (15%)
        // Academics are relaxed for verified builders!
        let pStartup = Math.round((gCode * 0.35) + (gSkill * 0.35) + (gInt * 0.15) + (gDrive * 0.15));

        // Hard bottleneck penalty: If academic or coding is critically low, cap Tier 1
        if (gAcad < 60 || gCode < 40) {
            pTier1 = Math.min(pTier1, 20);
        }
        if (gCode < 40) {
            pStartup = Math.min(pStartup, 25);
        }

        // 3. Tier 2 Digital / FinTech (TCS Digital, Accenture Tech, Barclays, Cognizant GenC Next)
        // Balanced: Academic (25%) + Coding (25%) + Drive (25%) + Interview (15%) + Skills (10%)
        let pTier2 = Math.round((gAcad * 0.25) + (gCode * 0.25) + (gDrive * 0.25) + (gInt * 0.15) + (gSkill * 0.10));

        // 4. Tier 3 Foundation Services (TCS Ninja, Infosys, Wipro, Capgemini)
        // Mass hiring: Academic (35%) + Communication/Interview (25%) + Drive (20%) + Coding (15%) + Skills (5%)
        let pTier3 = Math.round((gAcad * 0.35) + (gInt * 0.25) + (gDrive * 0.20) + (gCode * 0.15) + (gSkill * 0.05));

        // Clamp 0-98 (never claim 100% certainty in recruitment forecasting)
        const clamp = (val) => Math.min(Math.max(val, 5), 96);
        pTier1 = clamp(pTier1);
        pStartup = clamp(pStartup);
        pTier2 = clamp(pTier2);
        pTier3 = clamp(pTier3);

        const getStatus = (prob) => {
            if (prob >= 75) return 'HIGH';
            if (prob >= 50) return 'MODERATE';
            if (prob >= 30) return 'LOW';
            return 'UNLIKELY';
        };

        return [
            {
                tierKey: 'TIER_1_PRODUCT',
                tierName: 'Product Tier-1 & Global Tech',
                targetCompanies: ['Google', 'Amazon', 'Microsoft', 'Uber', 'Atlassian'],
                ctcRange: '₹18.0 - ₹44.0 LPA',
                probabilityPercentage: pTier1,
                status: getStatus(pTier1),
                primaryBlocker: gCode < 70 ? 'Advance algorithmic problem solving to Hard DP / Graphs' : (gDrive < 70 ? 'Clear Tier-1 Mock Placement Drive' : null),
                keyStrengths: gCode >= 75 ? ['Strong algorithmic problem solving'] : ['Solid fundamentals']
            },
            {
                tierKey: 'TIER_1_STARTUP',
                tierName: 'High-Growth Unicorn & Scale-Ups',
                targetCompanies: ['Razorpay', 'Swiggy', 'Zerodha', 'Cred', 'Postman'],
                ctcRange: '₹14.0 - ₹28.0 LPA',
                probabilityPercentage: pStartup,
                status: getStatus(pStartup),
                primaryBlocker: gSkill < 60 ? 'Deploy production full-stack project with live URL' : null,
                keyStrengths: gSkill >= 75 ? ['Rich portfolio of applied projects'] : ['Adaptive stack']
            },
            {
                tierKey: 'TIER_2_DIGITAL',
                tierName: 'Corporate Digital & FinTech',
                targetCompanies: ['TCS Digital', 'Barclays', 'Accenture Tech', 'Deloitte'],
                ctcRange: '₹7.0 - ₹14.0 LPA',
                probabilityPercentage: pTier2,
                status: getStatus(pTier2),
                primaryBlocker: gAcad < 65 ? 'Academic criteria may require 65%+ aggregate' : null,
                keyStrengths: gAcad >= 70 ? ['Meets all corporate campus cutoffs'] : ['Consistent record']
            },
            {
                tierKey: 'TIER_3_SERVICES',
                tierName: 'Enterprise Mass Services',
                targetCompanies: ['TCS Ninja', 'Infosys', 'Cognizant', 'Wipro'],
                ctcRange: '₹3.6 - ₹5.5 LPA',
                probabilityPercentage: pTier3,
                status: getStatus(pTier3),
                primaryBlocker: gAcad < 60 ? 'Minimum 60% graduation aggregate mandatory' : null,
                keyStrengths: ['Eligible for national aptitude screenings']
            }
        ];
    }

    /**
     * Compute realistic CTC range based on top clearing tier and candidate strengths
     */
    estimateCtcRange(tiers, gates) {
        const t1 = tiers.find(t => t.tierKey === 'TIER_1_PRODUCT')?.probabilityPercentage || 0;
        const tStartup = tiers.find(t => t.tierKey === 'TIER_1_STARTUP')?.probabilityPercentage || 0;
        const t2 = tiers.find(t => t.tierKey === 'TIER_2_DIGITAL')?.probabilityPercentage || 0;

        let minLpa = 3.6;
        let maxLpa = 5.5;
        let medianLpa = 4.5;

        if (t1 >= 70 || tStartup >= 75) {
            minLpa = 16.0;
            maxLpa = 34.0;
            medianLpa = 22.5;
        } else if (t1 >= 50 || tStartup >= 55) {
            minLpa = 11.0;
            maxLpa = 20.0;
            medianLpa = 14.5;
        } else if (t2 >= 60) {
            minLpa = 7.0;
            maxLpa = 12.5;
            medianLpa = 9.2;
        } else if (t2 >= 40) {
            minLpa = 4.8;
            maxLpa = 8.5;
            medianLpa = 6.2;
        }

        return {
            minLpa,
            maxLpa,
            medianLpa,
            formattedRange: `₹${minLpa.toFixed(1)} - ₹${maxLpa.toFixed(1)} LPA`
        };
    }

    /**
     * Main analytics generator and persistence orchestrator
     */
    async getCandidateAnalytics(userId) {
        const profile = await CandidateProfile.findOne({ user: userId });
        const codingSubs = await CodingSubmission.find({ user: userId });
        const codingAssessments = await CodingAssessment.find({ user: userId });
        const aptitudeAttempts = await AptitudeAttempt.find({ user: userId });
        const aptitudeAssessments = await AptitudeAssessment.find({ user: userId });
        const drives = await PlacementDrive.find({ user: userId });
        const interviews = await InterviewReport.find({ user: userId });
        const mockInterviews = await InterviewAttempt.find({ user: userId, status: 'Completed' });
        const skillGapDoc = await SkillGap.findOne({ user: userId });

        const gates = this.evaluateRecruitmentGates(profile, codingSubs, codingAssessments, drives, interviews, skillGapDoc, aptitudeAttempts, aptitudeAssessments, mockInterviews);
        const tiers = this.calculateTierProbabilities(gates);
        const ctc = this.estimateCtcRange(tiers, gates);

        const avgGateScore = Math.round(gates.reduce((acc, g) => acc + g.score, 0) / gates.length);

        // Find primary top tier fit
        let topTierFit = 'TIER_3_SERVICES';
        if (tiers[0].probabilityPercentage >= 65) topTierFit = 'TIER_1_PRODUCT';
        else if (tiers[1].probabilityPercentage >= 65) topTierFit = 'TIER_1_STARTUP';
        else if (tiers[2].probabilityPercentage >= 55) topTierFit = 'TIER_2_DIGITAL';

        // Check or generate verification token
        let token = null;
        if (avgGateScore >= 50) {
            token = `CAI-VERIF-${crypto.createHash('md5').update(`${userId}-placement-${profile?.updatedAt || Date.now()}`).digest('hex').slice(0, 8).toUpperCase()}`;
        }

        const analyticsDoc = await PlacementAnalytics.findOneAndUpdate(
            { user: userId },
            {
                user: userId,
                predictedCtc: ctc,
                overallMarketReadinessScore: avgGateScore,
                topTierFit,
                tierProbabilities: tiers,
                recruitmentGates: gates,
                verificationDossier: {
                    verificationToken: token,
                    issuedAt: new Date(),
                    isVerified: avgGateScore >= 60,
                    certificateUrl: token ? `/api/analytics/verify/${token}` : null
                },
                calculatedAt: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return {
            analytics: analyticsDoc,
            summary: {
                overallScore: avgGateScore,
                topTierFit,
                formattedCtc: ctc.formattedRange,
                medianCtc: ctc.medianLpa,
                clearedGatesCount: gates.filter(g => g.status === 'CLEARED').length,
                totalGates: gates.length,
                hasVerificationToken: Boolean(token),
                verificationToken: token
            }
        };
    }

    /**
     * Run dynamic What-If Sensitivity Simulation
     */
    simulateWhatIf(baseGates, adjustments) {
        const {
            boostCodingScore = 0,        // e.g. +20 points
            boostAptitudeScore = 0,      // e.g. +15 points
            clearPlacementDrive = false, // mark drive as 90
            closeSkillGapsCount = 0      // each gap gives +5
        } = adjustments;

        // Clone gates
        const simulatedGates = baseGates.map(g => {
            const copy = { ...g };
            if ((copy.gateName === 'ACADEMIC_CRITERIA' || copy.gateName === 'ACADEMIC_ELIGIBILITY') && boostAptitudeScore > 0) {
                copy.score = Math.min(copy.score + boostAptitudeScore, 100);
                if (copy.score >= 85) copy.status = 'CLEARED';
            }
            if (copy.gateName === 'CODING_RIGOR' && boostCodingScore > 0) {
                copy.score = Math.min(copy.score + boostCodingScore, 100);
            }
            if (copy.gateName === 'DRIVE_VALIDATION' && clearPlacementDrive) {
                copy.score = Math.max(copy.score, 90);
                copy.status = 'CLEARED';
            }
            if (copy.gateName === 'DOMAIN_SKILLS' && closeSkillGapsCount > 0) {
                copy.score = Math.min(copy.score + (closeSkillGapsCount * 6), 100);
            }
            return copy;
        });

        const simulatedTiers = this.calculateTierProbabilities(simulatedGates);
        const simulatedCtc = this.estimateCtcRange(simulatedTiers, simulatedGates);

        return {
            simulatedGates,
            simulatedTiers,
            simulatedCtc,
            deltas: {
                tier1Boost: simulatedTiers[0].probabilityPercentage - (adjustments.baseTier1 || 0),
                ctcGainLpa: +(simulatedCtc.medianLpa - (adjustments.baseMedianCtc || 0)).toFixed(1)
            }
        };
    }
}

module.exports = new PlacementAnalyticsService();
