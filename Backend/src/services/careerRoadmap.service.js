const CareerRoadmap = require('../models/careerRoadmap.model');
const CandidateProfile = require('../models/candidateProfile.model');
const InterviewReport = require('../models/interviewReport.model');
const InterviewAttempt = require('../models/interviewAttempt.model');
const CodingSubmission = require('../models/codingSubmission.model');
const CodingAssessment = require('../models/codingAssessment.model');
const AptitudeAttempt = require('../models/aptitudeAttempt.model');
const AptitudeAssessment = require('../models/aptitudeAssessment.model');
const PlacementDrive = require('../models/placementDrive.model');
const Job = require('../models/job.model');
const skillGapService = require('./skillGap.service');

/**
 * Generate project recommendations specifically targeting candidate's missing skills
 */
function generateProjectRecommendations(targetRole, missingSkills = []) {
    const skillNames = missingSkills.map(s => (typeof s === 'string' ? s : s.name || s.skillName || '').toLowerCase());
    const recommendations = [];

    const hasNodeOrBackend = skillNames.some(s => ['node.js', 'nodejs', 'express', 'express.js', 'backend', 'django', 'fastapi', 'spring', 'springboot'].includes(s));
    const hasReactOrFrontend = skillNames.some(s => ['react', 'react.js', 'next.js', 'vue', 'angular', 'frontend', 'html/css'].includes(s));
    const hasTypescript = skillNames.some(s => ['typescript', 'ts'].includes(s));
    const hasDockerOrCloud = skillNames.some(s => ['docker', 'aws', 'kubernetes', 'cloud', 'ci/cd', 'devops'].includes(s));
    const hasDb = skillNames.some(s => ['mongodb', 'postgresql', 'mysql', 'sql', 'redis', 'database'].includes(s));
    const hasPythonOrAI = skillNames.some(s => ['python', 'ai', 'machine learning', 'data science', 'genai', 'llm'].includes(s));

    if (hasNodeOrBackend || hasReactOrFrontend || hasTypescript) {
        recommendations.push({
            title: 'Enterprise Task & Collaboration Platform',
            tagline: 'Full-stack application with real-time state, role-based auth, and robust API endpoints',
            description: `A production-ready platform integrating ${hasTypescript ? 'TypeScript, ' : ''}${hasReactOrFrontend ? 'modern Frontend (React), ' : ''}and ${hasNodeOrBackend ? 'RESTful backend services' : 'scalable APIs'}.`,
            targetedSkills: missingSkills.slice(0, 4).map(s => (typeof s === 'string' ? s : s.name || s.skillName)),
            deliverables: [
                'JWT-based authentication and secure session handling',
                'Normalized schema with relational or document persistence',
                'Modular REST/GraphQL endpoints with comprehensive error handling',
                'Responsive UI with form validation and optimistic updates'
            ],
            estimatedEffort: '2-3 weeks',
            isCompleted: false
        });
    }

    if (hasDockerOrCloud || hasDb) {
        recommendations.push({
            title: 'Cloud-Native Microservice & Observability Engine',
            tagline: 'Containerized service with Redis caching, Docker orchestration, and automated pipelines',
            description: 'Demonstrates deep ecosystem maturity by packaging backend services, implementing database caching, and deploying to cloud infrastructure.',
            targetedSkills: missingSkills.filter(s => {
                const n = (typeof s === 'string' ? s : s.name || '').toLowerCase();
                return ['docker', 'aws', 'redis', 'mongodb', 'postgresql', 'mysql', 'kubernetes', 'ci/cd'].some(k => n.includes(k));
            }).slice(0, 4).map(s => (typeof s === 'string' ? s : s.name || s.skillName)),
            deliverables: [
                'Dockerfile multi-stage build and docker-compose configuration',
                'Database migration scripts and indexed querying',
                'Rate limiting and in-memory cache layer',
                'Deployment manifest or automated CI workflow'
            ],
            estimatedEffort: '1-2 weeks',
            isCompleted: false
        });
    }

    if (hasPythonOrAI || targetRole.toLowerCase().includes('data') || targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('machine learning')) {
        recommendations.push({
            title: 'Intelligent Knowledge Retrieval & Processing Pipeline',
            tagline: 'Data-driven semantic search or analytical backend service',
            description: 'End-to-end data pipeline processing structured/unstructured datasets with automated reporting and API access.',
            targetedSkills: missingSkills.filter(s => {
                const n = (typeof s === 'string' ? s : s.name || '').toLowerCase();
                return ['python', 'data', 'sql', 'pandas', 'machine learning', 'fastapi', 'llm'].some(k => n.includes(k));
            }).slice(0, 4).map(s => (typeof s === 'string' ? s : s.name || s.skillName)),
            deliverables: [
                'Data ingestion and normalization pipeline',
                'Vector or relational indexing for performant search',
                'API endpoints for analytical inference and metric retrieval',
                'Unit test coverage for processing transforms'
            ],
            estimatedEffort: '2-3 weeks',
            isCompleted: false
        });
    }

    // Fallback if no specific condition matched
    if (recommendations.length === 0) {
        recommendations.push({
            title: `${targetRole} Portfolio Benchmark Project`,
            tagline: 'Comprehensive domain-specific project addressing core target role requirements',
            description: `Showcases practical end-to-end implementation designed to validate all benchmark skills for ${targetRole}.`,
            targetedSkills: missingSkills.slice(0, 4).map(s => (typeof s === 'string' ? s : s.name || s.skillName)),
            deliverables: [
                'End-to-end business logic implementation',
                'Clean architectural separation of concerns',
                'Automated test suites and documentation',
                'Public GitHub repository with descriptive README and live demo link'
            ],
            estimatedEffort: '2 weeks',
            isCompleted: false
        });
    }

    return recommendations;
}

/**
 * Generate or recalculate a candidate's Career Roadmap
 */
async function generateRoadmap(userId, options = {}) {
    const { targetRole: customTargetRole, jobId } = options;

    // 1. Fetch Candidate Profile
    const candidate = await CandidateProfile.findOne({ user: userId });
    if (!candidate) {
        const error = new Error('Candidate profile not found. Please complete your profile first.');
        error.code = 'PROFILE_INCOMPLETE';
        error.missingFields = ['CandidateProfile'];
        throw error;
    }

    // 2. Determine Target Role & Job
    let targetRole = customTargetRole || candidate.personal?.targetRole;
    let targetJob = null;
    let targetCompany = null;

    if (jobId) {
        const job = await Job.findById(jobId);
        if (job) {
            targetJob = job._id;
            targetCompany = job.company;
            if (!targetRole) {
                targetRole = job.title;
            }
        }
    }

    if (!targetRole || !targetRole.trim()) {
        const error = new Error('No target role specified. Please select or enter a target role to build your roadmap.');
        error.code = 'PROFILE_INCOMPLETE';
        error.missingFields = ['targetRole'];
        throw error;
    }

    const interviewCount = await InterviewReport.countDocuments({ user: userId });
    const mockInterviewsCount = await InterviewAttempt.countDocuments({ user: userId, status: 'Completed' });
    const recentMock = await InterviewAttempt.findOne({ user: userId, status: 'Completed' }).sort({ createdAt: -1 });
    const solvedCodingCount = await CodingSubmission.countDocuments({ user: userId, status: 'Accepted' });
    const completedAssessmentsCount = await CodingAssessment.countDocuments({ user: userId, status: 'Completed' });
    const solvedAptitudeCount = await AptitudeAttempt.countDocuments({ user: userId, isCorrect: true });
    const completedAptitudeAssessmentsCount = await AptitudeAssessment.countDocuments({ user: userId, status: 'Completed' });
    const clearedDrivesCount = await PlacementDrive.countDocuments({ user: userId, hiringVerdict: 'RECOMMENDED FOR HIRE' });

    const aptitudeAttempts = await AptitudeAttempt.find({ user: userId }).populate('question');

    const hasResume = Boolean(candidate.resume?.fileName || candidate.resume?.fileUrl);
    const hasPersonal = Boolean(candidate.personal?.fullName && candidate.personal?.email);
    const hasAcademics = Boolean(candidate.academics?.ssc?.percentage || candidate.academics?.degree?.cgpa);
    const profileComplete = hasPersonal && hasAcademics;

    const totalSkillsCount = candidate.skills?.length || 0;
    const projectsCount = candidate.projects?.length || 0;
    const experienceCount = candidate.experience?.length || 0;

    // 4. Run / Retrieve Skill Gap Matrix Analysis using existing engine
    const skillGapResult = await skillGapService.analyzeSkillGaps(candidate, {
        targetRole,
        jobId: targetJob ? targetJob.toString() : null
    });

    const skillCoverage = skillGapResult ? (skillGapResult.overallCoverage || 0) : 0;
    const evaluatedSkills = skillGapResult?.skills || [];
    const highPriorityGaps = evaluatedSkills.filter(s => s.status !== 'MATCHED' && s.priority === 'HIGH');
    const medPriorityGaps = evaluatedSkills.filter(s => s.status !== 'MATCHED' && s.priority === 'MEDIUM');
    const lowPriorityGaps = evaluatedSkills.filter(s => s.status !== 'MATCHED' && s.priority === 'LOW');
    const allMissing = evaluatedSkills.filter(s => s.status !== 'MATCHED');

    const currentPosition = {
        profileComplete,
        resumeUploaded: hasResume,
        totalSkillsCount,
        skillCoverage,
        projectsCount,
        experienceCount,
        interviewPlansCount: interviewCount,
        lastCalculatedAt: new Date()
    };

    // 5. Existing Roadmap state for preserving user-checked actions
    const existingRoadmap = await CareerRoadmap.findOne({ user: userId, targetRole });
    const existingActionsCompletedMap = new Map();
    if (existingRoadmap && existingRoadmap.stages) {
        existingRoadmap.stages.forEach(stage => {
            if (stage.actions) {
                stage.actions.forEach(action => {
                    if (action.isCompleted) {
                        existingActionsCompletedMap.set(action.id, true);
                    }
                });
            }
        });
    }

    // 6. Build the 6 Dynamic Stages

    // --- STAGE 01: PROFILE FOUNDATION ---
    const stage1Actions = [
        {
            id: 'action-p1-profile',
            title: 'Complete Personal & Academic Profile Credentials',
            description: 'Provide full name, contact information, SSC/HSC scores and current degree CGPA in Resume & Profile.',
            isCompleted: profileComplete || existingActionsCompletedMap.get('action-p1-profile') || false,
            actionType: 'PROFILE',
            linkedSkill: null
        },
        {
            id: 'action-p1-resume',
            title: 'Upload Verified ATS-Friendly Resume',
            description: 'Upload your latest technical resume PDF so our GenAI engine can extract and benchmark verified skills.',
            isCompleted: hasResume || existingActionsCompletedMap.get('action-p1-resume') || false,
            actionType: 'PROFILE',
            linkedSkill: null
        },
        {
            id: 'action-p1-skills',
            title: 'Catalog Core Technical Skill Inventory',
            description: `Document at least 5 verified technical skills in your candidate profile (Currently: ${totalSkillsCount} listed).`,
            isCompleted: totalSkillsCount >= 5 || existingActionsCompletedMap.get('action-p1-skills') || false,
            actionType: 'PROFILE',
            linkedSkill: null
        }
    ];

    const stage1CompletedCount = stage1Actions.filter(a => a.isCompleted).length;
    const stage1Pct = Math.round((stage1CompletedCount / stage1Actions.length) * 100);
    const stage1Status = stage1Pct === 100 ? 'COMPLETED' : 'IN_PROGRESS';

    const stage01 = {
        stageNumber: 1,
        stageKey: 'FOUNDATION',
        title: 'STAGE 01 — PROFILE FOUNDATION',
        tagline: 'Profile, ATS Resume & Core Identity',
        description: 'Establish verified baseline credentials, ATS-compliant resume documentation, and core competency catalog.',
        status: stage1Status,
        priority: stage1Pct === 100 ? 'NORMAL' : 'CRITICAL',
        estimatedDuration: '1-3 days',
        completionPercentage: stage1Pct,
        objectives: [
            'Achieve 100% complete candidate profile with verified academic records',
            'Upload ATS-parsed resume matching placement verification standards',
            'Establish baseline technical skills for automated gap analysis'
        ],
        keySkills: candidate.skills?.slice(0, 4).map(s => s.name) || ['Profile Verification', 'ATS Resume'],
        actions: stage1Actions,
        projects: [],
        expectedOutcome: 'A complete, ATS-verified candidate profile ready for role-specific skill benchmarking.'
    };

    // --- STAGE 02: CORE SKILLS ---
    const stage2Actions = [];
    const stage2Skills = highPriorityGaps.length > 0
        ? highPriorityGaps.map(s => s.name)
        : (allMissing.length > 0 ? allMissing.slice(0, 4).map(s => s.name) : ['Core Domain Fundamentals']);

    if (highPriorityGaps.length > 0) {
        highPriorityGaps.forEach((gap, idx) => {
            const skillName = gap.name;
            stage2Actions.push({
                id: `action-core-learn-${idx}`,
                title: `Master ${skillName} Core Fundamentals`,
                description: gap.why || gap.whyItMatters || `Essential core competency required for the ${targetRole} target role.`,
                isCompleted: existingActionsCompletedMap.get(`action-core-learn-${idx}`) || false,
                actionType: 'LEARN',
                linkedSkill: skillName
            });
            stage2Actions.push({
                id: `action-core-practice-${idx}`,
                title: `Build Hands-on Mini Proof-of-Concept in ${skillName}`,
                description: `Implement an end-to-end practical exercise or component utilizing ${skillName} with best practices.`,
                isCompleted: existingActionsCompletedMap.get(`action-core-practice-${idx}`) || false,
                actionType: 'PRACTICE',
                linkedSkill: skillName
            });
        });
    } else {
        stage2Actions.push({
            id: 'action-core-review',
            title: `Review Core Architecture for ${targetRole}`,
            description: 'All high-priority core competencies are currently verified. Deepen conceptual and practical design mastery.',
            isCompleted: existingActionsCompletedMap.get('action-core-review') || true,
            actionType: 'LEARN',
            linkedSkill: null
        });
    }

    stage2Actions.push({
        id: 'action-core-matrix-sync',
        title: 'Update Skill Gap Matrix to "Practicing" or "Completed"',
        description: 'Track your practical progress in the Skill Gap Matrix to maintain live profile synchronization.',
        isCompleted: existingActionsCompletedMap.get('action-core-matrix-sync') || false,
        actionType: 'VERIFICATION',
        linkedSkill: null
    });

    const stage2CompletedCount = stage2Actions.filter(a => a.isCompleted).length;
    const stage2Pct = Math.round((stage2CompletedCount / stage2Actions.length) * 100);
    const stage2Status = stage1Status !== 'COMPLETED'
        ? 'LOCKED'
        : (stage2Pct === 100 ? 'COMPLETED' : 'IN_PROGRESS');

    const stage02 = {
        stageNumber: 2,
        stageKey: 'CORE_SKILLS',
        title: 'STAGE 02 — CORE SKILLS',
        tagline: 'High Priority Technical Competencies',
        description: `Eliminate primary critical skill gaps directly identified by the Skill Gap Matrix for ${targetRole}.`,
        status: stage2Status,
        priority: 'HIGH',
        estimatedDuration: '2-4 weeks',
        completionPercentage: stage2Pct,
        objectives: [
            `Acquire and validate ${highPriorityGaps.length} high-priority missing technical competencies`,
            'Develop hands-on coding familiarity with target architecture patterns',
            'Progress skill status from Missing to Practicing'
        ],
        keySkills: stage2Skills,
        actions: stage2Actions,
        projects: [],
        expectedOutcome: `Complete elimination of ${highPriorityGaps.length || 'essential'} critical skill deficiencies required for ${targetRole}.`
    };

    // --- STAGE 03: ADVANCED SKILLS ---
    const stage3Actions = [];
    const stage3Skills = (medPriorityGaps.length > 0 || lowPriorityGaps.length > 0)
        ? [...medPriorityGaps, ...lowPriorityGaps].slice(0, 5).map(s => s.name)
        : ['Cloud & Containerization', 'Automated Testing', 'Architecture Optimization'];

    if (stage3Skills.length > 0) {
        stage3Skills.forEach((skillName, idx) => {
            stage3Actions.push({
                id: `action-adv-${idx}`,
                title: `Deepen Competency in ${skillName}`,
                description: `Study secondary and ecosystem requirements: tooling, deployment strategies, and integration best practices for ${skillName}.`,
                isCompleted: existingActionsCompletedMap.get(`action-adv-${idx}`) || false,
                actionType: 'LEARN',
                linkedSkill: skillName
            });
        });
    }

    stage3Actions.push({
        id: 'action-adv-pipeline',
        title: 'Implement Continuous Integration & Verification Pipeline',
        description: 'Set up automated linting, test runners, and automated builds for your codebase.',
        isCompleted: existingActionsCompletedMap.get('action-adv-pipeline') || false,
        actionType: 'PRACTICE',
        linkedSkill: null
    });

    const stage3CompletedCount = stage3Actions.filter(a => a.isCompleted).length;
    const stage3Pct = Math.round((stage3CompletedCount / stage3Actions.length) * 100);
    const stage3Status = stage2Status === 'LOCKED'
        ? 'LOCKED'
        : (stage3Pct === 100 ? 'COMPLETED' : (stage2Pct >= 50 ? 'IN_PROGRESS' : 'NOT_STARTED'));

    const stage03 = {
        stageNumber: 3,
        stageKey: 'ADVANCED_SKILLS',
        title: 'STAGE 03 — ADVANCED SKILLS',
        tagline: 'Secondary Competencies & Ecosystem Tooling',
        description: 'Master auxiliary ecosystem technologies, cloud hosting, CI/CD pipelines, and performance optimization.',
        status: stage3Status,
        priority: 'MEDIUM',
        estimatedDuration: '2-3 weeks',
        completionPercentage: stage3Pct,
        objectives: [
            'Master tooling, caching layers, and production deployment processes',
            'Integrate automated testing and code quality checks',
            'Bridge ecosystem and infrastructure expectations for the role'
        ],
        keySkills: stage3Skills,
        actions: stage3Actions,
        projects: [],
        expectedOutcome: 'Robust understanding of enterprise deployment, testing, and modern infrastructure.'
    };

    // --- STAGE 04: PROJECT PORTFOLIO ---
    const recommendedProjects = generateProjectRecommendations(targetRole, allMissing);
    const stage4Actions = [
        {
            id: 'action-proj-build',
            title: `Build Flagship Portfolio Project: ${recommendedProjects[0]?.title || 'Role Aligned Application'}`,
            description: `Develop a comprehensive, full-featured application implementing: ${(recommendedProjects[0]?.targetedSkills || ['Clean Architecture', 'API Design']).join(', ')}.`,
            isCompleted: (projectsCount >= 2) || existingActionsCompletedMap.get('action-proj-build') || false,
            actionType: 'PROJECT',
            linkedSkill: null
        },
        {
            id: 'action-proj-repo',
            title: 'Publish Production-Grade GitHub Repository with Documentation',
            description: 'Ensure clean commit history, architectural diagrams, API documentation, and setup instructions in README.',
            isCompleted: (projectsCount >= 1) || existingActionsCompletedMap.get('action-proj-repo') || false,
            actionType: 'PROJECT',
            linkedSkill: null
        },
        {
            id: 'action-proj-deploy',
            title: 'Deploy Live Accessible Application Demo',
            description: 'Host the web application or service on cloud hosting (Vercel, Render, AWS, or Dockerized VPS) with a live demo link.',
            isCompleted: existingActionsCompletedMap.get('action-proj-deploy') || false,
            actionType: 'PROJECT',
            linkedSkill: null
        },
        {
            id: 'action-proj-profile-sync',
            title: 'Add Project to Candidate Profile Portfolio',
            description: 'Register the project in CareerAI Candidate Profile with technologies used and live links for placement audit.',
            isCompleted: (projectsCount >= 1) || existingActionsCompletedMap.get('action-proj-profile-sync') || false,
            actionType: 'PROFILE',
            linkedSkill: null
        }
    ];

    const stage4CompletedCount = stage4Actions.filter(a => a.isCompleted).length;
    const stage4Pct = Math.round((stage4CompletedCount / stage4Actions.length) * 100);
    const stage4Status = stage2Status === 'LOCKED'
        ? 'LOCKED'
        : (stage4Pct === 100 ? 'COMPLETED' : (stage2Pct >= 30 ? 'IN_PROGRESS' : 'NOT_STARTED'));

    const stage04 = {
        stageNumber: 4,
        stageKey: 'PROJECT_PORTFOLIO',
        title: 'STAGE 04 — PROJECT PORTFOLIO',
        tagline: 'Role-Aligned Benchmark Implementations',
        description: 'Build production-ready projects specifically designed to simultaneously eliminate multiple identified skill gaps.',
        status: stage4Status,
        priority: projectsCount === 0 ? 'CRITICAL' : 'HIGH',
        estimatedDuration: '3-4 weeks',
        completionPercentage: stage4Pct,
        objectives: [
            'Synthesize newly acquired skills into tangible, deployable applications',
            'Demonstrate enterprise-level architectural patterns and clean code principles',
            'Provide tangible evidence of engineering competence on public GitHub'
        ],
        keySkills: recommendedProjects[0]?.targetedSkills || ['Full Stack Architecture', 'REST APIs', 'Git'],
        actions: stage4Actions,
        projects: recommendedProjects,
        expectedOutcome: 'A public, verified portfolio project proving practical mastery of target role competencies.'
    };

    // --- STAGE 05: INTERVIEW PREPARATION ---
    const stage5Actions = [
        {
            id: 'action-prep-tech',
            title: `Complete Technical Mock Interview for ${targetRole}`,
            description: 'Use CareerAI Interview Round to complete a live interactive technical evaluation simulation.',
            isCompleted: (interviewCount >= 1 || mockInterviewsCount >= 1) || existingActionsCompletedMap.get('action-prep-tech') || false,
            actionType: 'PRACTICE',
            linkedSkill: null
        },
        {
            id: 'action-prep-deepdive',
            title: 'Review and Master Technical Evaluation Feedback',
            description: 'Inspect weaknesses, review model answers, and retake mock assessments to score above 75%.',
            isCompleted: (interviewCount >= 2) || existingActionsCompletedMap.get('action-prep-deepdive') || false,
            actionType: 'PRACTICE',
            linkedSkill: null
        },
        {
            id: 'action-prep-behavioral',
            title: 'Prepare Structured STAR Behavioral & Situational Stories',
            description: 'Document 5 structured impact narratives covering leadership, technical conflicts, debugging challenges, and deadlines.',
            isCompleted: existingActionsCompletedMap.get('action-prep-behavioral') || false,
            actionType: 'PRACTICE',
            linkedSkill: null
        },
        {
            id: 'action-prep-coding-practice',
            title: 'Solve Core Algorithmic Problems in Coding Round',
            description: 'Practice Arrays, Strings, and Hashing in CareerAI Coding Round with automated test verification.',
            isCompleted: (solvedCodingCount >= 3) || existingActionsCompletedMap.get('action-prep-coding-practice') || false,
            actionType: 'PRACTICE',
            linkedSkill: 'Data Structures & Algorithms'
        },
        {
            id: 'action-prep-coding-assessment',
            title: 'Complete Timed Corporate Coding Assessment',
            description: 'Complete a timed technical assessment in Coding Round simulating campus placement screening.',
            isCompleted: (completedAssessmentsCount >= 1) || existingActionsCompletedMap.get('action-prep-coding-assessment') || false,
            actionType: 'PRACTICE',
            linkedSkill: 'Technical Problem Solving'
        }
    ];

    // Evaluate Aptitude performance & inject targeted weakness actions
    const quantAttempts = aptitudeAttempts.filter(a => a.question?.category === 'Quantitative Aptitude');
    const logicalAttempts = aptitudeAttempts.filter(a => a.question?.category === 'Logical Reasoning');
    const verbalAttempts = aptitudeAttempts.filter(a => a.question?.category === 'Verbal Ability');

    const quantAcc = quantAttempts.length > 0 ? (quantAttempts.filter(a => a.isCorrect).length / quantAttempts.length) : null;
    const logicalAcc = logicalAttempts.length > 0 ? (logicalAttempts.filter(a => a.isCorrect).length / logicalAttempts.length) : null;
    const verbalAcc = verbalAttempts.length > 0 ? (verbalAttempts.filter(a => a.isCorrect).length / verbalAttempts.length) : null;

    if (quantAcc !== null && quantAcc < 0.6) {
        stage5Actions.push({
            id: 'action-prep-aptitude-quant',
            title: 'Remediate Quantitative Aptitude Weakness',
            description: `Current Quantitative accuracy is ${Math.round(quantAcc * 100)}%. Practice Percentages, Time & Work, and Ratios in Aptitude Round.`,
            isCompleted: quantAcc >= 0.7 || existingActionsCompletedMap.get('action-prep-aptitude-quant') || false,
            actionType: 'PRACTICE',
            linkedSkill: 'Quantitative Aptitude'
        });
    }

    if (logicalAcc !== null && logicalAcc < 0.6) {
        stage5Actions.push({
            id: 'action-prep-aptitude-logical',
            title: 'Strengthen Logical Reasoning Competency',
            description: `Current Logical Reasoning accuracy is ${Math.round(logicalAcc * 100)}%. Practice Number Series, Syllogisms, and Seating in Aptitude Round.`,
            isCompleted: logicalAcc >= 0.7 || existingActionsCompletedMap.get('action-prep-aptitude-logical') || false,
            actionType: 'PRACTICE',
            linkedSkill: 'Logical Reasoning'
        });
    }

    if (verbalAcc !== null && verbalAcc < 0.6) {
        stage5Actions.push({
            id: 'action-prep-aptitude-verbal',
            title: 'Enhance Verbal Ability Precision',
            description: `Current Verbal Ability accuracy is ${Math.round(verbalAcc * 100)}%. Practice Sentence Correction and Reading Comprehension in Aptitude Round.`,
            isCompleted: verbalAcc >= 0.7 || existingActionsCompletedMap.get('action-prep-aptitude-verbal') || false,
            actionType: 'PRACTICE',
            linkedSkill: 'Verbal Ability'
        });
    }

    // Corporate Aptitude assessment milestone
    stage5Actions.push({
        id: 'action-prep-aptitude-assessment',
        title: 'Complete First-Round Timed Aptitude Screening Assessment',
        description: 'Take a full timed corporate aptitude assessment in Aptitude Round simulating campus hiring screening.',
        isCompleted: (completedAptitudeAssessmentsCount >= 1) || (solvedAptitudeCount >= 5) || existingActionsCompletedMap.get('action-prep-aptitude-assessment') || false,
        actionType: 'PRACTICE',
        linkedSkill: 'General Aptitude'
    });

    // Mock interview diagnostic remediation milestones
    if (recentMock) {
        if (recentMock.contentScore < 70) {
            stage5Actions.push({
                id: 'action-prep-interview-tech',
                title: 'Strengthen Technical Answer Completeness',
                description: `Previous mock interview technical score was ${recentMock.contentScore}%. Articulate core architecture principles and trade-offs.`,
                isCompleted: recentMock.contentScore >= 75 || existingActionsCompletedMap.get('action-prep-interview-tech') || false,
                actionType: 'PRACTICE',
                linkedSkill: 'Technical Problem Solving'
            });
        }
        if (recentMock.voiceSummary?.totalFillers > 5) {
            stage5Actions.push({
                id: 'action-prep-interview-speech',
                title: 'Refine Speech Cadence & Minimize Fillers',
                description: `Previous mock interview recorded ${recentMock.voiceSummary.totalFillers} verbal fillers. Practice structured, fluent delivery with silent pauses.`,
                isCompleted: recentMock.voiceSummary.totalFillers <= 3 || existingActionsCompletedMap.get('action-prep-interview-speech') || false,
                actionType: 'PRACTICE',
                linkedSkill: 'Verbal Communication'
            });
        }
    }

    const stage5CompletedCount = stage5Actions.filter(a => a.isCompleted).length;
    const stage5Pct = Math.round((stage5CompletedCount / stage5Actions.length) * 100);
    const stage5Status = stage4Status === 'LOCKED'
        ? 'LOCKED'
        : (stage5Pct === 100 ? 'COMPLETED' : (interviewCount > 0 ? 'IN_PROGRESS' : 'NOT_STARTED'));

    const stage05 = {
        stageNumber: 5,
        stageKey: 'INTERVIEW_PREP',
        title: 'STAGE 05 — INTERVIEW PREPARATION',
        tagline: 'Technical & Behavioral Rigor',
        description: 'Simulate high-stakes technical interviews, behavioral evaluations, and live problem-solving rounds.',
        status: stage5Status,
        priority: 'HIGH',
        estimatedDuration: '2 weeks',
        completionPercentage: stage5Pct,
        objectives: [
            'Simulate realistic technical interview questions tailored to target job specifications',
            'Eliminate communication hesitation using STAR behavioral frameworks',
            'Achieve consistent passing scores across technical and situational rounds'
        ],
        keySkills: ['System Design', 'Core Problem Solving', 'Behavioral STAR', 'Architecture Walkthrough'],
        actions: stage5Actions,
        projects: [],
        expectedOutcome: 'High interview confidence validated by concrete mock interview assessment reports.'
    };

    // --- STAGE 06: PLACEMENT READINESS ---
    const stage6Actions = [
        {
            id: 'action-place-eligibility',
            title: 'Conduct Automated Placement Eligibility Audit',
            description: 'Verify your GPA, backlogs status, and graduation year against target job cutoff criteria in Jobs & Opportunities.',
            isCompleted: profileComplete || existingActionsCompletedMap.get('action-place-eligibility') || false,
            actionType: 'APPLICATION',
            linkedSkill: null
        },
        {
            id: 'action-place-mock-drive',
            title: 'Clear a Simulated Corporate Placement Drive',
            description: 'Complete all rounds (OA, Technical Coding, Technical & HR Interview) of a corporate simulation in Mock Placement Drive.',
            isCompleted: (clearedDrivesCount >= 1) || existingActionsCompletedMap.get('action-place-mock-drive') || false,
            actionType: 'PRACTICE',
            linkedSkill: 'Placement Drive Simulation'
        },
        {
            id: 'action-place-tailor',
            title: 'Tailor ATS Keyword Density for Target Opportunities',
            description: 'Ensure all critical keywords from the target role description are naturally represented in your profile summary and project descriptions.',
            isCompleted: existingActionsCompletedMap.get('action-place-tailor') || false,
            actionType: 'VERIFICATION',
            linkedSkill: null
        },
        {
            id: 'action-place-apply',
            title: 'Apply and Track Opportunities in Jobs & Opportunities',
            description: 'Select eligible verified positions and track application submission status directly inside CareerAI.',
            isCompleted: existingActionsCompletedMap.get('action-place-apply') || false,
            actionType: 'APPLICATION',
            linkedSkill: null
        }
    ];

    const stage6CompletedCount = stage6Actions.filter(a => a.isCompleted).length;
    const stage6Pct = Math.round((stage6CompletedCount / stage6Actions.length) * 100);
    const stage6Status = (stage5Status === 'COMPLETED' || stage4Pct >= 75)
        ? (stage6Pct === 100 ? 'COMPLETED' : 'IN_PROGRESS')
        : 'LOCKED';

    const stage06 = {
        stageNumber: 6,
        stageKey: 'PLACEMENT_READINESS',
        title: 'STAGE 06 — PLACEMENT READINESS',
        tagline: 'Final Audit & Opportunity Execution',
        description: 'Finalize academic and skill eligibility verification, calibrate ATS keyword alignment, and submit verified applications.',
        status: stage6Status,
        priority: 'CRITICAL',
        estimatedDuration: 'Ongoing',
        completionPercentage: stage6Pct,
        objectives: [
            'Validate institutional academic placement eligibility and criteria',
            'Optimize profile keyword relevance for target job specifications',
            'Submit verified placement applications with maximum readiness score'
        ],
        keySkills: ['ATS Keyword Alignment', 'Application Tracking', 'Placement Eligibility Audit'],
        actions: stage6Actions,
        projects: [],
        expectedOutcome: 'Full placement readiness with maximized hireability for target career roles.'
    };

    const stages = [stage01, stage02, stage03, stage04, stage05, stage06];

    // Determine current active stage number (first stage not COMPLETED)
    const activeStage = stages.find(s => s.status !== 'COMPLETED') || stages[stages.length - 1];
    const currentStage = activeStage ? activeStage.stageNumber : 6;

    // Calculate overall roadmap progress as average of stage completion percentages
    const totalPercentage = stages.reduce((acc, s) => acc + s.completionPercentage, 0);
    const overallProgress = Math.round(totalPercentage / stages.length);

    // 7. Upsert Roadmap Document
    const roadmapData = {
        user: userId,
        targetRole,
        targetJob: targetJob || null,
        targetCompany: targetCompany || null,
        currentPosition,
        currentStage,
        overallProgress,
        stages,
        summary: `Personalized 6-stage career roadmap targeting ${targetRole}${targetCompany ? ` at ${targetCompany}` : ''}. Current overall progress is ${overallProgress}%.`
    };

    const updatedRoadmap = await CareerRoadmap.findOneAndUpdate(
        { user: userId, targetRole },
        roadmapData,
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
    );

    return updatedRoadmap;
}

/**
 * Retrieve candidate's active roadmap (or auto-generate if profile exists)
 */
async function getRoadmap(userId, options = {}) {
    const { jobId, targetRole: customRole } = options;

    const candidate = await CandidateProfile.findOne({ user: userId });
    if (!candidate) {
        const error = new Error('Candidate profile not found.');
        error.code = 'PROFILE_INCOMPLETE';
        throw error;
    }

    let targetRole = customRole || candidate.personal?.targetRole;
    let targetJob = null;

    if (jobId) {
        const job = await Job.findById(jobId);
        if (job) {
            targetJob = job;
            if (!targetRole) {
                targetRole = job.title;
            }
        }
    }

    if (!targetRole) {
        const error = new Error('Target role not set.');
        error.code = 'PROFILE_INCOMPLETE';
        error.missingFields = ['targetRole'];
        throw error;
    }

    // Try finding existing roadmap
    let query = { user: userId, targetRole };
    if (jobId) {
        query.targetJob = jobId;
    }

    let roadmap = await CareerRoadmap.findOne(query);

    // If no roadmap yet, generate one
    if (!roadmap) {
        roadmap = await generateRoadmap(userId, { targetRole, jobId });
    }

    return roadmap;
}

/**
 * Toggle an action item's completion status in a roadmap stage
 */
async function toggleAction(userId, roadmapId, stageNumber, actionId, isCompleted) {
    const roadmap = await CareerRoadmap.findOne({ _id: roadmapId, user: userId });
    if (!roadmap) {
        throw new Error('Roadmap not found.');
    }

    const stage = roadmap.stages.find(s => s.stageNumber === Number(stageNumber));
    if (!stage) {
        throw new Error(`Stage ${stageNumber} not found.`);
    }

    const action = stage.actions.find(a => a.id === actionId);
    if (!action) {
        throw new Error(`Action ${actionId} not found.`);
    }

    action.isCompleted = Boolean(isCompleted);
    action.completedAt = action.isCompleted ? new Date() : null;

    // Recalculate stage completion percentage
    const completedCount = stage.actions.filter(a => a.isCompleted).length;
    stage.completionPercentage = Math.round((completedCount / stage.actions.length) * 100);

    if (stage.completionPercentage === 100) {
        stage.status = 'COMPLETED';
    } else if (stage.completionPercentage > 0) {
        stage.status = 'IN_PROGRESS';
    }

    // Unlock subsequent stages if prerequisites are satisfied
    roadmap.stages.forEach((s, idx) => {
        if (idx > 0) {
            const prevStage = roadmap.stages[idx - 1];
            if (s.status === 'LOCKED' && (prevStage.status === 'COMPLETED' || prevStage.completionPercentage >= 50)) {
                s.status = 'IN_PROGRESS';
            }
        }
    });

    // Recalculate overall progress
    const totalPct = roadmap.stages.reduce((acc, s) => acc + s.completionPercentage, 0);
    roadmap.overallProgress = Math.round(totalPct / roadmap.stages.length);

    // Update current active stage
    const activeStage = roadmap.stages.find(s => s.status !== 'COMPLETED') || roadmap.stages[roadmap.stages.length - 1];
    roadmap.currentStage = activeStage ? activeStage.stageNumber : 6;

    await roadmap.save();
    return roadmap;
}

/**
 * Update a stage's status manually (e.g. mark stage completed or in progress)
 */
async function updateStageStatus(userId, roadmapId, stageNumber, newStatus) {
    const roadmap = await CareerRoadmap.findOne({ _id: roadmapId, user: userId });
    if (!roadmap) {
        throw new Error('Roadmap not found.');
    }

    const stage = roadmap.stages.find(s => s.stageNumber === Number(stageNumber));
    if (!stage) {
        throw new Error(`Stage ${stageNumber} not found.`);
    }

    stage.status = newStatus;
    if (newStatus === 'COMPLETED') {
        stage.completionPercentage = 100;
        stage.actions.forEach(a => {
            a.isCompleted = true;
            a.completedAt = a.completedAt || new Date();
        });
    }

    // Recalculate overall progress
    const totalPct = roadmap.stages.reduce((acc, s) => acc + s.completionPercentage, 0);
    roadmap.overallProgress = Math.round(totalPct / roadmap.stages.length);

    await roadmap.save();
    return roadmap;
}

module.exports = {
    generateRoadmap,
    getRoadmap,
    toggleAction,
    updateStageStatus
};
