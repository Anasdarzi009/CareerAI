import { useState, useEffect, useCallback, useMemo } from 'react'
import { getProfile, updateProfile, uploadResume, deleteResume } from '../services/profile.api'

export const useCandidateProfile = () => {
    const [profile, setProfile] = useState(null)
    const [userMeta, setUserMeta] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingResume, setUploadingResume] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const fetchProfile = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const data = await getProfile()
            setProfile(data.profile)
            if (data.user) setUserMeta(data.user)
        } catch (err) {
            console.error("fetchProfile error:", err)
            setError(err.response?.data?.message || "Failed to load candidate profile")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    const handleUpdate = async (updateData) => {
        setSaving(true)
        setError('')
        setSuccessMessage('')
        try {
            const data = await updateProfile(updateData)
            setProfile(data.profile)
            setSuccessMessage("Profile updated successfully")
            setTimeout(() => setSuccessMessage(''), 4000)
            return data.profile
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to update profile"
            setError(msg)
            throw err
        } finally {
            setSaving(false)
        }
    }

    const handleUploadResume = async (file) => {
        setUploadingResume(true)
        setError('')
        setSuccessMessage('')
        try {
            const data = await uploadResume(file)
            setProfile(data.profile)
            setSuccessMessage("Resume uploaded and parsed successfully")
            setTimeout(() => setSuccessMessage(''), 4000)
            return data.profile
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to upload resume"
            setError(msg)
            throw err
        } finally {
            setUploadingResume(false)
        }
    }

    const handleDeleteResume = async () => {
        setUploadingResume(true)
        setError('')
        setSuccessMessage('')
        try {
            const data = await deleteResume()
            setProfile(data.profile)
            setSuccessMessage("Resume removed successfully")
            setTimeout(() => setSuccessMessage(''), 4000)
            return data.profile
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to remove resume"
            setError(msg)
            throw err
        } finally {
            setUploadingResume(false)
        }
    }

    // Dynamic completeness calculation & tailored recommendations
    const completeness = useMemo(() => {
        if (!profile) return { score: 0, recommendation: { text: "Complete your profile", targetTab: "personal" } }

        let score = 0

        // 1. Avatar (5%)
        if (userMeta?.avatar || profile.user?.avatar) score += 5

        // 2. Personal Information (15%)
        const p = profile.personal || {}
        if (p.fullName && p.fullName.trim().length > 0) score += 5
        if (p.phoneNumber && p.phoneNumber.trim().length > 0) score += 5
        if (p.location && p.location.trim().length > 0) score += 5

        // 3. Resume (20%)
        const hasResume = !!profile.resume?.fileName
        if (hasResume) score += 20

        // 4. Academic Foundation (20%)
        const a = profile.academics || {}
        if (a.ssc?.percentage !== null && a.ssc?.percentage !== undefined && a.ssc?.percentage !== '') score += 5
        if (a.hsc?.percentage !== null && a.hsc?.percentage !== undefined && a.hsc?.percentage !== '') score += 5
        if (a.undergraduate?.degree && a.undergraduate?.cgpaOrPercentage) score += 10
        else if (a.undergraduate?.degree || a.undergraduate?.cgpaOrPercentage) score += 5

        // 5. Skills (15%)
        const skillsCount = profile.skills?.length || 0
        if (skillsCount >= 3) score += 15
        else score += skillsCount * 5

        // 6. Projects (10%)
        const projectsCount = profile.projects?.length || 0
        if (projectsCount >= 1) score += 10

        // 7. Experience (5%)
        const expCount = profile.experience?.length || 0
        const isFresher = profile.careerPreferences?.experienceLevel === 'Fresher'
        if (expCount >= 1 || isFresher) score += 5

        // 8. Career Preferences (10%)
        const cp = profile.careerPreferences || {}
        if (cp.targetRole && cp.targetRole.trim().length > 0) score += 5
        if (cp.workMode && cp.workMode.trim().length > 0) score += 5

        // Recommendation
        let recommendation = { text: "Add your personal information", targetTab: "personal" }
        if (!hasResume) {
            recommendation = { text: "Upload your resume (PDF/DOCX)", targetTab: "resume" }
        } else if (skillsCount < 3) {
            recommendation = { text: "Add at least 3 core technical skills", targetTab: "skills" }
        } else if (!a.undergraduate?.degree || !a.undergraduate?.cgpaOrPercentage) {
            recommendation = { text: "Add your undergraduate academic details", targetTab: "academics" }
        } else if (projectsCount < 1) {
            recommendation = { text: "Add your key projects and repositories", targetTab: "projects" }
        } else if (!cp.targetRole) {
            recommendation = { text: "Set your target role and work mode", targetTab: "preferences" }
        } else if (!p.phoneNumber || !p.location) {
            recommendation = { text: "Complete your contact details", targetTab: "personal" }
        } else if (expCount === 0 && !isFresher) {
            recommendation = { text: "Add your internship or professional experience", targetTab: "experience" }
        } else {
            recommendation = { text: "Profile is ready for placement evaluation", targetTab: "overview" }
        }

        return {
            score: Math.min(100, Math.max(0, score)),
            recommendation
        }
    }, [profile, userMeta])

    return {
        profile,
        userMeta,
        loading,
        saving,
        uploadingResume,
        error,
        successMessage,
        completeness,
        fetchProfile,
        handleUpdate,
        handleUploadResume,
        handleDeleteResume
    }
}

export default useCandidateProfile
