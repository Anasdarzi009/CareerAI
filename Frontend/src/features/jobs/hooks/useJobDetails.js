import { useState, useEffect, useCallback } from 'react'
import { getJobById, saveJob, unsaveJob, applyJob } from '../services/jobs.api'

export const useJobDetails = (jobId) => {
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const fetchDetails = useCallback(async () => {
        if (!jobId) return
        setLoading(true)
        setError('')
        try {
            const data = await getJobById(jobId)
            setJob(data.job)
        } catch (err) {
            console.error('fetchDetails error:', err)
            setError(err.response?.data?.message || 'Failed to load job details')
        } finally {
            setLoading(false)
        }
    }, [jobId])

    useEffect(() => {
        fetchDetails()
    }, [fetchDetails])

    const handleToggleSave = async () => {
        if (!job) return
        setActionLoading(true)
        try {
            if (job.isSaved) {
                await unsaveJob(job._id)
                setJob(prev => ({ ...prev, isSaved: false }))
                setSuccessMessage('Job removed from saved bookmarks')
            } else {
                await saveJob(job._id)
                setJob(prev => ({ ...prev, isSaved: true }))
                setSuccessMessage('Job saved to your bookmarks')
            }
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            console.error('handleToggleSave error:', err)
            setError('Failed to update bookmark')
        } finally {
            setActionLoading(false)
        }
    }

    const handleApply = async (status = 'Applied', notes = '') => {
        if (!job) return
        setActionLoading(true)
        try {
            const data = await applyJob(job._id, { status, notes })
            setJob(prev => ({
                ...prev,
                application: data.application
            }))
            setSuccessMessage(`Application recorded as "${status}"`)
            setTimeout(() => setSuccessMessage(''), 4000)
            return data.application
        } catch (err) {
            console.error('handleApply error:', err)
            setError(err.response?.data?.message || 'Failed to submit application')
            throw err
        } finally {
            setActionLoading(false)
        }
    }

    return {
        job,
        loading,
        error,
        actionLoading,
        successMessage,
        fetchDetails,
        handleToggleSave,
        handleApply
    }
}

export default useJobDetails
