import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
    regenerateQuestions,
    getMasterResume,
    handleProjectRecommendationAction,
    regenerateTailoredResume
} from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const [ isRegenerating, setIsRegenerating ] = useState(false)
    const [ isRegeneratingResume, setIsRegeneratingResume ] = useState(false)
    const [ masterResume, setMasterResume ] = useState(null)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response.interviewReport
    }

    const handleRegenerateQuestions = async (targetId) => {
        const idToUse = targetId || interviewId
        if (!idToUse) return
        setIsRegenerating(true)
        try {
            const response = await regenerateQuestions(idToUse)
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
            }
            return response.interviewReport
        } catch (error) {
            console.log(error)
            throw error
        } finally {
            setIsRegenerating(false)
        }
    }

    const handleProjectAction = async (targetInterviewId, projectId, actionPayload) => {
        const idToUse = targetInterviewId || interviewId
        if (!idToUse) return
        try {
            const response = await handleProjectRecommendationAction(idToUse, projectId, actionPayload)
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
            }
            return response.interviewReport
        } catch (error) {
            console.error("Error executing project recommendation action:", error)
            throw error
        }
    }

    const handleRegenerateResume = async (targetInterviewId) => {
        const idToUse = targetInterviewId || interviewId
        if (!idToUse) return
        setIsRegeneratingResume(true)
        try {
            const response = await regenerateTailoredResume(idToUse)
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
            }
            return response.interviewReport
        } catch (error) {
            console.error("Error regenerating tailored resume:", error)
            throw error
        } finally {
            setIsRegeneratingResume(false)
        }
    }

    const fetchMasterResume = async () => {
        try {
            const data = await getMasterResume()
            if (data?.masterResume) {
                setMasterResume(data.masterResume)
            }
            return data?.masterResume
        } catch (e) {
            console.warn("Could not fetch master resume:", e.message)
        }
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            if (response && response.interviewReports) {
                setReports(response.interviewReports)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports || []
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const res = await generateResumePdf({ interviewReportId })
            const blob = res.data || res
            const disposition = res.headers?.["content-disposition"] || ""
            let fileName = ""
            if (disposition && disposition.includes("filename=")) {
                const match = disposition.match(/filename="?([^";]+)"?/)
                if (match && match[1]) fileName = match[1].trim()
            }

            const mime = blob.type || res.headers?.["content-type"] || "application/pdf"
            const isDocx = mime.includes("word") || mime.includes("officedocument") || fileName.endsWith(".docx")
            if (!fileName) {
                fileName = `tailored_resume_${interviewReportId}.${isDocx ? "docx" : "pdf"}`
            }

            const url = window.URL.createObjectURL(new Blob([ blob ], { type: mime }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", fileName)
            document.body.appendChild(link)
            link.click()
            setTimeout(() => {
                if (document.body.contains(link)) document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            }, 100)
        } catch (error) {
            console.error("Error downloading updated resume:", error)
            alert("Could not download tailored resume. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
            fetchMasterResume()
        }
    }, [ interviewId ])

    return {
        loading,
        report,
        reports,
        isRegenerating,
        isRegeneratingResume,
        masterResume,
        fetchMasterResume,
        generateReport,
        getReportById,
        getReports,
        getAllReports: getReports,
        getResumePdf,
        handleRegenerateQuestions,
        handleProjectAction,
        handleRegenerateResume
    }

}