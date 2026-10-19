const fs = require("fs")
const path = require("path")
const pdfParse = require("pdf-parse")
const mammoth = require("mammoth")
const { generateInterviewReport, regenerateQuestions } = require("../services/ai.service")
const {
    MASTER_ANAS_DATA,
    renderMasterStyledPdf,
    generateTailoringAndRecommendations,
    generateTailoredResumePdf,
    tailorDocxResume
} = require("../services/resumePreservation.service")
const interviewReportModel = require("../models/interviewReport.model")
const candidateProfileModel = require("../models/candidateProfile.model")
const masterResumeModel = require("../models/masterResume.model")

const RESUMES_DIR = path.join(__dirname, "../../uploads/resumes")
if (!fs.existsSync(RESUMES_DIR)) {
    fs.mkdirSync(RESUMES_DIR, { recursive: true })
}
const TAILORED_DIR = path.join(__dirname, "../../uploads/tailored-resumes")
if (!fs.existsSync(TAILORED_DIR)) {
    fs.mkdirSync(TAILORED_DIR, { recursive: true })
}
const MASTER_RESUMES_DIR = path.join(__dirname, "../../uploads/master-resumes")
if (!fs.existsSync(MASTER_RESUMES_DIR)) {
    fs.mkdirSync(MASTER_RESUMES_DIR, { recursive: true })
}

const DEFAULT_MASTER_PDF_SOURCE = path.join(MASTER_RESUMES_DIR, "Anas_Resume.pdf")
if (!fs.existsSync(DEFAULT_MASTER_PDF_SOURCE)) {
    try {
        const fallbackPath = "/Users/apple/Downloads/Anas_Resume.pdf"
        if (fs.existsSync(fallbackPath)) {
            fs.copyFileSync(fallbackPath, DEFAULT_MASTER_PDF_SOURCE)
        }
    } catch (fallbackErr) {
        // In cloud environments, this local fallback is safely ignored
    }
}

/**
 * Get or initialize persistent master resume for an authenticated candidate.
 */
async function getOrCreateUserMasterResume(userId) {
    let masterRecord = await masterResumeModel.findOne({ user: userId, isDefault: true })
    if (masterRecord && fs.existsSync(masterRecord.filePath)) {
        return masterRecord
    }

    const userMasterFileName = `${userId}-master-Anas_Resume.pdf`
    const userMasterPath = path.join(MASTER_RESUMES_DIR, userMasterFileName)
    if (fs.existsSync(DEFAULT_MASTER_PDF_SOURCE)) {
        fs.copyFileSync(DEFAULT_MASTER_PDF_SOURCE, userMasterPath)
    }

    let rawText = ""
    try {
        if (fs.existsSync(userMasterPath)) {
            const buf = fs.readFileSync(userMasterPath)
            const parsed = await new pdfParse.PDFParse(Uint8Array.from(buf)).getText()
            rawText = parsed.text || ""
        }
    } catch (e) {
        console.warn("Could not extract text from master resume:", e.message)
    }

    masterRecord = await masterResumeModel.create({
        user: userId,
        fileName: "Anas_Resume.pdf",
        fileType: "application/pdf",
        fileSize: fs.existsSync(userMasterPath) ? fs.statSync(userMasterPath).size : 156557,
        filePath: userMasterPath,
        fileUrl: `/uploads/master-resumes/${userMasterFileName}`,
        rawText,
        parsedData: MASTER_ANAS_DATA,
        isDefault: true,
        uploadedAt: new Date()
    })

    await candidateProfileModel.findOneAndUpdate(
        { user: userId },
        {
            $set: {
                "resume.fileName": "Anas_Resume.pdf",
                "resume.fileType": "application/pdf",
                "resume.filePath": userMasterPath,
                "resume.fileUrl": `/uploads/master-resumes/${userMasterFileName}`,
                "resume.rawText": rawText,
                "resume.uploadedAt": new Date()
            }
        },
        { upsert: true }
    )

    return masterRecord
}

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body
        const userId = req.user.id

        // Ensure user has their persistent master resume
        const masterResume = await getOrCreateUserMasterResume(userId)

        let resumeText = ""
        let resumeFileName = masterResume.fileName
        let resumeFileType = "pdf"
        let resumeOriginalPath = masterResume.filePath
        let masterData = masterResume.parsedData || MASTER_ANAS_DATA

        if (req.file) {
            resumeFileName = req.file.originalname || "resume.pdf"
            const ext = path.extname(resumeFileName).toLowerCase()
            const isDocx = ext === ".docx" || req.file.mimetype.includes("word") || req.file.mimetype.includes("officedocument")
            resumeFileType = isDocx ? "docx" : "pdf"

            const safeFilename = `${userId}-${Date.now()}${ext || (isDocx ? ".docx" : ".pdf")}`
            resumeOriginalPath = path.join(RESUMES_DIR, safeFilename)
            fs.writeFileSync(resumeOriginalPath, req.file.buffer)

            if (isDocx) {
                try {
                    const extracted = await mammoth.extractRawText({ buffer: req.file.buffer })
                    resumeText = extracted.value || ""
                } catch (docxErr) {
                    console.warn("Could not extract text from DOCX resume:", docxErr.message)
                }
            } else {
                try {
                    const parsed = await new pdfParse.PDFParse(Uint8Array.from(req.file.buffer)).getText()
                    resumeText = parsed.text || ""
                } catch (pdfErr) {
                    console.warn("Could not extract text from PDF resume:", pdfErr.message)
                }
            }
        } else {
            resumeText = masterResume.rawText || ""
        }

        // 1. Generate interview preparation report (Questions, Roadmap, Eligibility, Skill Gaps)
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        // 2. Generate JD-based tailoring (Summary, Skills, Projects) + Project Recommendations + ATS Analysis
        let tailoringData = null
        try {
            tailoringData = await generateTailoringAndRecommendations({
                masterData,
                jobDescription,
                selfDescription
            })
        } catch (tailorErr) {
            console.warn("[ResumeTailoring Error]:", tailorErr.message)
        }

        const tailoredSummary = tailoringData?.tailoredSummary || masterData.summary
        const tailoredTechnicalSkills = tailoringData?.tailoredTechnicalSkills || masterData.technicalSkills
        const tailoredProjects = tailoringData?.tailoredProjects || masterData.projects
        const projectRecommendations = tailoringData?.projectRecommendations || []
        const atsAnalysis = tailoringData?.atsAnalysis || {
            currentMatchScore: interViewReportByAi.matchScore || 70,
            potentialMatchScore: Math.min(100, (interViewReportByAi.matchScore || 70) + 18),
            keywordAlignment: [],
            technicalSkillsMatch: { score: 75, matched: [], missing: [] }
        }

        // 3. Generate Version 1 of format-preserved PDF from master resume
        const v1DiskName = `tailored-${userId}-${Date.now()}-v1.pdf`
        const v1Path = path.join(TAILORED_DIR, v1DiskName)
        let v1Buffer = null

        if (resumeFileType === "docx" && req.file) {
            v1Buffer = await tailorDocxResume({
                docxBuffer: req.file.buffer,
                jobDescription,
                selfDescription
            })
        } else {
            v1Buffer = await generateTailoredResumePdf({
                masterData,
                tailoredSummary,
                tailoredTechnicalSkills,
                tailoredProjects,
                completedRecommendedProjects: []
            })
        }

        fs.writeFileSync(v1Path, v1Buffer)

        const v1Record = {
            versionNumber: 1,
            filePath: v1Path,
            fileName: `Anas_Resume_tailored_v1.${resumeFileType === 'docx' ? 'docx' : 'pdf'}`,
            fileType: resumeFileType === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
            tailoredSummary,
            tailoredTechnicalSkills,
            activeProjectIds: [],
            atsScore: atsAnalysis.currentMatchScore,
            potentialAtsScore: atsAnalysis.potentialMatchScore,
            createdAt: new Date()
        }

        const interviewReport = await interviewReportModel.create({
            user: userId,
            jobDescription,
            selfDescription,
            resume: resumeText,
            masterResume: masterResume._id,
            masterResumePath: masterResume.filePath,
            resumeFileName,
            resumeFileType,
            resumeOriginalPath,
            tailoredResumePath: v1Path,
            tailoredResumeMimeType: v1Record.fileType,
            tailoredResumeFileName: v1Record.fileName,
            tailoredSummary,
            tailoredTechnicalSkills,
            tailoredProjects,
            projectRecommendations,
            activeProjectIds: [],
            rejectedProjectIds: [],
            undoHistory: [],
            atsAnalysis,
            versions: [v1Record],
            currentVersionNumber: 1,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("generateInterViewReportController error:", err)
        res.status(500).json({ message: "Failed to generate interview preparation report.", error: err.message })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

/**
 * @description Controller to regenerate questions for an existing interview report.
 */
async function regenerateQuestionsController(req, res) {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription, companyName, technicalQuestions, behavioralQuestions } = interviewReport

    const newQuestions = await regenerateQuestions({
        resume,
        jobDescription,
        selfDescription,
        companyName,
        existingTechnical: technicalQuestions,
        existingBehavioral: behavioralQuestions
    })

    interviewReport.technicalQuestions = newQuestions.technicalQuestions
    interviewReport.behavioralQuestions = newQuestions.behavioralQuestions
    await interviewReport.save()

    res.status(200).json({
        message: "Interview questions regenerated successfully.",
        interviewReport
    })
}

/**
 * @description Controller to handle project recommendation actions: add, reject, mark_completed, undo.
 */
async function handleProjectActionController(req, res) {
    try {
        const { interviewId, projectId } = req.params
        const { action, completedDetails } = req.body
        const userId = req.user.id

        const report = await interviewReportModel.findOne({ _id: interviewId, user: userId })
        if (!report) {
            return res.status(404).json({ message: "Interview report not found or access denied." })
        }

        if (action === "undo") {
            if (!report.undoHistory || report.undoHistory.length === 0) {
                return res.status(400).json({ message: "No actions to undo." })
            }
            const previousState = report.undoHistory.pop()
            report.activeProjectIds = previousState.activeProjectIds || []
            report.rejectedProjectIds = previousState.rejectedProjectIds || []
            if (previousState.recommendationStatuses && report.projectRecommendations) {
                for (const rec of report.projectRecommendations) {
                    if (previousState.recommendationStatuses[rec.id]) {
                        rec.status = previousState.recommendationStatuses[rec.id]
                    }
                }
            }
            await report.save()
            return res.status(200).json({
                message: "Undid previous project selection.",
                interviewReport: report
            })
        }

        const project = report.projectRecommendations.find(p => p.id === projectId)
        if (!project) {
            return res.status(404).json({ message: "Project recommendation not found." })
        }

        // Save snapshot for undo
        const snapshot = {
            activeProjectIds: [...(report.activeProjectIds || [])],
            rejectedProjectIds: [...(report.rejectedProjectIds || [])],
            recommendationStatuses: {}
        }
        report.projectRecommendations.forEach(p => {
            snapshot.recommendationStatuses[p.id] = p.status
        })
        report.undoHistory.push(snapshot)
        if (report.undoHistory.length > 10) report.undoHistory.shift()

        if (action === "add") {
            project.status = "PLANNED"
            if (!report.activeProjectIds.includes(projectId)) {
                report.activeProjectIds.push(projectId)
            }
            report.rejectedProjectIds = report.rejectedProjectIds.filter(id => id !== projectId)
        } else if (action === "reject") {
            project.status = "REJECTED"
            report.activeProjectIds = report.activeProjectIds.filter(id => id !== projectId)
            if (!report.rejectedProjectIds.includes(projectId)) {
                report.rejectedProjectIds.push(projectId)
            }
        } else if (action === "mark_completed") {
            project.status = "COMPLETED"
            project.completedDetails = {
                implementedFeatures: completedDetails?.implementedFeatures || "Core features implemented as designed.",
                technologiesUsed: completedDetails?.technologiesUsed || (project.techStack || []).join(", "),
                personalContribution: completedDetails?.personalContribution || "Full-stack implementation and architecture.",
                testingAndDeployment: completedDetails?.testingAndDeployment || "Tested with unit tests and deployed to live environment.",
                verifiableResults: completedDetails?.verifiableResults || "GitHub repository verified and deployed demo.",
                completedAt: new Date()
            }
            if (!report.activeProjectIds.includes(projectId)) {
                report.activeProjectIds.push(projectId)
            }
            report.rejectedProjectIds = report.rejectedProjectIds.filter(id => id !== projectId)
        }

        await report.save()
        return res.status(200).json({
            message: `Project ${project.title} updated successfully to ${project.status}.`,
            interviewReport: report
        })
    } catch (err) {
        console.error("handleProjectActionController error:", err)
        return res.status(500).json({ message: "Failed to update project recommendation.", error: err.message })
    }
}

/**
 * @description Controller to regenerate tailored resume version from master resume.
 */
async function regenerateTailoredResumeController(req, res) {
    try {
        const { interviewId } = req.params
        const userId = req.user.id

        const report = await interviewReportModel.findOne({ _id: interviewId, user: userId })
        if (!report) {
            return res.status(404).json({ message: "Interview report not found or access denied." })
        }

        // Always start fresh from unchanged master resume
        const masterResume = await getOrCreateUserMasterResume(userId)
        const masterData = masterResume.parsedData || MASTER_ANAS_DATA

        // Find any COMPLETED recommendations that are eligible to be on the resume
        // Unbuilt projects (RECOMMENDED, PLANNED, IN_PROGRESS, REJECTED) are NEVER included!
        const completedProjects = (report.projectRecommendations || []).filter(
            p => p.status === "COMPLETED" && report.activeProjectIds.includes(p.id)
        )

        const newVersionNumber = (report.currentVersionNumber || report.versions?.length || 1) + 1
        const vDiskName = `tailored-${userId}-${Date.now()}-v${newVersionNumber}.pdf`
        const vPath = path.join(TAILORED_DIR, vDiskName)

        const pdfBuffer = await generateTailoredResumePdf({
            masterData,
            tailoredSummary: report.tailoredSummary || masterData.summary,
            tailoredTechnicalSkills: report.tailoredTechnicalSkills || masterData.technicalSkills,
            tailoredProjects: report.tailoredProjects || masterData.projects,
            completedRecommendedProjects: completedProjects
        })

        fs.writeFileSync(vPath, pdfBuffer)

        let updatedAtsScore = report.atsAnalysis?.currentMatchScore || report.matchScore || 70
        if (completedProjects.length > 0) {
            updatedAtsScore = Math.min(98, updatedAtsScore + completedProjects.length * 7)
        }

        const newVersionRecord = {
            versionNumber: newVersionNumber,
            filePath: vPath,
            fileName: `Anas_Resume_tailored_v${newVersionNumber}.pdf`,
            fileType: "application/pdf",
            tailoredSummary: report.tailoredSummary,
            tailoredTechnicalSkills: report.tailoredTechnicalSkills,
            activeProjectIds: report.activeProjectIds || [],
            atsScore: updatedAtsScore,
            potentialAtsScore: report.atsAnalysis?.potentialMatchScore || 88,
            createdAt: new Date()
        }

        report.versions.push(newVersionRecord)
        report.currentVersionNumber = newVersionNumber
        report.tailoredResumePath = vPath
        report.tailoredResumeFileName = newVersionRecord.fileName
        report.tailoredResumeMimeType = "application/pdf"
        if (report.atsAnalysis) {
            report.atsAnalysis.currentMatchScore = updatedAtsScore
        }

        await report.save()

        return res.status(200).json({
            message: `Regenerated tailored resume Version ${newVersionNumber} successfully.`,
            interviewReport: report,
            newVersion: newVersionRecord
        })
    } catch (err) {
        console.error("regenerateTailoredResumeController error:", err)
        return res.status(500).json({ message: "Failed to regenerate tailored resume.", error: err.message })
    }
}

/**
 * @description Controller to get user's master resume.
 */
async function getMasterResumeController(req, res) {
    try {
        const userId = req.user.id
        const master = await getOrCreateUserMasterResume(userId)
        return res.status(200).json({
            message: "Master resume fetched successfully.",
            masterResume: master
        })
    } catch (err) {
        console.error("getMasterResumeController error:", err)
        return res.status(500).json({ message: "Failed to get master resume.", error: err.message })
    }
}

/**
 * @description Controller to replace user's master resume intentionally.
 */
async function replaceMasterResumeController(req, res) {
    try {
        const userId = req.user.id
        if (!req.file) {
            return res.status(400).json({ message: "Please provide a resume PDF to upload as master." })
        }

        const fileName = req.file.originalname || "master_resume.pdf"
        const ext = path.extname(fileName).toLowerCase()
        const safeName = `${userId}-master-${Date.now()}${ext}`
        const targetPath = path.join(MASTER_RESUMES_DIR, safeName)
        fs.writeFileSync(targetPath, req.file.buffer)

        let rawText = ""
        try {
            const parsed = await new pdfParse.PDFParse(Uint8Array.from(req.file.buffer)).getText()
            rawText = parsed.text || ""
        } catch (e) {
            console.warn("Could not extract text from uploaded master PDF:", e.message)
        }

        await masterResumeModel.updateMany({ user: userId }, { $set: { isDefault: false } })

        const newMaster = await masterResumeModel.create({
            user: userId,
            fileName,
            fileType: req.file.mimetype || "application/pdf",
            fileSize: req.file.size,
            filePath: targetPath,
            fileUrl: `/uploads/master-resumes/${safeName}`,
            rawText,
            parsedData: MASTER_ANAS_DATA,
            isDefault: true,
            uploadedAt: new Date()
        })

        return res.status(200).json({
            message: "Master resume replaced successfully. Previously tailored versions remain intact.",
            masterResume: newMaster
        })
    } catch (err) {
        console.error("replaceMasterResumeController error:", err)
        return res.status(500).json({ message: "Failed to replace master resume.", error: err.message })
    }
}

/**
 * @description Controller to download tailored resume PDF/DOCX.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        const userId = req.user.id

        const interviewReport = await interviewReportModel.findById(interviewReportId)
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        if (interviewReport.user && interviewReport.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied to this resume." })
        }

        let buffer = null
        let mimeType = interviewReport.tailoredResumeMimeType || "application/pdf"
        let fileName = interviewReport.tailoredResumeFileName || `Anas_Resume_tailored_v${interviewReport.currentVersionNumber || 1}.pdf`

        if (interviewReport.tailoredResumePath && fs.existsSync(interviewReport.tailoredResumePath)) {
            buffer = fs.readFileSync(interviewReport.tailoredResumePath)
        }

        if (!buffer) {
            const masterResume = await getOrCreateUserMasterResume(userId)
            const masterData = masterResume.parsedData || MASTER_ANAS_DATA
            buffer = await generateTailoredResumePdf({
                masterData,
                tailoredSummary: interviewReport.tailoredSummary || masterData.summary,
                tailoredTechnicalSkills: interviewReport.tailoredTechnicalSkills || masterData.technicalSkills,
                tailoredProjects: interviewReport.tailoredProjects || masterData.projects,
                completedRecommendedProjects: (interviewReport.projectRecommendations || []).filter(
                    p => p.status === "COMPLETED" && interviewReport.activeProjectIds?.includes(p.id)
                )
            })
        }

        res.set({
            "Content-Type": mimeType,
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Access-Control-Expose-Headers": "Content-Disposition"
        })

        return res.send(buffer)
    } catch (err) {
        console.error("generateResumePdfController error:", err)
        return res.status(500).json({ message: "Failed to download tailored resume.", error: err.message })
    }
}

const InterviewAttempt = require('../models/interviewAttempt.model');
const InterviewQuestion = require('../models/interviewQuestion.model');
const { evaluateAnswer, finalizeInterviewAttempt, getCandidateInterviewStats } = require('../services/interviewEvaluation.service');
const interviewTranscriptionService = require('../services/interviewTranscription.service');

async function startMockInterviewController(req, res) {
    try {
        const {
            interviewType = 'Technical',
            role = 'Full Stack Developer',
            difficulty = 'Mid',
            hasVideo = true,
            questionCount = 5
        } = req.body;

        const limit = Math.min(Math.max(+questionCount || 5, 3), 10);
        let query = { isActive: true };
        if (interviewType === 'Technical') {
            query.category = { $in: ['Technical', 'System Design'] };
        } else if (interviewType === 'Behavioral') {
            query.category = 'Behavioral';
        } else if (interviewType === 'HR') {
            query.category = 'HR';
        }

        let availableQuestions = await InterviewQuestion.find(query);
        if (availableQuestions.length < limit) {
            availableQuestions = await InterviewQuestion.find({ isActive: true });
        }

        const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, limit);

        const questionItems = selected.map(q => ({
            questionId: q._id,
            questionText: q.question,
            category: q.category,
            expectedKeyPoints: q.expectedKeyPoints || [],
            candidateAnswer: '',
            transcript: '',
            audioDurationSeconds: 0,
            questionScore: 0,
            feedback: ''
        }));

        const attempt = await InterviewAttempt.create({
            user: req.user.id,
            interviewType,
            role,
            difficulty,
            hasVideo: Boolean(hasVideo),
            questions: questionItems,
            totalQuestions: questionItems.length,
            currentQuestionIndex: 0,
            status: 'In Progress'
        });

        res.status(201).json({
            message: 'Mock interview session initialized successfully.',
            attempt
        });
    } catch (err) {
        console.error('Error starting mock interview:', err);
        res.status(500).json({ message: 'Failed to start mock interview session.', error: err.message });
    }
}

async function submitInterviewAnswerController(req, res) {
    try {
        const { id } = req.params;
        const { questionIndex, transcript, candidateAnswer, audioDurationSeconds, rawAudioData, videoMetrics, isSkipped } = req.body;

        const attempt = await InterviewAttempt.findOne({ _id: id, user: req.user.id });
        if (!attempt) {
            return res.status(404).json({ message: 'Interview session not found or access denied.' });
        }

        if (attempt.status === 'Completed') {
            return res.status(400).json({ message: 'This interview session has already been finalized.' });
        }

        const qIdx = +questionIndex;
        if (isNaN(qIdx) || qIdx < 0 || qIdx >= attempt.questions.length) {
            return res.status(400).json({ message: 'Invalid question index specified.' });
        }

        const questionRecord = attempt.questions[qIdx];
        if (questionRecord.candidateAnswer && !questionRecord.isSkipped && questionRecord.questionScore > 0) {
            return res.status(400).json({ message: 'This question has already been answered and evaluated.' });
        }
        const dbQuestion = await InterviewQuestion.findById(questionRecord.questionId);

        if (isSkipped) {
            questionRecord.isSkipped = true;
            questionRecord.candidateAnswer = '';
            questionRecord.transcript = '';
            questionRecord.questionScore = 0;
            questionRecord.feedback = 'Question was skipped by candidate.';
        } else {
            const evaluated = evaluateAnswer({
                candidateAnswer: candidateAnswer || transcript || '',
                transcript: transcript || candidateAnswer || '',
                audioDurationSeconds: +audioDurationSeconds || 0,
                rawAudioData: rawAudioData || {},
                videoMetrics: {
                    hasVideo: attempt.hasVideo,
                    ...(videoMetrics || {})
                }
            }, dbQuestion || questionRecord);

            Object.assign(questionRecord, evaluated);
            questionRecord.isSkipped = false;
        }

        if (Array.isArray(req.body.monitoringEvents)) {
            req.body.monitoringEvents.forEach(evt => {
                if (evt && evt.type) {
                    attempt.monitoringEvents.push({
                        type: evt.type,
                        timestamp: evt.timestamp ? new Date(evt.timestamp) : new Date(),
                        questionIndex: qIdx,
                        durationSeconds: evt.durationSeconds || 0,
                        details: evt.details || ''
                    });
                }
            });
        }

        attempt.currentQuestionIndex = Math.min(qIdx + 1, attempt.questions.length);
        await attempt.save();

        res.status(200).json({
            message: 'Answer evaluated and saved successfully.',
            question: questionRecord,
            currentQuestionIndex: attempt.currentQuestionIndex,
            isLastQuestion: qIdx === attempt.questions.length - 1
        });
    } catch (err) {
        console.error('Error submitting interview answer:', err);
        res.status(500).json({ message: 'Failed to submit interview answer.', error: err.message });
    }
}

async function uploadInterviewTranscriptController(req, res) {
    try {
        const { id } = req.params;
        const attempt = await InterviewAttempt.findOne({ _id: id, user: req.user.id });
        if (!attempt) {
            return res.status(404).json({ message: 'Interview session not found or access denied.' });
        }

        const { rawText, metadata } = req.body;
        const processed = await interviewTranscriptionService.processTranscript(rawText || '', metadata || {});

        res.status(200).json({
            message: 'Transcript processed successfully.',
            transcript: processed.transcript,
            wordCount: processed.wordCount,
            confidence: processed.confidence
        });
    } catch (err) {
        console.error('Error processing interview transcript:', err);
        res.status(500).json({ message: 'Failed to process transcript.', error: err.message });
    }
}

async function finishMockInterviewController(req, res) {
    try {
        const { id } = req.params;
        const attempt = await InterviewAttempt.findOne({ _id: id, user: req.user.id });
        if (!attempt) {
            return res.status(404).json({ message: 'Interview session not found or access denied.' });
        }

        if (attempt.status === 'Completed') {
            return res.status(200).json({
                message: 'Interview session was already finalized.',
                attempt
            });
        }

        finalizeInterviewAttempt(attempt);
        await attempt.save();

        res.status(200).json({
            message: 'Mock interview completed and graded successfully.',
            attempt
        });
    } catch (err) {
        console.error('Error finalizing mock interview:', err);
        res.status(500).json({ message: 'Failed to finalize mock interview.', error: err.message });
    }
}

async function getInterviewHistoryController(req, res) {
    try {
        const attempts = await InterviewAttempt.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Candidate interview history fetched successfully.',
            attempts
        });
    } catch (err) {
        console.error('Error fetching interview history:', err);
        res.status(500).json({ message: 'Failed to fetch interview history.', error: err.message });
    }
}

async function getInterviewAttemptByIdController(req, res) {
    try {
        const { id } = req.params;
        const attempt = await InterviewAttempt.findOne({ _id: id, user: req.user.id });
        if (!attempt) {
            return res.status(404).json({ message: 'Interview attempt not found or access denied.' });
        }

        res.status(200).json({
            message: 'Interview attempt retrieved successfully.',
            attempt
        });
    } catch (err) {
        console.error('Error fetching interview attempt:', err);
        res.status(500).json({ message: 'Failed to fetch interview attempt.', error: err.message });
    }
}

async function getInterviewStatsController(req, res) {
    try {
        const stats = await getCandidateInterviewStats(req.user.id);
        res.status(200).json({
            message: 'Candidate interview statistics fetched successfully.',
            stats
        });
    } catch (err) {
        console.error('Error fetching interview stats:', err);
        res.status(500).json({ message: 'Failed to fetch interview statistics.', error: err.message });
    }
}

async function getInterviewQuestionsCatalogController(req, res) {
    try {
        const count = await InterviewQuestion.countDocuments({ isActive: true });
        const categories = await InterviewQuestion.distinct('category', { isActive: true });
        const roles = await InterviewQuestion.distinct('role', { isActive: true });

        res.status(200).json({
            message: 'Interview question catalog summary retrieved.',
            totalQuestions: count,
            categories,
            roles
        });
    } catch (err) {
        console.error('Error fetching question catalog:', err);
        res.status(500).json({ message: 'Failed to fetch question catalog.', error: err.message });
    }
}

async function terminateInterviewSessionController(req, res) {
    try {
        const { id } = req.params;
        const { reason, violationType, monitoringEvents, questionIndex } = req.body || {};

        const attempt = await InterviewAttempt.findOne({ _id: id, user: req.user.id });
        if (!attempt) {
            return res.status(404).json({ message: 'Interview session not found or access denied.' });
        }

        if (attempt.status === 'Completed' || attempt.status === 'terminated_due_to_violation') {
            return res.status(200).json({
                message: 'Interview session was already finalized.',
                attempt
            });
        }

        const vType = violationType || 'TAB_SWITCH';
        const vReason = reason || 'Browser tab/window switch detected during active interview.';

        attempt.status = 'terminated_due_to_violation';
        attempt.terminationReason = vReason;
        if (vType === 'TAB_SWITCH') {
            attempt.tabSwitchCount = (attempt.tabSwitchCount || 0) + 1;
        }

        const newEvent = {
            type: vType,
            timestamp: new Date(),
            questionIndex: questionIndex !== undefined ? +questionIndex : attempt.currentQuestionIndex,
            durationSeconds: 0,
            details: vReason
        };
        attempt.monitoringEvents.push(newEvent);

        if (Array.isArray(monitoringEvents)) {
            monitoringEvents.forEach(evt => {
                if (evt && evt.type && evt.type !== vType) {
                    attempt.monitoringEvents.push({
                        type: evt.type,
                        timestamp: evt.timestamp ? new Date(evt.timestamp) : new Date(),
                        questionIndex: evt.questionIndex !== undefined ? +evt.questionIndex : attempt.currentQuestionIndex,
                        durationSeconds: evt.durationSeconds || 0,
                        details: evt.details || ''
                    });
                }
            });
        }

        finalizeInterviewAttempt(attempt);
        await attempt.save();

        res.status(200).json({
            message: 'Interview session terminated due to monitoring violation.',
            attempt
        });
    } catch (err) {
        console.error('Error terminating interview session:', err);
        res.status(500).json({ message: 'Failed to terminate interview session.', error: err.message });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    regenerateQuestionsController,
    generateResumePdfController,
    handleProjectActionController,
    regenerateTailoredResumeController,
    getMasterResumeController,
    replaceMasterResumeController,
    startMockInterviewController,
    submitInterviewAnswerController,
    uploadInterviewTranscriptController,
    finishMockInterviewController,
    terminateInterviewSessionController,
    getInterviewHistoryController,
    getInterviewAttemptByIdController,
    getInterviewStatsController,
    getInterviewQuestionsCatalogController
};