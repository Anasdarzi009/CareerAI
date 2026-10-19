/**
 * @name eligibility.service.js
 * @description Centralized server-side Eligibility and Match Engine for CareerAI.
 * Evaluates candidate academic criteria and skills against job requirements.
 * Enforces strict mandatory academic cutoffs that cannot be bypassed by high skill scores.
 */

function evaluateEligibility(job, profile) {
    if (!job) {
        return {
            eligible: false,
            status: "UNKNOWN",
            statusMessage: "Job criteria not available",
            score: 0,
            requirements: [],
            matchedSkills: [],
            missingSkills: [],
            profileMissingFields: []
        }
    }

    const eligReq = job.eligibilityRequirements || {}
    const academics = profile?.academics || {}
    const candidateSkills = (profile?.skills || []).map(s => (typeof s === "string" ? s : s.name).trim().toLowerCase())

    const requirements = []
    const profileMissingFields = []
    let hasAcademicFailure = false
    let hasUnverifiedAcademic = false

    // ── 1. 10th / SSC Percentage Audit ──────────────────────────────────────
    if (eligReq.minSscPercentage !== null && eligReq.minSscPercentage !== undefined && eligReq.minSscPercentage > 0) {
        const reqSsc = Number(eligReq.minSscPercentage)
        const actualSsc = academics.ssc?.percentage

        if (actualSsc === null || actualSsc === undefined || actualSsc === "") {
            hasUnverifiedAcademic = true
            profileMissingFields.push("10th / SSC percentage")
            requirements.push({
                type: "10th / SSC",
                required: reqSsc,
                actual: null,
                passed: false,
                mandatory: true,
                status: "UNVERIFIED",
                message: `Required: ${reqSsc}% — Missing in profile`
            })
        } else {
            const actualNum = Number(actualSsc)
            const passed = actualNum >= reqSsc
            if (!passed) hasAcademicFailure = true

            requirements.push({
                type: "10th / SSC",
                required: reqSsc,
                actual: actualNum,
                passed,
                mandatory: true,
                status: passed ? "PASSED" : "FAILED",
                message: passed
                    ? `✓ ${actualNum}% / ${reqSsc}% required`
                    : `✕ ${actualNum}% / ${reqSsc}% required (Cutoff not met)`
            })
        }
    }

    // ── 2. 12th / HSC Percentage Audit ──────────────────────────────────────
    if (eligReq.minHscPercentage !== null && eligReq.minHscPercentage !== undefined && eligReq.minHscPercentage > 0) {
        const reqHsc = Number(eligReq.minHscPercentage)
        const actualHsc = academics.hsc?.percentage

        if (actualHsc === null || actualHsc === undefined || actualHsc === "") {
            hasUnverifiedAcademic = true
            profileMissingFields.push("12th / HSC percentage")
            requirements.push({
                type: "12th / HSC",
                required: reqHsc,
                actual: null,
                passed: false,
                mandatory: true,
                status: "UNVERIFIED",
                message: `Required: ${reqHsc}% — Missing in profile`
            })
        } else {
            const actualNum = Number(actualHsc)
            const passed = actualNum >= reqHsc
            if (!passed) hasAcademicFailure = true

            requirements.push({
                type: "12th / HSC",
                required: reqHsc,
                actual: actualNum,
                passed,
                mandatory: true,
                status: passed ? "PASSED" : "FAILED",
                message: passed
                    ? `✓ ${actualNum}% / ${reqHsc}% required`
                    : `✕ ${actualNum}% / ${reqHsc}% required (Cutoff not met)`
            })
        }
    }

    // ── 3. Undergraduate Degree CGPA / Percentage Audit ────────────────────
    if (eligReq.minUndergraduateCgpa !== null && eligReq.minUndergraduateCgpa !== undefined && eligReq.minUndergraduateCgpa > 0) {
        const reqCgpa = Number(eligReq.minUndergraduateCgpa)
        const actualUg = academics.undergraduate?.cgpaOrPercentage

        if (actualUg === null || actualUg === undefined || actualUg === "") {
            hasUnverifiedAcademic = true
            profileMissingFields.push("Undergraduate CGPA/Score")
            requirements.push({
                type: "Degree CGPA",
                required: reqCgpa,
                actual: null,
                passed: false,
                mandatory: true,
                status: "UNVERIFIED",
                message: `Required: ${reqCgpa} CGPA — Missing in profile`
            })
        } else {
            const actualNum = Number(actualUg)
            // If recorded as percentage (>10), compare normalized or direct if percentage required
            const isScale10 = actualNum <= 10
            let passed = false
            if (isScale10) {
                passed = actualNum >= reqCgpa
            } else {
                // Approximate conversion percentage to 10-scale: score / 9.5
                passed = actualNum >= reqCgpa * 9.5
            }

            if (!passed) hasAcademicFailure = true

            requirements.push({
                type: "Degree CGPA",
                required: reqCgpa,
                actual: actualNum,
                passed,
                mandatory: true,
                status: passed ? "PASSED" : "FAILED",
                message: passed
                    ? `✓ ${actualNum} / ${reqCgpa} required`
                    : `✕ ${actualNum} / ${reqCgpa} required (Cutoff not met)`
            })
        }
    }

    // ── 4. Technical Skills Evaluation ──────────────────────────────────────
    const requiredSkills = job.requiredSkills || []
    const matchedSkills = []
    const missingSkills = []

    requiredSkills.forEach(reqSkill => {
        const cleanReq = reqSkill.trim()
        const lowerReq = cleanReq.toLowerCase()
        const isMatched = candidateSkills.some(cs => cs === lowerReq || cs.includes(lowerReq) || lowerReq.includes(cs))

        if (isMatched) {
            matchedSkills.push(cleanReq)
        } else {
            missingSkills.push(cleanReq)
        }
    })

    const skillScore = requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 100

    // ── 5. Status & Eligibility Determination ──────────────────────────────
    let eligible = false
    let status = "ELIGIBLE"
    let statusMessage = "You meet the listed mandatory academic eligibility requirements."

    if (hasAcademicFailure) {
        // MANDATORY ACADEMIC REQUIREMENT FAILED: CANNOT BE OVERRIDDEN BY SKILLS
        eligible = false
        status = "INELIGIBLE"
        const failedReq = requirements.find(r => r.mandatory && !r.passed && r.status === "FAILED")
        statusMessage = failedReq
            ? `Your ${failedReq.type} does not meet the mandatory cutoff requirement.`
            : "One or more mandatory academic requirements are not met."
    } else if (hasUnverifiedAcademic) {
        // MISSING ACADEMIC INFORMATION: DO NOT FALSELY MARK INELIGIBLE
        eligible = null
        status = "UNVERIFIED"
        statusMessage = `Unable to verify eligibility — add your ${profileMissingFields.join(", ")} to Candidate Profile.`
    } else {
        eligible = true
        status = "ELIGIBLE"
        statusMessage = "You meet all listed mandatory eligibility criteria for this opportunity."
    }

    return {
        eligible,
        status, // "ELIGIBLE" | "INELIGIBLE" | "UNVERIFIED"
        statusMessage,
        matchScore: skillScore,
        requirements,
        matchedSkills,
        missingSkills,
        profileMissingFields
    }
}

module.exports = {
    evaluateEligibility
}
