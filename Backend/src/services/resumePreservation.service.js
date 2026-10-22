const path = require("path");
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const AdmZip = require("adm-zip");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const puppeteer = require("puppeteer");
const { getPuppeteerLaunchOptions } = require("../utils/puppeteerHelper");

const apiKey = process.env.GOOGLE_GENAI_API_KEY;
if (!apiKey) {
    console.warn("[Resume Preservation Service Notice]: GOOGLE_GENAI_API_KEY is not set. Tailoring calls will fail until configured in your environment.");
}

const ai = new GoogleGenAI({
    apiKey: apiKey || "UNCONFIGURED_GEMINI_KEY"
});

// Master resume default structured data for Anas A Jaweed Darzi
const MASTER_ANAS_DATA = {
    header: {
        name: "ANAS A JAWEED DARZI",
        subtitle: "B.E. Computer Science & Engineering",
        contact: "Solapur, Maharashtra, India | +91-6300492302 | anasdarzi09@gmail.com",
        links: [
            { text: "linkedin.com/in/anasdarzi", url: "https://linkedin.com/in/anasdarzi" },
            { text: "github.com/anasdarzi", url: "https://github.com/anasdarzi" }
        ]
    },
    summary: "Final-year Computer Science & Engineering student with an 8.75 CGPA and hands-on software development experience through live client projects and academic applications. Skilled in Java, Python, JavaScript, SQL, OOP and REST APIs, with experience building practical web applications and working with relational databases. Strong interest in software engineering, problem solving and developing reliable, user-focused software solutions.",
    technicalSkills: [
        { label: "Programming", skills: "Java, Python, JavaScript, SQL" },
        { label: "Computer Science", skills: "OOP, Data Structures, Algorithms, DBMS" },
        { label: "Software Development", skills: "REST APIs, CRUD Operations" },
        { label: "Frontend", skills: "HTML, CSS, JavaScript, React.js" },
        { label: "Backend", skills: "Spring Boot" },
        { label: "Database", skills: "MySQL, SQL" },
        { label: "AI", skills: "Generative AI, LLMs" },
        { label: "Tools", skills: "Git, GitHub" }
    ],
    education: [
        {
            institution: "N. B. Navale Sinhgad College of Engineering, Solapur",
            date: "2023 – 2027",
            details: "B.E., Computer Science & Engineering | 7th Semester | CGPA: 8.75 / 10"
        },
        {
            institution: "Sholapur Social Association Junior College of Science, Solapur",
            date: "",
            details: "12th | MSBSHSE | 76.33%"
        },
        {
            institution: "S.S.A. New English Medium High School, Solapur",
            date: "",
            details: "10th | MSBSHSE | 81.40%"
        }
    ],
    experience: [
        {
            title: "Web Developer — Oskar Technologies",
            date: "Jan 2026 – Present",
            bullets: [
                "Developed and maintained responsive websites for live client projects using HTML, CSS, JavaScript and PHP, implementing client-specific features and debugging issues.",
                "Collaborated directly with clients to translate requirements into functional, responsive web pages, supporting live deployment and ongoing maintenance."
            ]
        },
        {
            title: "AWS Cloud Computing Intern — EWB EDU TECH PRIVATE LIMITED",
            date: "Sep 2026 – Present",
            bullets: [
                "Completing a hands-on internship focused on AWS Cloud Computing fundamentals, gaining practical exposure to core AWS services and cloud computing concepts."
            ]
        }
    ],
    projects: [
        {
            title: "Enterprise Employee & Asset Management System",
            meta: "Java, Spring Boot, React.js, MySQL, REST APIs | Team Size: 4 | Role: Frontend / Full-Stack Developer",
            bullets: [
                "Developed employee and asset management features with CRUD operations and REST API integration for managing employee and asset information.",
                "Developed React.js interfaces and integrated them with backend APIs and a MySQL database."
            ]
        },
        {
            title: "GenAI Career Preparation & Placement Readiness Platform",
            meta: "Python, Generative AI, LLMs, React.js, REST APIs | Role: GenAI / Backend Integration",
            bullets: [
                "Developed a GenAI-powered career preparation platform for resume analysis, ATS evaluation, skill-gap identification and personalized career recommendations.",
                "Integrated LLM-based analysis and AI-generated recommendations to support resume improvement and placement preparation."
            ]
        },
        {
            title: "Responsive E-Commerce Web Application",
            meta: "HTML, CSS, JavaScript, React.js, Bootstrap | Role: Frontend Developer",
            bullets: [
                "Developed a responsive e-commerce web application with product listings, product details, search, filtering and shopping cart functionality.",
                "Built responsive user interfaces using React.js, JavaScript, HTML and CSS with focus on usability across desktop and mobile devices."
            ]
        }
    ],
    certifications: [
        "AWS Academy Graduate – Machine Learning Foundations – Training Badge",
        "Introduction to Cloud Computing – Infosys Springboard",
        "Programming in Java – Infosys Springboard",
        "Idea Presentation & Project Exhibition – IC-SFSR-24, NBN Sinhgad College of Engineering",
        "Techathon 1.0 – Volunteer Certificate, NBN Sinhgad College of Engineering"
    ]
};

/**
 * Utility to execute Gemini API calls with retry and backoff on transient errors (e.g., 503).
 */
async function callGeminiWithRetry(fn, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            const isTransient = err?.status === 503 || err?.status === 429 || (err?.message && (err.message.includes("503") || err.message.includes("high demand") || err.message.includes("UNAVAILABLE")));
            if (!isTransient || attempt === maxRetries) {
                throw err;
            }
            const delayMs = attempt * 1500;
            console.warn(`[Gemini Retry]: Attempt ${attempt} failed (${err.message}). Retrying in ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
}

/**
 * Escape XML special characters.
 */
function escapeXml(unsafe) {
    if (!unsafe) return "";
    return String(unsafe).replace(/[<>&'"]/g, c => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

/**
 * Render single-page, high-fidelity PDF exactly mirroring Anas_Resume.pdf.
 */
async function renderMasterStyledPdf(data) {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page {
    size: A4;
    margin: 10mm 12mm 10mm 12mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
    color: #111111;
    background: #ffffff;
    font-size: 9.15pt;
    line-height: 1.27;
    -webkit-print-color-adjust: exact;
  }
  .header {
    text-align: center;
    margin-bottom: 6.5pt;
  }
  .name {
    font-size: 16.5pt;
    font-weight: bold;
    letter-spacing: 0.5pt;
    margin-bottom: 1.5pt;
    color: #0f2438;
  }
  .subtitle {
    font-size: 9.8pt;
    color: #222222;
    margin-bottom: 2pt;
  }
  .contact {
    font-size: 8.7pt;
    color: #333333;
    margin-bottom: 1.5pt;
  }
  .links a {
    color: #0056b3;
    text-decoration: underline;
    font-size: 8.7pt;
  }
  .links span {
    color: #555;
    margin: 0 4pt;
  }
  .section {
    margin-bottom: 5.5pt;
  }
  .section-title {
    font-size: 10pt;
    font-weight: bold;
    color: #0d2b45;
    text-transform: uppercase;
    letter-spacing: 0.3pt;
    border-bottom: 1pt solid #0d2b45;
    padding-bottom: 1pt;
    margin-bottom: 3pt;
  }
  .summary-text {
    text-align: justify;
    line-height: 1.25;
  }
  .skill-line {
    margin-bottom: 1.5pt;
    line-height: 1.23;
  }
  .skill-label {
    font-weight: bold;
    color: #111;
  }
  .edu-item, .exp-item, .proj-item {
    margin-bottom: 3.5pt;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: bold;
    color: #111;
  }
  .item-sub {
    color: #222;
    font-size: 8.9pt;
  }
  ul.bullet-list {
    list-style: none;
    padding-left: 11pt;
    margin-top: 1pt;
  }
  ul.bullet-list li {
    position: relative;
    margin-bottom: 1.5pt;
    text-align: justify;
    line-height: 1.24;
  }
  ul.bullet-list li::before {
    content: "●";
    position: absolute;
    left: -10pt;
    font-size: 6.5pt;
    top: 0.5pt;
    color: #111;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="name">${escapeXml(data.header.name)}</div>
    <div class="subtitle">${escapeXml(data.header.subtitle)}</div>
    <div class="contact">${escapeXml(data.header.contact)}</div>
    <div class="links">
      ${(data.header.links || []).map(l => `<a href="${l.url}">${escapeXml(l.text)}</a>`).join('<span>|</span>')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">SUMMARY</div>
    <p class="summary-text">${escapeXml(data.summary)}</p>
  </div>

  <div class="section">
    <div class="section-title">TECHNICAL SKILLS</div>
    ${(data.technicalSkills || []).map(s => `
      <div class="skill-line">
        <span class="skill-label">${escapeXml(s.label)}:</span> ${escapeXml(s.skills)}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">EDUCATION</div>
    ${(data.education || []).map(e => `
      <div class="edu-item">
        <div class="item-header">
          <span>${escapeXml(e.institution)}</span>
          ${e.date ? `<span>${escapeXml(e.date)}</span>` : ''}
        </div>
        <div class="item-sub">${escapeXml(e.details)}</div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">EXPERIENCE</div>
    ${(data.experience || []).map(e => `
      <div class="exp-item">
        <div class="item-header">
          <span>${escapeXml(e.title)}</span>
          <span>${escapeXml(e.date)}</span>
        </div>
        <ul class="bullet-list">
          ${(e.bullets || []).map(b => `<li>${escapeXml(b)}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <div class="section-title">PROJECTS</div>
    ${(data.projects || []).map(p => `
      <div class="proj-item">
        <div class="item-header">
          <span>${escapeXml(p.title)} | ${escapeXml(p.meta)}</span>
        </div>
        <ul class="bullet-list">
          ${(p.bullets || []).map(b => `<li>${escapeXml(b)}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>

  <div class="section" style="margin-bottom: 0;">
    <div class="section-title">CERTIFICATIONS / ACTIVITIES</div>
    <ul class="bullet-list">
      ${(data.certifications || []).map(c => `<li>${escapeXml(c)}</li>`).join('')}
    </ul>
  </div>
</body>
</html>`;

    const launchOptions = getPuppeteerLaunchOptions();
    const browser = await puppeteer.launch(launchOptions);
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: { top: "10mm", bottom: "10mm", left: "12mm", right: "12mm" },
            printBackground: true
        });
        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
}

/**
 * Intelligent AI analysis to tailor ONLY Summary, Skills, and Projects,
 * and generate up to 3 JD-aligned project recommendations with complete build plans.
 */
async function generateTailoringAndRecommendations({
    masterData = MASTER_ANAS_DATA,
    jobDescription,
    selfDescription
}) {
    const prompt = `You are CareerAI's Elite Resume Tailoring and Project Recommendation Engine.
Analyze the target Job Description against the candidate's Master Resume.

Target Job Description:
${jobDescription}

Candidate Profile / Notes:
${selfDescription || "Not provided"}

Candidate Master Resume Data:
- Candidate Name: ${masterData.header.name} (${masterData.header.subtitle})
- Current Summary: ${masterData.summary}
- Technical Skills: ${JSON.stringify(masterData.technicalSkills)}
- Education (LOCKED - DO NOT ALTER): ${JSON.stringify(masterData.education)}
- Experience (LOCKED - DO NOT ALTER): ${JSON.stringify(masterData.experience)}
- Current Projects (ONLY 3):
${JSON.stringify(masterData.projects, null, 2)}
- Certifications / Activities (LOCKED - DO NOT ALTER): ${JSON.stringify(masterData.certifications)}

STRICT SECTION MUTABILITY RULES:
1. SUMMARY: MUST be rewritten concisely (3-4 lines maximum) to strongly align with the target role, using ONLY verified facts from candidate's profile/projects/skills. NEVER invent fake credentials.
2. TECHNICAL SKILLS: Reorder or emphasize the candidate's existing skills to best match JD requirements. Keep the categories (Programming, Computer Science, Software Development, Frontend, Backend, Database, AI, Tools).
3. EXISTING PROJECTS: For each of the 3 existing projects:
   - "Enterprise Employee & Asset Management System"
   - "GenAI Career Preparation & Placement Readiness Platform"
   - "Responsive E-Commerce Web Application"
   Tailor their 2 bullet points to highlight skills, architecture, and features relevant to the JD without inventing fake technologies the candidate did not use.
4. DO NOT TOUCH: EDUCATION, EXPERIENCE, CERTIFICATIONS / ACTIVITIES, or CONTACT INFO. They MUST REMAIN UNTOUCHED.

PROJECT RECOMMENDATION ENGINE MANDATES:
Identify the top technical gaps in the candidate's current project portfolio relative to the JD.
Recommend UP TO 3 new, impactful, JD-specific projects the candidate could build to significantly strengthen their placement readiness.
Do NOT recommend generic, repetitive projects. Tailor them specifically to the target role (e.g. for Python/FastAPI backend, an async microservice; for AI/ML, an inference pipeline).
Each recommendation MUST contain:
- id: e.g. "rec_proj_1", "rec_proj_2", "rec_proj_3"
- title: clear project name
- targetRoleRelevance: why this specific project fits the target role
- whyRecommended: explanation of the specific gap this project closes
- jdRequirementsAddressed: list of requirements from the JD it covers
- techStack: array of relevant technologies
- coreFeatures: 3-4 bullet features to build
- roadmap: 4-step progressive build plan (e.g., ["Step 1: Schema & Auth setup", "Step 2: Core API & async worker", ...])
- repoStructure: realistic ASCII or tree string representation of GitHub repository
- milestones: 3 concrete deliverables
- skillsGained: skills acquired by completing it
- difficulty: "Beginner" | "Intermediate" | "Advanced"
- draftResumeEntry: an object with:
    - title: project title
    - meta: tech stack and role string
    - role: e.g. "Backend Developer"
    - proposedBullets: exactly 2 bullet points describing what the project will demonstrate (formatted for resume, but marked as proposed draft)
- status: "RECOMMENDED"

ATS ANALYSIS:
- currentMatchScore: score between 0 and 100 representing how well the current resume matches the JD.
- potentialMatchScore: realistic score between currentMatchScore and 100 achievable AFTER building recommended projects (e.g. +15 to +25 points higher).
- keywordAlignment: array of 6-10 objects: [ { "keyword": "...", "inResume": boolean, "required": boolean } ]
- technicalSkillsMatch: { score: number, matched: string[], missing: string[] }
- roleResponsibilityAlignment: concise assessment sentence
- existingProjectRelevance: concise assessment sentence
- educationAlignment: concise assessment sentence

Provide output strictly in JSON with this exact top-level schema:
{
  "tailoredSummary": "concise 3-4 line professional summary aligned with JD using verified facts",
  "tailoredTechnicalSkills": [ { "label": "Programming", "skills": "Java, Python, ..." } ],
  "tailoredProjects": [
    { "title": "Enterprise Employee & Asset Management System", "meta": "...", "bullets": ["...", "..."] },
    { "title": "GenAI Career Preparation & Placement Readiness Platform", "meta": "...", "bullets": ["...", "..."] },
    { "title": "Responsive E-Commerce Web Application", "meta": "...", "bullets": ["...", "..."] }
  ],
  "projectRecommendations": [
    {
      "id": "rec_proj_1",
      "title": "...",
      "targetRoleRelevance": "...",
      "whyRecommended": "...",
      "jdRequirementsAddressed": ["..."],
      "techStack": ["..."],
      "coreFeatures": ["..."],
      "roadmap": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ..."],
      "repoStructure": "repo/\\n├── src/\\n...",
      "milestones": ["..."],
      "skillsGained": ["..."],
      "difficulty": "Intermediate",
      "draftResumeEntry": {
        "title": "...",
        "meta": "...",
        "role": "...",
        "proposedBullets": ["...", "..."]
      },
      "status": "RECOMMENDED"
    }
  ],
  "atsAnalysis": {
    "currentMatchScore": 75,
    "potentialMatchScore": 92,
    "keywordAlignment": [ { "keyword": "...", "inResume": true, "required": true } ],
    "technicalSkillsMatch": { "score": 75, "matched": ["..."], "missing": ["..."] },
    "roleResponsibilityAlignment": "...",
    "existingProjectRelevance": "...",
    "educationAlignment": "..."
  }
}`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    }));

    let result = null;
    try {
        result = JSON.parse(response.text);
    } catch (parseErr) {
        console.error("Failed to parse Gemini tailoring response:", parseErr);
        throw parseErr;
    }

    // Normalize keys to prevent any mismatch
    const normalized = {
        tailoredSummary: result.tailoredSummary || result.summary || result.revisedSummary || masterData.summary,
        tailoredTechnicalSkills: result.tailoredTechnicalSkills || result.technicalSkills || result.skills || masterData.technicalSkills,
        tailoredProjects: result.tailoredProjects || result.projects || result.existingProjects || masterData.projects,
        projectRecommendations: (result.projectRecommendations || result.recommendations || []).map((p, idx) => ({
            id: p.id || `rec_proj_${idx + 1}`,
            title: p.title || `Recommended Project ${idx + 1}`,
            targetRoleRelevance: p.targetRoleRelevance || "High relevance to target role requirements",
            whyRecommended: p.whyRecommended || "Closes key practical gaps in JD stack",
            jdRequirementsAddressed: p.jdRequirementsAddressed || [],
            techStack: p.techStack || [],
            coreFeatures: p.coreFeatures || [],
            roadmap: p.roadmap || ["Architecture & setup", "Core implementation", "Integration & test", "Deployment"],
            repoStructure: p.repoStructure || "repo/\n├── src/\n└── README.md",
            milestones: p.milestones || ["Milestone 1: Core Service", "Milestone 2: Integration", "Milestone 3: Production Ready"],
            skillsGained: p.skillsGained || [],
            difficulty: p.difficulty || "Intermediate",
            draftResumeEntry: p.draftResumeEntry || {
                title: p.title,
                meta: (p.techStack || []).join(", "),
                role: "Software Developer",
                proposedBullets: [
                    "Engineered core services and database schema to satisfy role requirements.",
                    "Implemented testing and automated deployment pipeline."
                ]
            },
            status: "RECOMMENDED"
        })),
        atsAnalysis: result.atsAnalysis || {
            currentMatchScore: 70,
            potentialMatchScore: 88,
            keywordAlignment: [],
            technicalSkillsMatch: { score: 70, matched: [], missing: [] },
            roleResponsibilityAlignment: "Aligned with key engineering requirements.",
            existingProjectRelevance: "Projects demonstrate transferable software design foundations.",
            educationAlignment: "Eligible academic profile."
        }
    };

    return normalized;
}

/**
 * Generate a complete, format-preserved PDF from master data and tailored sections.
 */
async function generateTailoredResumePdf({
    masterData = MASTER_ANAS_DATA,
    tailoredSummary,
    tailoredTechnicalSkills,
    tailoredProjects,
    completedRecommendedProjects = []
}) {
    // Clone master data to ensure master resume is NEVER mutated
    const resumeToRender = JSON.parse(JSON.stringify(masterData));

    // Apply ONLY the 3 allowed sections
    if (tailoredSummary) {
        resumeToRender.summary = tailoredSummary;
    }
    if (Array.isArray(tailoredTechnicalSkills) && tailoredTechnicalSkills.length > 0) {
        resumeToRender.technicalSkills = tailoredTechnicalSkills;
    }

    // Projects: 3 tailored existing projects
    let finalProjects = Array.isArray(tailoredProjects) && tailoredProjects.length > 0
        ? JSON.parse(JSON.stringify(tailoredProjects))
        : JSON.parse(JSON.stringify(masterData.projects));

    // If any recommended project was marked COMPLETED by user with verifiable details,
    // include it cleanly (never include unbuilt/planned projects!)
    if (Array.isArray(completedRecommendedProjects) && completedRecommendedProjects.length > 0) {
        for (const comp of completedRecommendedProjects) {
            if (comp.status === "COMPLETED" && comp.draftResumeEntry) {
                finalProjects.push({
                    title: comp.draftResumeEntry.title || comp.title,
                    meta: comp.draftResumeEntry.meta || (comp.techStack ? comp.techStack.join(', ') : ''),
                    bullets: comp.draftResumeEntry.proposedBullets || []
                });
            }
        }
    }

    resumeToRender.projects = finalProjects;

    // Render using exact single-page layout
    return await renderMasterStyledPdf(resumeToRender);
}

/**
 * Replace text within a Word OpenXML <w:p> tag while preserving all <w:pPr> and <w:rPr> styles.
 */
function replaceParagraphRunsText(pXml, newText) {
    if (!pXml.includes("<w:t")) return pXml;
    let isFirst = true;
    return pXml.replace(/<w:r[\s\S]*?<\/w:r>/g, (runXml) => {
        if (isFirst && runXml.includes("<w:t")) {
            isFirst = false;
            return runXml.replace(/<w:t[^>]*>[\s\S]*?<\/w:t>/, `<w:t xml:space="preserve">${escapeXml(newText)}</w:t>`);
        } else if (!isFirst && runXml.includes("<w:t")) {
            return runXml.replace(/<w:t[^>]*>[\s\S]*?<\/w:t>/g, '');
        }
        return runXml;
    });
}

/**
 * Tailor DOCX resume strictly preserving original formatting, styles, tables, and section order.
 */
async function tailorDocxResume({ docxBuffer, jobDescription, selfDescription }) {
    const zip = new AdmZip(docxBuffer);
    const xml = zip.readAsText("word/document.xml");

    const pRegex = /<w:p[\s\S]*?<\/w:p>/g;
    const paragraphs = [];
    let match;
    let index = 0;
    while ((match = pRegex.exec(xml)) !== null) {
        const pXml = match[0];
        const tMatches = [...pXml.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map(m => m[1]).join('');
        paragraphs.push({ index, pXml, text: tMatches.trim() });
        index++;
    }

    const textParagraphs = paragraphs.filter(p => p.text.length > 0);
    if (textParagraphs.length === 0) return docxBuffer;

    const prompt = `You are an expert resume tailoring assistant.
Tailor relevant paragraphs of a candidate's resume for the target Job Description while strictly preserving structure and factual truth.
Target Job Description: ${jobDescription}
Resume Paragraphs: ${JSON.stringify(textParagraphs.map(p => ({ index: p.index, text: p.text })), null, 2)}
Return JSON: { "modifications": [{ "index": number, "tailoredText": string }] }`;

    const response = await callGeminiWithRetry(() => ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }));

    let modifications = [];
    try {
        const parsed = JSON.parse(response.text);
        if (Array.isArray(parsed.modifications)) modifications = parsed.modifications;
    } catch (e) {
        console.warn("Docx tailoring parse error:", e.message);
    }

    let modifiedXml = xml;
    for (const mod of modifications) {
        const pObj = paragraphs.find(p => p.index === mod.index);
        if (pObj && mod.tailoredText && mod.tailoredText !== pObj.text) {
            const updatedPXml = replaceParagraphRunsText(pObj.pXml, mod.tailoredText);
            modifiedXml = modifiedXml.replace(pObj.pXml, updatedPXml);
        }
    }

    zip.updateFile("word/document.xml", Buffer.from(modifiedXml, "utf8"));
    return zip.toBuffer();
}

module.exports = {
    MASTER_ANAS_DATA,
    renderMasterStyledPdf,
    generateTailoringAndRecommendations,
    generateTailoredResumePdf,
    tailorDocxResume
};
