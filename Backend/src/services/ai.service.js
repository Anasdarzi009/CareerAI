const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const apiKey = process.env.GOOGLE_GENAI_API_KEY
if (!apiKey) {
    console.warn("[AI Service Notice]: GOOGLE_GENAI_API_KEY is not set. Gemini API calls will fail until this is configured in your environment.")
}

const ai = new GoogleGenAI({
    apiKey: apiKey || "UNCONFIGURED_GEMINI_KEY"
})

const eligibilityDetailSchema = z.object({
    criterion: z.string().describe("The specific requirement extracted from JD, e.g. '10th Percentage', '12th Percentage', 'Graduation CGPA', 'Required Degree', 'Years of Experience'"),
    required: z.string().describe("The minimum or specific requirement stated in the JD, e.g. '75%', '7.5 CGPA', 'Bachelor in CS'"),
    candidate: z.string().describe("The candidate's score or qualification found in resume/profile, e.g. '80%', '7.2 CGPA', 'Not found in profile'"),
    status: z.enum([ "met", "failed", "missing" ]).describe("Whether the candidate met the requirement, failed it, or information was missing in resume")
})

const eligibilitySchema = z.object({
    status: z.enum([ "eligible", "ineligible", "unable_to_verify" ]).describe("Overall eligibility status. Must be 'ineligible' if any required criterion is failed, 'unable_to_verify' if required criterion info is missing and none failed, or 'eligible' if all stated criteria are met."),
    summary: z.string().describe("Clear explanation of the eligibility result, referencing specific scores or missing information."),
    details: z.array(eligibilityDetailSchema).describe("List of explicit requirements evaluated against the candidate's profile.")
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description."),
    companyName: z.string().describe("Company name extracted from the job description if present, otherwise empty string."),
    questionSource: z.string().describe("Label indicating how questions were generated, e.g., 'Company-focused questions based on public interview patterns & role requirements' or 'Personalized questions based on role requirements & candidate profile'."),
    eligibility: eligibilitySchema.describe("Evaluation of explicit academic and experience requirements found in the JD against the candidate profile."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("Technical question specific to role and technologies."),
        intention: z.string().describe("Interviewer intention behind asking this question."),
        answer: z.string().describe("Suggested model answer and points to cover.")
    })).describe("AT LEAST 10 unique, technically rigorous technical questions tailored to the job description and candidate resume."),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("Behavioral question specific to role, candidate experience, and company culture."),
        intention: z.string().describe("Interviewer intention behind asking this question."),
        answer: z.string().describe("Suggested STAR approach model answer and points to cover.")
    })).describe("AT LEAST 10 unique behavioral questions tailored to candidate experience, teamwork, and job description."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("Skill candidate is lacking for this role."),
        severity: z.enum([ "low", "medium", "high" ]).describe("Severity of skill gap.")
    })).describe("List of skill gaps."),
    preparationPlan: z.array(z.object({
        day: z.number().describe("Day number starting from 1."),
        focus: z.string().describe("Main focus of the day."),
        tasks: z.array(z.string()).describe("Tasks for the day.")
    })).describe("A day-wise preparation plan."),
    title: z.string().describe("Title of the job role."),
})

const questionsSchema = z.object({
    technicalQuestions: z.array(z.object({
        question: z.string().describe("Technical question."),
        intention: z.string().describe("Interviewer intention."),
        answer: z.string().describe("Model answer.")
    })).describe("AT LEAST 10 unique technical questions."),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("Behavioral question."),
        intention: z.string().describe("Interviewer intention."),
        answer: z.string().describe("Model answer.")
    })).describe("AT LEAST 10 unique behavioral questions.")
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a comprehensive interview preparation report for a candidate with the following details:
Resume / Profile Content:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}

INSTRUCTIONS:
1. QUESTION QUANTITY MANDATE:
   - Generate AT LEAST 10 unique Technical Questions.
   - Generate AT LEAST 10 unique Behavioral Questions.
   - Total questions must be 20 or more.

2. COMPANY DETECTION & QUESTION TAILORING:
   - Check if a company name (e.g. Google, Amazon, Microsoft, TCS, Infosys, Accenture, Deloitte, Meta, Apple, etc.) is mentioned in the Job Description.
   - If a company is detected, populate "companyName" with the company name and set "questionSource" to "Company-focused interview questions based on public interview patterns & role requirements".
   - If no company is detected, set "companyName" to "" and "questionSource" to "Personalized questions based on role requirements & candidate profile".
   - Never claim questions are leaked or guaranteed live test questions.

3. ELIGIBILITY EVALUATION:
   - Extract explicit mandatory criteria from the Job Description (e.g. "10th minimum 75%", "12th minimum 75%", "CGPA 7.5+", "Minimum 2 years experience", "B.Tech required").
   - Compare extracted criteria against the Candidate Resume / Self Description.
   - STRICT RULES FOR ELIGIBILITY:
     * Only evaluate criteria EXPLICITLY stated in the Job Description. Do NOT evaluate or reject candidate for criteria not required by the JD (e.g., if JD only asks for 12th 75%, do NOT reject for 10th score).
     * If candidate fails ANY explicitly required criterion, eligibility status MUST be "ineligible".
     * If a required criterion is NOT found in the candidate resume/profile, detail status MUST be "missing", candidate field MUST be "Not found in profile", and if no other criteria were failed, overall status MUST be "unable_to_verify".
     * If candidate meets ALL explicitly required criteria, overall status MUST be "eligible".
     * If the Job Description specifies NO mandatory cut-offs or academic requirements, set eligibility status to "eligible", summary to "No explicit academic or cutoff criteria stated in job description.", and details to [].
`

    let response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    let reportData = JSON.parse(response.text)

    // Ensure minimum 10 technical & 10 behavioral questions
    if (!reportData.technicalQuestions || reportData.technicalQuestions.length < 10 || !reportData.behavioralQuestions || reportData.behavioralQuestions.length < 10) {
        console.log("Retrying report generation to ensure 10+ technical and 10+ behavioral questions...")
        response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt + "\nCRITICAL: You MUST provide at least 10 technical questions and at least 10 behavioral questions.",
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        })
        reportData = JSON.parse(response.text)
    }

    return reportData
}

async function regenerateQuestions({ resume, selfDescription, jobDescription, companyName, existingTechnical, existingBehavioral }) {
    const previousQuestions = [
        ...(existingTechnical || []).map(q => q.question),
        ...(existingBehavioral || []).map(q => q.question)
    ]

    const prompt = `Generate a NEW, FRESH set of interview questions for a candidate:
Resume / Profile:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}

Target Company:
${companyName || "Not specified"}

DO NOT REPEAT ANY OF THESE PREVIOUS QUESTIONS:
${JSON.stringify(previousQuestions, null, 2)}

INSTRUCTIONS:
1. Generate AT LEAST 10 BRAND NEW Technical Questions.
2. Generate AT LEAST 10 BRAND NEW Behavioral Questions.
3. Questions must be relevant, unique, and tailored to the job description and candidate experience.
4. Ensure 0 overlap with the previous questions listed above.
`

    let response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(questionsSchema),
        }
    })

    let newQuestionsData = JSON.parse(response.text)

    if (!newQuestionsData.technicalQuestions || newQuestionsData.technicalQuestions.length < 10 || !newQuestionsData.behavioralQuestions || newQuestionsData.behavioralQuestions.length < 10) {
        response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt + "\nCRITICAL: You MUST generate at least 10 technical and 10 behavioral questions.",
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(questionsSchema),
            }
        })
        newQuestionsData = JSON.parse(response.text)
    }

    return newQuestionsData
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, regenerateQuestions, generateResumePdf }