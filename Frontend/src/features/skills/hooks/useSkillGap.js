import { useState, useEffect, useCallback } from 'react'
import { getSkillGap, analyzeSkillGap, updateSkillProgress } from '../services/skills.api'
import { getJobs } from '../../jobs/services/jobs.api'

export const useSkillGap = () => {
    const [analysis, setAnalysis] = useState(null)
    const [availableJobs, setAvailableJobs] = useState([])
    const [selectedJobId, setSelectedJobId] = useState('')
    const [loading, setLoading] = useState(true)
    const [reanalyzing, setReanalyzing] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Fetch available jobs for comparison dropdown
    useEffect(() => {
        let mounted = true
        getJobs()
            .then(data => {
                if (mounted) setAvailableJobs(data.jobs || [])
            })
            .catch(() => {})
        return () => { mounted = false }
    }, [])

    const fetchAnalysis = useCallback(async (jobId = null) => {
        setLoading(true)
        setError('')
        try {
            const data = await getSkillGap(jobId)
            if (data.status === 'PROFILE_INCOMPLETE') {
                setAnalysis({ status: 'PROFILE_INCOMPLETE', missingElements: data.missingElements || [] })
            } else {
                setAnalysis(data.analysis || null)
            }
        } catch (err) {
            console.error('fetchSkillGap error:', err)
            setError(err.response?.data?.message || 'Failed to load skill gap matrix')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAnalysis(selectedJobId || null)
    }, [fetchAnalysis, selectedJobId])

    const handleReanalyze = async (targetRole, jobId = null) => {
        setReanalyzing(true)
        setError('')
        setSuccessMessage('')
        try {
            const data = await analyzeSkillGap(targetRole, jobId)
            if (data.status === 'PROFILE_INCOMPLETE') {
                setAnalysis({ status: 'PROFILE_INCOMPLETE', missingElements: data.missingElements || [] })
            } else {
                setAnalysis(data.analysis)
                setSuccessMessage('Skill Gap Matrix recalculated successfully')
                setTimeout(() => setSuccessMessage(''), 3000)
            }
        } catch (err) {
            console.error('handleReanalyze error:', err)
            setError(err.response?.data?.message || 'Failed to analyze skill gaps')
        } finally {
            setReanalyzing(false)
        }
    }

    const handleProgressChange = async (skillName, progressState, addedToLearningPlan) => {
        try {
            const payload = {
                skillName,
                progressState,
                addedToLearningPlan,
                targetRole: analysis?.targetRole,
                jobId: analysis?.targetJob
            }
            const data = await updateSkillProgress(payload)

            // Optimistically update local analysis state
            if (analysis && analysis.skills) {
                const updatedSkills = analysis.skills.map(s =>
                    s.name.toLowerCase() === skillName.toLowerCase()
                        ? { ...s, progressState: progressState ?? s.progressState, addedToLearningPlan: addedToLearningPlan ?? s.addedToLearningPlan }
                        : s
                )
                setAnalysis({ ...analysis, skills: updatedSkills })
            }

            setSuccessMessage(`Progress updated for "${skillName}"`)
            setTimeout(() => setSuccessMessage(''), 2500)
            return data
        } catch (err) {
            console.error('handleProgressChange error:', err)
            setError('Failed to update skill learning progress')
        }
    }

    return {
        analysis,
        availableJobs,
        selectedJobId,
        setSelectedJobId,
        loading,
        reanalyzing,
        error,
        successMessage,
        fetchAnalysis,
        handleReanalyze,
        handleProgressChange
    }
}

export default useSkillGap
