require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const connectDB = require("../config/database");
const userModel = require("../models/user.model");
const masterResumeModel = require("../models/masterResume.model");
const interviewReportModel = require("../models/interviewReport.model");
const {
    MASTER_ANAS_DATA,
    generateTailoredResumePdf,
    generateTailoringAndRecommendations,
    renderMasterStyledPdf
} = require("../services/resumePreservation.service");

function getFileChecksum(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash("md5").update(fileBuffer).digest("hex");
}

async function runTests() {
    console.log("================================================================================");
    console.log("CAREERAI MASTER RESUME & TAILORING VERIFICATION SUITE");
    console.log("================================================================================\n");

    await connectDB();

    const masterFilePath = path.resolve(__dirname, "../../uploads/master-resumes/Anas_Resume.pdf");
    if (!fs.existsSync(masterFilePath)) {
        throw new Error(`Master resume file not found at ${masterFilePath}`);
    }

    const initialChecksum = getFileChecksum(masterFilePath);
    console.log(`[1] Persistent Master Resume located at:\n    ${masterFilePath}`);
    console.log(`    Initial MD5 Checksum: ${initialChecksum}\n`);

    // 1. Get or create test user
    let user = await userModel.findOne({ email: "anas.candidate@test.com" });
    if (!user) {
        user = await userModel.create({
            username: "anas_darzi_test",
            email: "anas.candidate@test.com",
            password: "hashed_test_password"
        });
        console.log(`[2] Created test user: ${user.email} (${user._id})`);
    } else {
        console.log(`[2] Using test user: ${user.email} (${user._id})`);
    }

    // 2. Master resume record in DB
    let masterRecord = await masterResumeModel.findOne({ user: user._id, isDefault: true });
    if (!masterRecord) {
        masterRecord = await masterResumeModel.create({
            user: user._id,
            fileName: "Anas_Resume.pdf",
            fileType: "application/pdf",
            fileSize: fs.statSync(masterFilePath).size,
            filePath: masterFilePath,
            fileUrl: "/uploads/master-resumes/Anas_Resume.pdf",
            rawText: "ANAS A JAWEED DARZI...",
            parsedData: MASTER_ANAS_DATA,
            isDefault: true,
            uploadedAt: new Date()
        });
        console.log(`[3] Created Master Resume DB record: ID=${masterRecord._id}`);
    } else {
        console.log(`[3] Existing Master Resume DB record found: ID=${masterRecord._id}`);
    }

    console.log(`    Original Sections in Master Resume:`);
    console.log(`    - Summary: ${masterRecord.parsedData.summary.substring(0, 70)}...`);
    console.log(`    - Technical Skills categories: ${masterRecord.parsedData.technicalSkills.length}`);
    console.log(`    - Education entries: ${masterRecord.parsedData.education.length} (IMMUTABLE)`);
    console.log(`    - Experience entries: ${masterRecord.parsedData.experience.length} (IMMUTABLE)`);
    console.log(`    - Projects count: ${masterRecord.parsedData.projects.length}`);
    console.log(`    - Certifications entries: ${(masterRecord.parsedData.certifications || []).length} (IMMUTABLE)\n`);

    // 3. Test JD 1: Python / FastAPI Backend Engineer
    console.log("--------------------------------------------------------------------------------");
    console.log("TEST RUN 1: Tailoring for JD 1 (Python / FastAPI Backend Developer)");
    console.log("--------------------------------------------------------------------------------");
    const jd1 = `Job Title: Senior Python Backend Developer
Location: Remote
Requirements:
- 2+ years of experience with Python, FastAPI or Django, and RESTful APIs
- Strong knowledge of PostgreSQL, Redis caching, and database query optimization
- Experience with Docker, microservices architecture, and CI/CD pipelines
- Familiarity with Celery for background asynchronous task processing
- Experience building scalable web applications with automated unit testing`;

    console.log("Generating JD-based tailoring, project recommendations, and ATS analysis...");
    const tailoringData1 = await generateTailoringAndRecommendations({
        masterData: masterRecord.parsedData,
        jobDescription: jd1,
        selfDescription: "Passionate developer skilled in Python, backend development, and databases."
    });

    console.log(`\n✓ Tailored Summary:`);
    console.log(`  "${tailoringData1.tailoredSummary}"`);

    console.log(`\n✓ Project Recommendations Generated (${tailoringData1.projectRecommendations.length} projects):`);
    tailoringData1.projectRecommendations.forEach((proj, idx) => {
        console.log(`  ${idx + 1}. [${proj.status}] ${proj.title}`);
        console.log(`     Target Role Relevance: ${proj.targetRoleRelevance}`);
        console.log(`     Tech Stack: ${(proj.techStack || []).join(', ')}`);
        console.log(`     Roadmap Steps: ${(proj.roadmap || []).length} steps`);
        console.log(`     Draft Resume Entry: "${proj.draftResumeEntry?.title} | ${proj.draftResumeEntry?.meta}"`);
    });

    console.log(`\n✓ CareerAI ATS Analysis:`);
    console.log(`  - Current Match Score: ${tailoringData1.atsAnalysis?.currentMatchScore}%`);
    console.log(`  - Potential Match Score (Upon building recommended projects): ${tailoringData1.atsAnalysis?.potentialMatchScore}%`);

    // Generate Tailored Resume v1 (Strict Single-Page PDF)
    console.log("\nRendering Version 1 Tailored PDF...");
    const v1PdfBuffer = await generateTailoredResumePdf({
        masterData: masterRecord.parsedData,
        tailoredSummary: tailoringData1.tailoredSummary,
        tailoredTechnicalSkills: tailoringData1.tailoredTechnicalSkills,
        tailoredProjects: tailoringData1.tailoredProjects,
        completedRecommendedProjects: [] // Unbuilt projects MUST NEVER be included
    });

    const v1Path = path.resolve(__dirname, `../../uploads/tailored-resumes/test-jd1-v1.pdf`);
    fs.mkdirSync(path.dirname(v1Path), { recursive: true });
    fs.writeFileSync(v1Path, v1PdfBuffer);
    console.log(`✓ Version 1 PDF generated successfully: ${v1Path} (${v1PdfBuffer.length} bytes)`);

    // Verify unbuilt projects are excluded from final resume
    const pdfParse = require("pdf-parse");
    const v1Parsed = await new pdfParse.PDFParse(Uint8Array.from(v1PdfBuffer)).getText();
    const unbuiltProjTitle = tailoringData1.projectRecommendations[0].title;
    const isUnbuiltInV1 = v1Parsed.text.includes(unbuiltProjTitle);
    console.log(`✓ Verification: Is unbuilt recommended project ("${unbuiltProjTitle}") in v1 PDF? -> ${isUnbuiltInV1 ? "FAIL" : "NO (CORRECT: Unbuilt projects excluded)"}`);
    if (isUnbuiltInV1) throw new Error("Unbuilt project was improperly included in resume!");

    // 4. Test Add, Reject, Undo, and Mark Completed
    console.log("\n--------------------------------------------------------------------------------");
    console.log("TEST RUN 2: Add, Reject, Undo, and Mark Completed Actions");
    console.log("--------------------------------------------------------------------------------");

    const rec0 = tailoringData1.projectRecommendations[0];
    const rec1 = tailoringData1.projectRecommendations[1];

    // Create an InterviewReport document to test controller-level state mutations
    const reportDoc = await interviewReportModel.create({
        user: user._id,
        jobDescription: jd1,
        selfDescription: "Test candidate",
        resume: masterRecord.rawText,
        masterResume: masterRecord._id,
        masterResumePath: masterRecord.filePath,
        resumeFileName: "Anas_Resume.pdf",
        resumeFileType: "application/pdf",
        tailoredResumePath: v1Path,
        tailoredResumeFileName: "Anas_Resume_tailored_v1.pdf",
        tailoredResumeMimeType: "application/pdf",
        tailoredSummary: tailoringData1.tailoredSummary,
        tailoredTechnicalSkills: tailoringData1.tailoredTechnicalSkills,
        tailoredProjects: tailoringData1.tailoredProjects,
        projectRecommendations: tailoringData1.projectRecommendations,
        activeProjectIds: [],
        rejectedProjectIds: [],
        undoHistory: [],
        atsAnalysis: tailoringData1.atsAnalysis,
        versions: [{
            versionNumber: 1,
            filePath: v1Path,
            fileName: "Anas_Resume_tailored_v1.pdf",
            fileType: "application/pdf",
            atsScore: tailoringData1.atsAnalysis.currentMatchScore,
            createdAt: new Date()
        }],
        currentVersionNumber: 1,
        title: "Senior Python Backend Developer Preparation Plan",
        companyName: "TechCorp",
        matchScore: tailoringData1.atsAnalysis.currentMatchScore,
        technicalQuestions: [],
        behavioralQuestions: [],
        preparationPlan: []
    });

    console.log(`Created test report record: ID=${reportDoc._id}`);

    const targetRec0 = reportDoc.projectRecommendations.find(p => p.id === rec0.id);
    const targetRec1 = reportDoc.projectRecommendations.find(p => p.id === rec1.id);

    // Action A: Add rec0 to resume draft
    console.log(`\nAction A: Add "${targetRec0.title}" to Resume Draft`);
    reportDoc.undoHistory.push({
        activeProjectIds: [...reportDoc.activeProjectIds],
        rejectedProjectIds: [...reportDoc.rejectedProjectIds],
        recommendationStatuses: { [targetRec0.id]: targetRec0.status }
    });
    targetRec0.status = "PLANNED";
    reportDoc.activeProjectIds.push(targetRec0.id);
    reportDoc.markModified("projectRecommendations");
    await reportDoc.save();
    console.log(`✓ Status changed to PLANNED. Active draft IDs: ${JSON.stringify(reportDoc.activeProjectIds)}`);

    // Action B: Reject rec1
    console.log(`\nAction B: Reject "${targetRec1.title}"`);
    reportDoc.undoHistory.push({
        activeProjectIds: [...reportDoc.activeProjectIds],
        rejectedProjectIds: [...reportDoc.rejectedProjectIds],
        recommendationStatuses: { [targetRec1.id]: targetRec1.status }
    });
    targetRec1.status = "REJECTED";
    reportDoc.rejectedProjectIds.push(targetRec1.id);
    reportDoc.markModified("projectRecommendations");
    await reportDoc.save();
    console.log(`✓ Status changed to REJECTED. Rejected IDs: ${JSON.stringify(reportDoc.rejectedProjectIds)}`);

    // Action C: Test Undo (should restore rec1)
    console.log(`\nAction C: Execute Undo`);
    const prevUndoState = reportDoc.undoHistory.pop();
    reportDoc.activeProjectIds = prevUndoState.activeProjectIds;
    reportDoc.rejectedProjectIds = prevUndoState.rejectedProjectIds;
    if (prevUndoState.recommendationStatuses && prevUndoState.recommendationStatuses[targetRec1.id]) {
        targetRec1.status = prevUndoState.recommendationStatuses[targetRec1.id];
    }
    reportDoc.markModified("projectRecommendations");
    await reportDoc.save();
    console.log(`✓ Undo succeeded! Rec1 status reverted to: ${targetRec1.status}. Rejected IDs: ${JSON.stringify(reportDoc.rejectedProjectIds)}`);

    // Action D: Candidate Marks rec0 as COMPLETED with verifiable implementation details
    console.log(`\nAction D: Candidate marks "${targetRec0.title}" as BUILT & COMPLETED with verified facts`);
    targetRec0.status = "COMPLETED";
    targetRec0.completedDetails = {
        implementedFeatures: "Built async REST API endpoints with FastAPI, connection pool with asyncpg, and Celery worker tasks.",
        technologiesUsed: "Python, FastAPI, PostgreSQL, Redis, Docker, Pytest",
        personalContribution: "Architected microservice, implemented JWT auth, designed database schema, and wrote integration tests.",
        testingAndDeployment: "Achieved 90% unit test coverage with Pytest, deployed containerized app on AWS ECS.",
        verifiableResults: "https://github.com/anasdarzi/" + targetRec0.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        completedAt: new Date()
    };
    if (!reportDoc.activeProjectIds.includes(targetRec0.id)) {
        reportDoc.activeProjectIds.push(targetRec0.id);
    }
    reportDoc.markModified("projectRecommendations");
    await reportDoc.save();
    console.log(`✓ Project successfully marked COMPLETED with verified candidate contribution.`);

    // 5. Test Resume Regeneration -> Version 2
    console.log("\n--------------------------------------------------------------------------------");
    console.log("TEST RUN 3: Regenerate Tailored Resume from Unchanged Master Resume");
    console.log("--------------------------------------------------------------------------------");

    // Must start strictly from original master resume
    const masterDataForRegen = masterRecord.parsedData;
    const completedProjects = reportDoc.projectRecommendations.filter(
        p => p.status === "COMPLETED" && reportDoc.activeProjectIds.includes(p.id)
    );

    console.log(`Regenerating resume version 2 with ${completedProjects.length} verified completed project...`);
    const v2PdfBuffer = await generateTailoredResumePdf({
        masterData: masterDataForRegen,
        tailoredSummary: reportDoc.tailoredSummary,
        tailoredTechnicalSkills: reportDoc.tailoredTechnicalSkills,
        tailoredProjects: reportDoc.tailoredProjects,
        completedRecommendedProjects: completedProjects
    });

    const v2Path = path.resolve(__dirname, `../../uploads/tailored-resumes/test-jd1-v2.pdf`);
    fs.writeFileSync(v2Path, v2PdfBuffer);
    console.log(`✓ Version 2 PDF generated: ${v2Path} (${v2PdfBuffer.length} bytes)`);

    // Verify Version 2 includes the completed project
    const v2Parsed = await new pdfParse.PDFParse(Uint8Array.from(v2PdfBuffer)).getText();
    const expectedProjectTitle = targetRec0.draftResumeEntry?.title || targetRec0.title;
    const isCompletedInV2 = v2Parsed.text.includes(expectedProjectTitle) || v2Parsed.text.includes(targetRec0.title);
    console.log(`✓ Verification: Is verified completed project ("${expectedProjectTitle}") in Version 2 PDF? -> ${isCompletedInV2 ? "YES (CORRECT)" : "FAIL"}`);
    if (!isCompletedInV2) throw new Error("Verified completed project was not included in Version 2!");

    // 6. Test JD 2: AI / ML Engineer to confirm second JD also starts from unchanged master
    console.log("\n--------------------------------------------------------------------------------");
    console.log("TEST RUN 4: Second JD (GenAI & LLM Solutions Engineer)");
    console.log("--------------------------------------------------------------------------------");
    const jd2 = `Job Title: Generative AI & LLM Solutions Engineer
Requirements:
- Experience building RAG pipelines, fine-tuning LLMs, and prompt engineering
- Proficiency with LangChain, LlamaIndex, Vector databases (Pinecone / ChromaDB)
- Python backend development with FastAPI
- Model evaluation, latency benchmarking, and deploying models to cloud`;

    console.log("Generating tailoring for second JD...");
    const tailoringData2 = await generateTailoringAndRecommendations({
        masterData: masterRecord.parsedData,
        jobDescription: jd2,
        selfDescription: "AI/ML developer skilled in Python, LLMs, and GenAI."
    });

    console.log(`✓ JD 2 Tailored Summary: "${tailoringData2.tailoredSummary}"`);
    console.log(`✓ JD 2 Recommendations (${tailoringData2.projectRecommendations.length} projects):`);
    tailoringData2.projectRecommendations.forEach((p, i) => {
        console.log(`  ${i + 1}. [${p.status}] ${p.title} (${(p.techStack || []).join(', ')})`);
    });

    const jd2PdfBuffer = await generateTailoredResumePdf({
        masterData: masterRecord.parsedData,
        tailoredSummary: tailoringData2.tailoredSummary,
        tailoredTechnicalSkills: tailoringData2.tailoredTechnicalSkills,
        tailoredProjects: tailoringData2.tailoredProjects,
        completedRecommendedProjects: []
    });

    const jd2Path = path.resolve(__dirname, `../../uploads/tailored-resumes/test-jd2-v1.pdf`);
    fs.writeFileSync(jd2Path, jd2PdfBuffer);
    console.log(`✓ JD 2 Version 1 PDF generated: ${jd2Path} (${jd2PdfBuffer.length} bytes)`);

    // 7. Critical Master Resume Invariance Check
    console.log("\n--------------------------------------------------------------------------------");
    console.log("CRITICAL MASTER RESUME INVARIANCE & PERSISTENCE CHECK");
    console.log("--------------------------------------------------------------------------------");
    const finalChecksum = getFileChecksum(masterFilePath);
    console.log(`Initial Master Resume Checksum: ${initialChecksum}`);
    console.log(`Final Master Resume Checksum:   ${finalChecksum}`);
    const isUnmodified = initialChecksum === finalChecksum;
    console.log(`✓ Has master resume file ever been modified or overwritten? -> ${isUnmodified ? "NO, 100% UNCHANGED (PASS)" : "FAIL, WAS MODIFIED"}`);
    if (!isUnmodified) throw new Error("FATAL: Master resume was modified!");

    console.log("\n================================================================================");
    console.log("ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
    console.log("================================================================================");

    process.exit(0);
}

runTests().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
