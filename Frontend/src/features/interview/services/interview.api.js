import axios from "axios";
import { API_BASE_URL } from "../../../config/api.config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to regenerate technical and behavioral questions for an existing interview report.
 */
export const regenerateQuestions = async (interviewId) => {
    const response = await api.post(`/api/interview/${interviewId}/regenerate-questions`)
    return response.data
}

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return {
        data: response.data,
        headers: response.headers
    }
}

/**
 * @description Get user's persistent master resume
 */
export const getMasterResume = async () => {
    const response = await api.get("/api/interview/master-resume")
    return response.data
}

/**
 * @description Replace master resume intentionally
 */
export const replaceMasterResume = async (file) => {
    const formData = new FormData()
    formData.append("resume", file)
    const response = await api.post("/api/interview/master-resume/replace", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data
}

/**
 * @description Execute project recommendation action: add, reject, mark_completed, undo
 */
export const handleProjectRecommendationAction = async (interviewId, projectId, { action, completedDetails }) => {
    const response = await api.post(`/api/interview/${interviewId}/recommendations/${projectId}/action`, {
        action,
        completedDetails
    })
    return response.data
}

/**
 * @description Regenerate tailored resume version starting from master resume
 */
export const regenerateTailoredResume = async (interviewId) => {
    const response = await api.post(`/api/interview/${interviewId}/regenerate-tailored-resume`)
    return response.data
}