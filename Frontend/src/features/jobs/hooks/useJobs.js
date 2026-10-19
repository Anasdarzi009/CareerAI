import { useState, useEffect, useCallback } from 'react'
import {
    getJobs,
    getRecommendedJobs,
    getSavedJobs,
    getApplications,
    saveJob,
    unsaveJob
} from '../services/jobs.api'

export const useJobs = (initialTab = 'all') => {
    const [activeTab, setActiveTab] = useState(initialTab) // 'all' | 'recommended' | 'saved' | 'applications'
    const [jobs, setJobs] = useState([])
    const [recommendedJobs, setRecommendedJobs] = useState([])
    const [savedJobs, setSavedJobs] = useState([])
    const [applications, setApplications] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    // Filters
    const [search, setSearch] = useState('')
    const [workMode, setWorkMode] = useState('All')
    const [employmentType, setEmploymentType] = useState('All')
    const [eligibilityFilter, setEligibilityFilter] = useState('All') // 'All' | 'ELIGIBLE' | 'INELIGIBLE' | 'UNVERIFIED'
    const [sortBy, setSortBy] = useState('newest') // 'newest' | 'bestMatch' | 'deadline'

    const fetchJobs = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            if (activeTab === 'recommended') {
                const data = await getRecommendedJobs()
                setRecommendedJobs(data.jobs || [])
            } else if (activeTab === 'saved') {
                const data = await getSavedJobs()
                setSavedJobs(data.jobs || [])
            } else if (activeTab === 'applications') {
                const data = await getApplications()
                setApplications(data.applications || [])
            } else {
                const params = {
                    search: search.trim() || undefined,
                    workMode: workMode !== 'All' ? workMode : undefined,
                    employmentType: employmentType !== 'All' ? employmentType : undefined,
                    eligibility: eligibilityFilter !== 'All' ? eligibilityFilter : undefined,
                    sortBy
                }
                const data = await getJobs(params)
                setJobs(data.jobs || [])
            }
        } catch (err) {
            console.error('fetchJobs error:', err)
            setError(err.response?.data?.message || 'Failed to load opportunities')
        } finally {
            setLoading(false)
        }
    }, [activeTab, search, workMode, employmentType, eligibilityFilter, sortBy])

    useEffect(() => {
        fetchJobs()
    }, [fetchJobs])

    // Toggle save / bookmark
    const handleToggleSave = async (jobId, currentSaved) => {
        try {
            if (currentSaved) {
                await unsaveJob(jobId)
                setSuccessMessage('Opportunity removed from bookmarks')
            } else {
                await saveJob(jobId)
                setSuccessMessage('Opportunity bookmarked successfully')
            }

            // Update in-memory states
            const updater = list =>
                list.map(j => (j._id === jobId ? { ...j, isSaved: !currentSaved } : j))

            setJobs(updater)
            setRecommendedJobs(updater)
            setSavedJobs(prev =>
                currentSaved ? prev.filter(j => j._id !== jobId) : prev
            )

            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            console.error('handleToggleSave error:', err)
            setError('Failed to update bookmark')
        }
    }

    const resetFilters = () => {
        setSearch('')
        setWorkMode('All')
        setEmploymentType('All')
        setEligibilityFilter('All')
        setSortBy('newest')
    }

    return {
        activeTab,
        setActiveTab,
        jobs,
        recommendedJobs,
        savedJobs,
        applications,
        loading,
        error,
        successMessage,
        search,
        setSearch,
        workMode,
        setWorkMode,
        employmentType,
        setEmploymentType,
        eligibilityFilter,
        setEligibilityFilter,
        sortBy,
        setSortBy,
        fetchJobs,
        handleToggleSave,
        resetFilters
    }
}

export default useJobs
