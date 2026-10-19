const PlacementReadiness = require('../models/placementReadiness.model');
const CandidateProfile = require('../models/candidateProfile.model');
const Job = require('../models/job.model');
const InterviewReport = require('../models/interviewReport.model');
const InterviewAttempt = require('../models/interviewAttempt.model');
const CodingSubmission = require('../models/codingSubmission.model');
const CodingAssessment = require('../models/codingAssessment.model');
const AptitudeAttempt = require('../models/aptitudeAttempt.model');
const AptitudeAssessment = require('../models/aptitudeAssessment.model');
const PlacementDrive = require('../models/placementDrive.model');
const CareerRoadmap = require('../models/careerRoadmap.model');
const { evaluateEligibility } = require('./eligibility.service');
const { analyzeSkillGaps } = require('./skillGap.service');

/**
 * Determine dimension status based on score
 */
function getDimensionStatus(score) {
    if (score >= 85) return 'EXCELLENT';
    if (score >= 65) return 'GOOD';
    if (score >= 40) return 'NEEDS_ATTENTION';
    if (score > 0) return 'CRITICAL';
    return 'NOT_STARTED';
}

/**
 * Calculate placement readiness from real candidate profile, skills, roadmap and interview data
 */
async function calculatePlacementReadiness(userId) {
    const candidate = await CandidateProfile.findOne({ user: userId });
    const jobs = await Job.find({ isActive: { $ne: false } }).limit(20);
    const interviewReports = await InterviewReport.find({ user: userId }).select('matchScore title companyName skillGaps');
    const mockInterviewAttempts = await InterviewAttempt.find({ user: userId, status: 'Completed' });
    const codingSubmissions = await CodingSubmission.find({ user: userId });
    const codingAssessments = await CodingAssessment.find({ user: userId });
    const aptitudeAttempts = await AptitudeAttempt.find({ user: userId });
    const aptitudeAssessments = await AptitudeAssessment.find({ user: userId });
    const placementDrives = await PlacementDrive.find({ user: userId });
    const roadmap = await CareerRoadmap.findOne({ user: userId });

    // Handle completely new/empty candidate
    const hasPersonal = Boolean(candidate?.personal?.fullName);
    const hasAcademics = Boolean(candidate?.academics?.ssc?.percentage || candidate?.academics?.undergraduate?.cgpaOrPercentage);
    const hasResume = Boolean(candidate?.resume?.fileName || candidate?.resume?.rawText);
    const totalSkills = candidate?.skills?.length || 0;
    const totalProjects = candidate?.projects?.length || 0;

    const isAssessed = Boolean(candidate && (hasPersonal || hasAcademics || hasResume || totalSkills > 0));

    // ── 1. Dimension: Profile Readiness (Weight: 10%) ──────────────────────────
    let profileScore = 0;
    const missingProfileFields = [];

    if (candidate?.personal?.fullName) profileScore += 20;
    else missingProfileFields.push('Full Name');

    if (candidate?.personal?.phoneNumber || candidate?.personal?.location) profileScore += 15;
    else missingProfileFields.push('Contact Information');

    if (candidate?.academics?.ssc?.percentage) profileScore += 15;
    else missingProfileFields.push('10th / SSC percentage');

    if (candidate?.academics?.hsc?.percentage || candidate?.academics?.diploma?.percentageOrCgpa) profileScore += 15;
    else missingProfileFields.push('12th / Diploma percentage');

    if (candidate?.academics?.undergraduate?.cgpaOrPercentage) profileScore += 20;
    else missingProfileFields.push('Degree CGPA / Percentage');

    const targetRole = candidate?.careerPreferences?.targetRole || candidate?.personal?.targetRole || '';
    if (targetRole) profileScore += 15;
    else missingProfileFields.push('Target Career Role');

    const profileDimension = {
        score: profileScore,
        weight: 10,
        status: getDimensionStatus(profileScore),
        summary: profileScore >= 85 ? 'Profile credentials and academics fully documented.' : `Missing: ${missingProfileFields.slice(0, 3).join(', ')}`,
        metrics: {
            hasPersonal,
            hasAcademics,
            hasTargetRole: Boolean(targetRole),
            missingFields: missingProfileFields
        }
    };

    // ── 2. Dimension: Resume Readiness (Weight: 15%) ───────────────────────────
    let resumeScore = 0;
    const rawResumeText = candidate?.resume?.rawText || '';
    const wordCount = rawResumeText ? rawResumeText.trim().split(/\s+/).length : 0;

    if (candidate?.resume?.fileName || candidate?.resume?.fileUrl) resumeScore += 50;
    if (rawResumeText.length > 100) resumeScore += 30;
    if (wordCount >= 150) resumeScore += 20;

    const resumeDimension = {
        score: resumeScore,
        weight: 15,
        status: getDimensionStatus(resumeScore),
        summary: resumeScore >= 80 ? 'Verified ATS-ready resume with extracted content.' : (resumeScore > 0 ? 'Resume uploaded; content extraction minimal.' : 'Resume document not uploaded yet.'),
        metrics: {
            hasFile: Boolean(candidate?.resume?.fileName),
            fileName: candidate?.resume?.fileName || '',
            wordCount,
            isParsed: rawResumeText.length > 100
        }
    };

    // ── 3. Dimension: Skill Readiness (Weight: 20%) ────────────────────────────
    let skillCoverage = 0;
    let highPriorityGaps = [];
    let matchedSkillsCount = 0;

    if (candidate) {
        try {
            const skillAnalysis = await analyzeSkillGaps(candidate, { targetRole });
            if (skillAnalysis && skillAnalysis.status === 'SUCCESS') {
                skillCoverage = skillAnalysis.overallCoverage || 0;
                matchedSkillsCount = skillAnalysis.matchedSkillsCount || 0;
                const evaluatedSkills = skillAnalysis.skills || [];
                highPriorityGaps = evaluatedSkills.filter(s => s.status !== 'MATCHED' && s.priority === 'HIGH');
            }
        } catch (err) {
            // fallback to profile skill count
            skillCoverage = Math.min(100, totalSkills * 10);
        }
    }

    const skillScore = Math.min(100, Math.max(0, skillCoverage));
    const skillDimension = {
        score: skillScore,
        weight: 20,
        status: getDimensionStatus(skillScore),
        summary: skillScore >= 75 ? 'Strong technical competency matching target benchmark.' : (totalSkills > 0 ? `${highPriorityGaps.length} high-priority skill gaps need attention.` : 'No technical skills cataloged yet.'),
        metrics: {
            skillCoverage: skillScore,
            totalSkillsCataloged: totalSkills,
            matchedSkillsCount,
            highPriorityGapsCount: highPriorityGaps.length
        }
    };

    // ── 4. Dimension: Project Readiness (Weight: 15%) ──────────────────────────
    let projectScore = 0;
    const projects = candidate?.projects || [];

    if (projects.length >= 1) {
        projectScore = 50;
        const first = projects[0];
        if (first.technologies && first.technologies.length > 0) projectScore += 20;
        if (first.description && first.description.length > 25) projectScore += 15;
        if (first.projectUrl || first.githubUrl) projectScore += 15;

        if (projects.length >= 2) {
            projectScore = Math.min(100, projectScore + 20);
        }
    }

    const projectDimension = {
        score: projectScore,
        weight: 15,
        status: getDimensionStatus(projectScore),
        summary: projectScore >= 75 ? `${projects.length} verified projects with technical deliverables.` : (projects.length > 0 ? 'Project documented; GitHub or live demo links recommended.' : 'No portfolio projects documented yet.'),
        metrics: {
            projectsCount: projects.length,
            hasLinks: projects.some(p => Boolean(p.projectUrl || p.githubUrl))
        }
    };

    // ── 5. Dimension: Experience Readiness (Weight: 5%) ────────────────────────
    let experienceScore = 50; // Campus baseline for freshers
    const experiences = candidate?.experience || [];
    const expLevel = candidate?.careerPreferences?.experienceLevel || 'Fresher';

    if (experiences.length > 0) {
        experienceScore = 100;
    } else if (expLevel === 'Fresher' || !expLevel) {
        experienceScore = projects.length >= 1 ? 80 : 60;
    }

    const experienceDimension = {
        score: experienceScore,
        weight: 5,
        status: getDimensionStatus(experienceScore),
        summary: experiences.length > 0 ? `${experiences.length} internship/work experience entry verified.` : 'Fresher baseline; strong portfolio projects compensate.',
        metrics: {
            experienceCount: experiences.length,
            experienceLevel: expLevel
        }
    };

    // ── 6. Dimension: Technical & Interview Readiness (Weight: 15%) ───────────
    let interviewScore = 0;
    const plansCount = interviewReports.length;
    let avgMatchScore = 0;

    const acceptedCodingCount = codingSubmissions.filter(s => s.status === 'Accepted').length;
    const completedCodingAssessments = codingAssessments.filter(a => a.status === 'Completed');

    const acceptedAptitudeCount = aptitudeAttempts.filter(a => a.isCorrect).length;
    const completedAptitudeAssessments = aptitudeAssessments.filter(a => a.status === 'Completed');

    const mockCount = mockInterviewAttempts.length;
    const avgMockScore = mockCount > 0
        ? Math.round(mockInterviewAttempts.reduce((sum, a) => sum + (a.overallScore || 0), 0) / mockCount)
        : 0;

    if (plansCount > 0 || mockCount > 0 || acceptedCodingCount > 0 || completedCodingAssessments.length > 0 || acceptedAptitudeCount > 0 || completedAptitudeAssessments.length > 0) {
        let interviewPart = 0;
        if (plansCount > 0 || mockCount > 0) {
            const scores = interviewReports.map(r => Number(r.matchScore) || 0).filter(s => s > 0);
            avgMatchScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : (avgMockScore || 60);

            if (mockCount > 0 && plansCount > 0) {
                interviewPart = Math.min(100, Math.round((avgMatchScore * 0.4) + (avgMockScore * 0.6)));
            } else if (mockCount > 0) {
                interviewPart = Math.min(100, avgMockScore);
            } else {
                interviewPart = Math.min(100, Math.round(40 + (avgMatchScore * 0.6)));
            }
        }

        let codingPart = 0;
        if (acceptedCodingCount > 0 || completedCodingAssessments.length > 0) {
            const avgAssessmentScore = completedCodingAssessments.length > 0
                ? Math.round(completedCodingAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedCodingAssessments.length)
                : 0;
            codingPart = Math.min(100, (acceptedCodingCount * 15) + Math.round(avgAssessmentScore * 0.4));
        }

        let aptitudePart = 0;
        if (acceptedAptitudeCount > 0 || completedAptitudeAssessments.length > 0) {
            const avgAptScore = completedAptitudeAssessments.length > 0
                ? Math.round(completedAptitudeAssessments.reduce((sum, a) => sum + (a.overallScore || 0), 0) / completedAptitudeAssessments.length)
                : 0;
            aptitudePart = Math.min(100, (acceptedAptitudeCount * 10) + Math.round(avgAptScore * 0.4));
        }

        // Weighted combination preserving existing philosophy
        const weights = [];
        if (plansCount > 0 || mockCount > 0) weights.push({ val: interviewPart, w: 0.40 });
        if (acceptedCodingCount > 0 || completedCodingAssessments.length > 0) weights.push({ val: codingPart, w: 0.35 });
        if (acceptedAptitudeCount > 0 || completedAptitudeAssessments.length > 0) weights.push({ val: aptitudePart, w: 0.25 });

        const totalW = weights.reduce((acc, x) => acc + x.w, 0);
        interviewScore = totalW > 0
            ? Math.round(weights.reduce((acc, x) => acc + (x.val * x.w), 0) / totalW)
            : 0;
    }

    let summaryText = 'No aptitude, coding, or interview assessments completed yet.';
    const summaryParts = [];
    if (acceptedAptitudeCount > 0) summaryParts.push(`${acceptedAptitudeCount} aptitude question(s)`);
    if (acceptedCodingCount > 0) summaryParts.push(`${acceptedCodingCount} coding problem(s)`);
    if (mockCount > 0) summaryParts.push(`${mockCount} live mock interview(s)`);
    else if (plansCount > 0) summaryParts.push(`${plansCount} interview plan(s)`);

    if (summaryParts.length > 0) {
        summaryText = `${summaryParts.join(', ')} verified in preparation rounds.`;
    }

    const interviewDimension = {
        score: interviewScore,
        weight: 15,
        status: getDimensionStatus(interviewScore),
        summary: summaryText,
        metrics: {
            interviewPlansCount: plansCount,
            mockInterviewsCompleted: mockCount,
            mockInterviewAvgScore: avgMockScore,
            averageMatchScore: avgMatchScore,
            codingProblemsSolved: acceptedCodingCount,
            codingAssessmentsCompleted: completedCodingAssessments.length,
            aptitudeProblemsSolved: acceptedAptitudeCount,
            aptitudeAssessmentsCompleted: completedAptitudeAssessments.length
        }
    };

    // ── 7. Dimension: Job Eligibility (Weight: 10%) ────────────────────────────
    let eligibleJobsCount = 0;
    let ineligibleJobsCount = 0;
    let unverifiedJobsCount = 0;
    const jobReadinessList = [];

    jobs.forEach(job => {
        const evalResult = evaluateEligibility(job, candidate);
        if (evalResult.status === 'ELIGIBLE') {
            eligibleJobsCount++;
        } else if (evalResult.status === 'INELIGIBLE') {
            ineligibleJobsCount++;
        } else {
            unverifiedJobsCount++;
        }

        jobReadinessList.push({
            jobId: job._id,
            title: job.title,
            company: job.company,
            location: job.location || 'Remote/Campus',
            eligibilityStatus: evalResult.status,
            statusMessage: evalResult.statusMessage,
            matchScore: evalResult.matchScore || 0,
            missingCriteria: evalResult.requirements?.filter(r => !r.passed).map(r => r.message) || [],
            missingSkills: evalResult.missingSkills || []
        });
    });

    const totalJobs = jobs.length;
    let eligibilityScore = 0;
    if (totalJobs > 0) {
        if (eligibleJobsCount > 0) {
            eligibilityScore = Math.round((eligibleJobsCount / totalJobs) * 100);
            if (unverifiedJobsCount > 0 && eligibilityScore < 50) {
                eligibilityScore = 50; // Neutral if unverified criteria pending
            }
        } else if (unverifiedJobsCount === totalJobs) {
            eligibilityScore = 30; // Pending verification
        } else {
            eligibilityScore = 15; // Cutoffs failed
        }
    }

    const eligibilityDimension = {
        score: eligibilityScore,
        weight: 10,
        status: getDimensionStatus(eligibilityScore),
        summary: eligibleJobsCount > 0 ? `Eligible for ${eligibleJobsCount} opportunity cutoffs.` : (unverifiedJobsCount > 0 ? `${unverifiedJobsCount} opportunities pending academic verification.` : 'Academic criteria cutoffs not currently met.'),
        metrics: {
            eligibleCount: eligibleJobsCount,
            ineligibleCount: ineligibleJobsCount,
            unverifiedCount: unverifiedJobsCount,
            totalEvaluated: totalJobs
        }
    };

    // ── 8. Dimension: Career Roadmap Progress (Weight: 10%) ───────────────────
    const roadmapProgress = roadmap ? (roadmap.overallProgress || 0) : 0;
    const roadmapDimension = {
        score: roadmapProgress,
        weight: 10,
        status: getDimensionStatus(roadmapProgress),
        summary: roadmap ? `Roadmap Stage 0${roadmap.currentStage} active (${roadmapProgress}% progress).` : 'Career roadmap not generated yet.',
        metrics: {
            currentStage: roadmap?.currentStage || 1,
            overallProgress: roadmapProgress,
            hasRoadmap: Boolean(roadmap)
        }
    };

    const dimensions = {
        profile: profileDimension,
        resume: resumeDimension,
        skills: skillDimension,
        projects: projectDimension,
        experience: experienceDimension,
        interviews: interviewDimension,
        eligibility: eligibilityDimension,
        roadmap: roadmapDimension
    };

    // ── Overall Readiness Calculation ─────────────────────────────────────────
    const weightedSum = Object.values(dimensions).reduce((acc, dim) => acc + (dim.score * dim.weight / 100), 0);
    const overallReadiness = Math.round(weightedSum);

    let readinessLevel = 'Not Ready';
    if (overallReadiness >= 85) readinessLevel = 'Highly Ready';
    else if (overallReadiness >= 65) readinessLevel = 'Placement Ready';
    else if (overallReadiness >= 35) readinessLevel = 'Getting Ready';

    // ── Genuine Placement Blockers ────────────────────────────────────────────
    const blockers = [];

    if (!hasResume) {
        blockers.push({
            id: 'blocker-resume-missing',
            title: 'Verified Technical Resume Missing',
            severity: 'CRITICAL',
            explanation: 'Employers and campus recruiters require an ATS-parseable resume to verify qualifications.',
            recommendedAction: 'Upload your latest technical resume PDF in Resume & Profile.',
            ctaText: 'Upload Resume',
            ctaPath: '/resume-profile'
        });
    }

    if (!candidate?.academics?.undergraduate?.cgpaOrPercentage || !candidate?.academics?.ssc?.percentage) {
        blockers.push({
            id: 'blocker-academics-unverified',
            title: 'Mandatory Academic Criteria Incomplete',
            severity: 'CRITICAL',
            explanation: 'Recruitment eligibility engines cannot verify mandatory 10th/12th/Degree cutoff scores.',
            recommendedAction: 'Enter complete academic percentages and graduation year in your profile.',
            ctaText: 'Add Academics',
            ctaPath: '/resume-profile'
        });
    }

    if (highPriorityGaps.length > 0) {
        blockers.push({
            id: 'blocker-skills-high-priority',
            title: `${highPriorityGaps.length} Critical Core Skills Missing Evidence`,
            severity: 'HIGH',
            explanation: `Benchmark requirements for ${targetRole || 'your target career'} require: ${highPriorityGaps.slice(0, 3).map(s => s.name).join(', ')}.`,
            recommendedAction: 'Learn these skills and build hands-on proof-of-concept projects.',
            ctaText: 'Review Skill Gaps',
            ctaPath: '/skill-gap'
        });
    }

    if (projects.length === 0) {
        blockers.push({
            id: 'blocker-projects-zero',
            title: 'No Portfolio Projects Documented',
            severity: 'HIGH',
            explanation: 'Technical recruiters look for tangible project implementations to validate technical competence.',
            recommendedAction: 'Add at least one full-stack or domain-aligned project with code repository link.',
            ctaText: 'Add Projects',
            ctaPath: '/resume-profile'
        });
    }

    if (interviewReports.length === 0) {
        blockers.push({
            id: 'blocker-interview-prep',
            title: 'No Mock Interview Assessment Completed',
            severity: 'MEDIUM',
            explanation: 'Live technical and behavioral interview simulations validate readiness under real screening conditions.',
            recommendedAction: 'Generate an interview preparation plan tailored to your target job.',
            ctaText: 'Start Interview Prep',
            ctaPath: '/interview-prep'
        });
    }

    if (!targetRole) {
        blockers.push({
            id: 'blocker-target-role',
            title: 'Target Career Role Not Selected',
            severity: 'HIGH',
            explanation: 'Placement readiness algorithms cannot benchmark requirements without a target career direction.',
            recommendedAction: 'Choose a target role (e.g. Full Stack Developer, Data Analyst) in Resume & Profile.',
            ctaText: 'Select Target Role',
            ctaPath: '/resume-profile'
        });
    }

    // ── Genuine Evidence-Backed Strengths ──────────────────────────────────────
    const strengths = [];

    if (hasResume && rawResumeText.length > 100) {
        strengths.push({
            id: 'strength-resume-verified',
            title: 'ATS Resume Document Verified',
            evidence: 'Your resume document is uploaded and parseable with clean technical text extraction.',
            category: 'Resume'
        });
    }

    if (profileScore >= 70) {
        strengths.push({
            id: 'strength-profile-solid',
            title: 'Comprehensive Profile & Academic Credentials',
            evidence: 'Contact information, degree scores, and baseline records are recorded.',
            category: 'Profile'
        });
    }

    if (projects.length >= 1) {
        strengths.push({
            id: 'strength-projects-present',
            title: `${projects.length} Documented Technical Project${projects.length > 1 ? 's' : ''}`,
            evidence: `Practical implementations registered: ${projects.map(p => p.projectName).join(', ')}.`,
            category: 'Projects'
        });
    }

    if (eligibleJobsCount > 0) {
        strengths.push({
            id: 'strength-eligible-jobs',
            title: `${eligibleJobsCount} Verified Eligible Opportunities`,
            evidence: 'Your academic scores satisfy mandatory cutoff criteria for current verified job listings.',
            category: 'Opportunities'
        });
    }

    if (plansCount > 0) {
        strengths.push({
            id: 'strength-interviews-active',
            title: `${plansCount} Mock Interview Plan${plansCount > 1 ? 's' : ''} Completed`,
            evidence: `Interview readiness actively assessed with average match score of ${avgMatchScore}%.`,
            category: 'Interview'
        });
    }

    if (acceptedCodingCount >= 2 || completedCodingAssessments.length >= 1) {
        strengths.push({
            id: 'strength-coding-evidence',
            title: `${acceptedCodingCount} Algorithmic Coding Problem${acceptedCodingCount > 1 ? 's' : ''} Solved`,
            evidence: `Demonstrated technical problem-solving with verified test passes${completedCodingAssessments.length > 0 ? ` and ${completedCodingAssessments.length} corporate assessment(s)` : ''}.`,
            category: 'Technical Assessment'
        });
    }

    if (acceptedAptitudeCount >= 2 || completedAptitudeAssessments.length >= 1) {
        strengths.push({
            id: 'strength-aptitude-evidence',
            title: `${acceptedAptitudeCount} Aptitude Problem${acceptedAptitudeCount > 1 ? 's' : ''} Solved`,
            evidence: `Demonstrated quantitative and logical reasoning competence${completedAptitudeAssessments.length > 0 ? ` and completed ${completedAptitudeAssessments.length} timed corporate assessment(s)` : ''}.`,
            category: 'Aptitude Round'
        });
    }

    if (mockCount >= 1) {
        strengths.push({
            id: 'strength-mock-interview-completed',
            title: `Completed ${mockCount} Live AI Mock Interview${mockCount > 1 ? 's' : ''}`,
            evidence: `Demonstrated real speech answering with verified score of ${avgMockScore}/100 in live interview simulation.`,
            category: 'Interview Round'
        });
    }

    const clearedDrives = placementDrives.filter(d => d.hiringVerdict === 'RECOMMENDED FOR HIRE');
    if (clearedDrives.length > 0) {
        strengths.push({
            id: 'strength-placement-drive-cleared',
            title: `Cleared ${clearedDrives.length} Corporate Placement Drive Simulation${clearedDrives.length > 1 ? 's' : ''}`,
            evidence: `Successfully verified in end-to-end recruitment drive for ${clearedDrives[0].companyName} (${clearedDrives[0].overallScore}/100 score).`,
            category: 'Placement Drive'
        });
    }

    if (roadmapProgress >= 20) {
        strengths.push({
            id: 'strength-roadmap-progress',
            title: `Career Roadmap ${roadmapProgress}% Completed`,
            evidence: `Structured progression actively tracked through Stage 0${roadmap?.currentStage || 1}.`,
            category: 'Roadmap'
        });
    }

    if (strengths.length === 0 && candidate) {
        strengths.push({
            id: 'strength-account-created',
            title: 'Candidate Account Registered & Initialized',
            evidence: 'Ready for full profile cataloging and placement preparation benchmarking.',
            category: 'General'
        });
    }

    // ── Readiness Checklist ───────────────────────────────────────────────────
    const checklist = [
        {
            id: 'chk-profile',
            label: 'Profile credentials & contact details completed',
            isComplete: hasPersonal,
            category: 'Profile',
            detail: hasPersonal ? 'Contact details verified' : 'Add full name and contact information',
            ctaPath: '/resume-profile'
        },
        {
            id: 'chk-academics',
            label: 'Academic records (10th, 12th, Degree CGPA) entered',
            isComplete: Boolean(candidate?.academics?.undergraduate?.cgpaOrPercentage),
            category: 'Academics',
            detail: candidate?.academics?.undergraduate?.cgpaOrPercentage ? 'Undergraduate scores recorded' : 'Degree CGPA required for cutoff evaluation',
            ctaPath: '/resume-profile'
        },
        {
            id: 'chk-target-role',
            label: 'Target career role calibrated',
            isComplete: Boolean(targetRole),
            category: 'Career Preferences',
            detail: targetRole ? `Targeting: ${targetRole}` : 'Define your target engineering role',
            ctaPath: '/resume-profile'
        },
        {
            id: 'chk-resume',
            label: 'Technical resume uploaded & parsed',
            isComplete: hasResume,
            category: 'Resume',
            detail: hasResume ? `${candidate.resume.fileName || 'Resume file verified'}` : 'Upload PDF resume document',
            ctaPath: '/resume-profile'
        },
        {
            id: 'chk-skills',
            label: 'At least 5 verified technical skills documented',
            isComplete: totalSkills >= 5,
            category: 'Skills',
            detail: totalSkills >= 5 ? `${totalSkills} technical skills listed` : `Currently: ${totalSkills}/5 skills listed`,
            ctaPath: '/resume-profile'
        },
        {
            id: 'chk-projects',
            label: 'At least one role-aligned portfolio project added',
            isComplete: totalProjects >= 1,
            category: 'Projects',
            detail: totalProjects >= 1 ? `${totalProjects} project(s) recorded` : 'Add project with GitHub or live link',
            ctaPath: '/resume-profile'
        },
        {
            id: 'chk-interview',
            label: 'At least one mock interview evaluation generated',
            isComplete: plansCount >= 1,
            category: 'Interview Preparation',
            detail: plansCount >= 1 ? `${plansCount} interview plan(s) recorded` : 'Simulate technical round with CareerAI',
            ctaPath: '/interview-prep'
        },
        {
            id: 'chk-aptitude-prep',
            label: 'First-round aptitude screening problems solved',
            isComplete: acceptedAptitudeCount >= 2,
            category: 'Aptitude Round',
            detail: acceptedAptitudeCount >= 2 ? `${acceptedAptitudeCount} problem(s) solved` : 'Practice Quantitative, Logical, and Verbal questions',
            ctaPath: '/aptitude'
        },
        {
            id: 'chk-coding-prep',
            label: 'Core algorithmic practice problems solved',
            isComplete: acceptedCodingCount >= 2,
            category: 'Technical Assessment',
            detail: acceptedCodingCount >= 2 ? `${acceptedCodingCount} problem(s) accepted` : 'Solve practice problems in Coding Round',
            ctaPath: '/coding'
        },
        {
            id: 'chk-roadmap',
            label: 'Career Roadmap milestone progression active',
            isComplete: roadmapProgress >= 15,
            category: 'Roadmap',
            detail: roadmap ? `${roadmapProgress}% roadmap progress` : 'Initialize your career roadmap',
            ctaPath: '/career-roadmap'
        },
        {
            id: 'chk-placement-drive',
            label: 'Full simulated corporate placement drive attempted',
            isComplete: placementDrives.some(d => d.status === 'Completed'),
            category: 'Placement Drive',
            detail: placementDrives.some(d => d.status === 'Completed') ? 'Completed multi-round placement drive simulation' : 'Experience full simulated recruitment drive',
            ctaPath: '/placement-drives'
        },
        {
            id: 'chk-eligibility',
            label: 'Eligibility verified for live campus/off-campus openings',
            isComplete: eligibleJobsCount > 0,
            category: 'Placement',
            detail: eligibleJobsCount > 0 ? `Eligible for ${eligibleJobsCount} openings` : 'Check opportunity criteria cutoffs',
            ctaPath: '/jobs'
        }
    ];

    // ── Next Best Actions (Top 3-5 prioritized items) ─────────────────────────
    const nextActions = [];

    if (!hasResume) {
        nextActions.push({
            title: 'Upload Your Technical Resume',
            impact: 'CRITICAL',
            description: 'Provide your ATS resume to unlock skill extraction and opportunity matching.',
            path: '/resume-profile',
            ctaText: 'Upload Resume'
        });
    }

    if (!candidate?.academics?.undergraduate?.cgpaOrPercentage) {
        nextActions.push({
            title: 'Enter Academic CGPA & Percentages',
            impact: 'CRITICAL',
            description: 'Mandatory for placement eligibility verification against job cutoffs.',
            path: '/resume-profile',
            ctaText: 'Update Academics'
        });
    }

    if (highPriorityGaps.length > 0) {
        nextActions.push({
            title: `Close High-Priority Skill Gap: ${highPriorityGaps[0].name}`,
            impact: 'HIGH',
            description: `Required for ${targetRole || 'target role'}. Follow the recommended learning curriculum.`,
            path: '/skill-gap',
            ctaText: 'View Learning Plan'
        });
    }

    if (totalProjects === 0) {
        nextActions.push({
            title: 'Document Flagship Portfolio Project',
            impact: 'HIGH',
            description: 'Showcase real code implementations to demonstrate engineering competence.',
            path: '/career-roadmap',
            ctaText: 'Explore Project Recommendations'
        });
    }

    if (plansCount === 0) {
        nextActions.push({
            title: 'Complete a Technical Mock Interview',
            impact: 'HIGH',
            description: 'Test your problem-solving and domain answers against AI evaluation.',
            path: '/interview-prep',
            ctaText: 'Create Interview Plan'
        });
    }

    if (eligibleJobsCount > 0 && nextActions.length < 4) {
        nextActions.push({
            title: `Review ${eligibleJobsCount} Eligible Opportunities`,
            impact: 'HIGH',
            description: 'Your qualifications match listed eligibility requirements. Review and prepare.',
            path: '/jobs',
            ctaText: 'Explore Opportunities'
        });
    }

    // ── Save or update snapshot in MongoDB ─────────────────────────────────────
    const snapshotData = {
        user: userId,
        overallReadiness,
        readinessLevel,
        isAssessed,
        dimensions,
        eligibleJobsCount,
        ineligibleJobsCount,
        unverifiedJobsCount,
        blockers,
        strengths,
        checklist,
        jobReadiness: jobReadinessList,
        nextActions,
        lastCalculatedAt: new Date()
    };

    const savedSnapshot = await PlacementReadiness.findOneAndUpdate(
        { user: userId },
        snapshotData,
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    return savedSnapshot;
}

/**
 * Retrieve placement readiness snapshot for user (or calculate if absent)
 */
async function getPlacementReadiness(userId) {
    let snapshot = await PlacementReadiness.findOne({ user: userId });
    if (!snapshot) {
        snapshot = await calculatePlacementReadiness(userId);
    }
    return snapshot;
}

/**
 * Retrieve job opportunity readiness breakdown
 */
async function getJobReadinessBreakdown(userId) {
    const snapshot = await getPlacementReadiness(userId);
    return {
        eligibleJobsCount: snapshot.eligibleJobsCount,
        ineligibleJobsCount: snapshot.ineligibleJobsCount,
        unverifiedJobsCount: snapshot.unverifiedJobsCount,
        opportunities: snapshot.jobReadiness || []
    };
}

module.exports = {
    calculatePlacementReadiness,
    getPlacementReadiness,
    getJobReadinessBreakdown
};
