/**
 * @name jobRecommendation.service.js
 * @description Tailored Job Recommendation Engine based on CandidateProfile.
 */

const { evaluateEligibility } = require("./eligibility.service")

function calculateJobMatch(job, profile) {
    const preferences = profile?.careerPreferences || {}
    const candidateSkills = (profile?.skills || []).map(s => (typeof s === "string" ? s : s.name).trim().toLowerCase())
    const targetRole = (preferences.targetRole || "").toLowerCase()
    const preferredWorkMode = (preferences.workMode || "").toLowerCase()
    const preferredLocation = (preferences.preferredLocation || "").toLowerCase()

    let score = 0
    let matchFactors = []

    // 1. Skill Overlap (up to 50 points)
    const requiredSkills = job.requiredSkills || []
    if (requiredSkills.length > 0) {
        let matchedCount = 0
        requiredSkills.forEach(req => {
            const reqLower = req.toLowerCase()
            if (candidateSkills.some(cs => cs === reqLower || cs.includes(reqLower) || reqLower.includes(cs))) {
                matchedCount++
            }
        })
        const skillScore = Math.round((matchedCount / requiredSkills.length) * 50)
        score += skillScore
        if (matchedCount > 0) {
            matchFactors.push(`${matchedCount} of ${requiredSkills.length} required skills matched`)
        }
    } else {
        score += 35
    }

    // 2. Target Role Similarity (up to 30 points)
    const jobTitleLower = job.title.toLowerCase()
    if (targetRole && (jobTitleLower.includes(targetRole) || targetRole.includes(jobTitleLower))) {
        score += 30
        matchFactors.push(`Matches your target role: "${preferences.targetRole}"`)
    } else if (targetRole) {
        const words = targetRole.split(/\s+/)
        const hasWordMatch = words.some(w => w.length > 2 && jobTitleLower.includes(w))
        if (hasWordMatch) {
            score += 15
            matchFactors.push("Role aligns with your target domain")
        }
    }

    // 3. Work Mode Compatibility (up to 10 points)
    if (preferredWorkMode && preferredWorkMode !== "any") {
        if (job.workMode.toLowerCase() === preferredWorkMode) {
            score += 10
            matchFactors.push(`Matches your preferred work mode (${job.workMode})`)
        }
    } else {
        score += 10
    }

    // 4. Location Compatibility (up to 10 points)
    if (preferredLocation) {
        if (job.location.toLowerCase().includes(preferredLocation) || job.workMode === "Remote") {
            score += 10
            matchFactors.push("Location / Remote option compatible")
        }
    } else {
        score += 10
    }

    // Evaluate mandatory eligibility
    const eligibility = evaluateEligibility(job, profile)

    return {
        matchScore: Math.min(100, Math.max(0, score)),
        matchFactors,
        eligibility
    }
}

function rankRecommendedJobs(jobs, profile) {
    const scoredJobs = jobs.map(job => {
        const { matchScore, matchFactors, eligibility } = calculateJobMatch(job, profile)
        return {
            job,
            matchScore,
            matchFactors,
            eligibility
        }
    })

    // Sort priority:
    // 1. ELIGIBLE first (highest match score)
    // 2. UNVERIFIED second (highest match score)
    // 3. INELIGIBLE last (even if high match, mandatory cutoff failed)
    scoredJobs.sort((a, b) => {
        const statusWeight = {
            "ELIGIBLE": 3,
            "UNVERIFIED": 2,
            "INELIGIBLE": 1
        }
        const weightDiff = (statusWeight[b.eligibility.status] || 0) - (statusWeight[a.eligibility.status] || 0)
        if (weightDiff !== 0) return weightDiff
        return b.matchScore - a.matchScore
    })

    return scoredJobs
}

module.exports = {
    calculateJobMatch,
    rankRecommendedJobs
}
