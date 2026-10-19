/**
 * @name skillGap.service.js
 * @description Centralized server-side Skill Gap Analysis Engine for CareerAI.
 * Audits Candidate Profile, Resume text, Projects, and Experience against Target Role or Job.
 */

const jobModel = require("../models/job.model")
const interviewReportModel = require("../models/interviewReport.model")
const CodingSubmission = require("../models/codingSubmission.model")

// Standard Industry Competency Frameworks
const ROLE_SKILL_FRAMEWORKS = {
    "full stack": {
        roleName: "Full Stack Developer",
        required: [
            { name: "JavaScript", category: "Programming", priority: "HIGH", why: "Core foundation of modern full-stack web applications" },
            { name: "React", category: "Web Development", priority: "HIGH", why: "Industry-standard UI library for scalable client frontends" },
            { name: "Node.js", category: "Web Development", priority: "HIGH", why: "Primary runtime for non-blocking asynchronous backend servers" },
            { name: "SQL", category: "Databases", priority: "HIGH", why: "Essential relational data querying, transactions, and persistence" },
            { name: "HTML", category: "Web Development", priority: "HIGH", why: "Semantic structure and accessibility foundation for web clients" },
            { name: "CSS", category: "Web Development", priority: "HIGH", why: "Responsive layout design, modern grid/flexbox, and user interface styling" },
            { name: "Git", category: "Tools & Platforms", priority: "HIGH", why: "Distributed version control required across all engineering teams" },
            { name: "TypeScript", category: "Programming", priority: "MEDIUM", why: "Type-safe scalability for enterprise web codebases" },
            { name: "Express", category: "Web Development", priority: "MEDIUM", why: "Lightweight middleware framework for RESTful API services" },
            { name: "Docker", category: "Cloud & DevOps", priority: "MEDIUM", why: "Containerization standard for consistent local and production runtimes" },
            { name: "GitHub", category: "Tools & Platforms", priority: "MEDIUM", why: "Collaborative code review, pull requests, and CI/CD automation" },
            { name: "System Design", category: "Programming", priority: "MEDIUM", why: "Architecting scalable data flow, caching, and microservices" }
        ]
    },
    "backend": {
        roleName: "Backend Engineer",
        required: [
            { name: "Java", category: "Programming", priority: "HIGH", why: "Enterprise backbone for high-concurrency microservices" },
            { name: "SQL", category: "Databases", priority: "HIGH", why: "Relational database schema modeling, queries, and optimization" },
            { name: "Data Structures", category: "Programming", priority: "HIGH", why: "Algorithmic foundation for efficient computation and memory usage" },
            { name: "Algorithms", category: "Programming", priority: "HIGH", why: "Problem solving efficiency and scalable computational complexity" },
            { name: "System Design", category: "Programming", priority: "HIGH", why: "Distributed system patterns, load balancing, and fault tolerance" },
            { name: "Git", category: "Tools & Platforms", priority: "HIGH", why: "Standard version control system for collaborative repositories" },
            { name: "Docker", category: "Cloud & DevOps", priority: "MEDIUM", why: "Standard containerization for isolated microservice environments" },
            { name: "Python", category: "Programming", priority: "MEDIUM", why: "Scripting, asynchronous services, and rapid API prototyping" },
            { name: "Linux", category: "Tools & Platforms", priority: "MEDIUM", why: "Production server operating environment, shell, and process control" },
            { name: "Node.js", category: "Web Development", priority: "MEDIUM", why: "Event-driven, high-throughput I/O backend architecture" }
        ]
    },
    "frontend": {
        roleName: "Frontend Developer",
        required: [
            { name: "JavaScript", category: "Programming", priority: "HIGH", why: "The essential programming language of the modern web platform" },
            { name: "React", category: "Web Development", priority: "HIGH", why: "Dominant component-based library for reactive web apps" },
            { name: "HTML", category: "Web Development", priority: "HIGH", why: "Semantic document structuring, accessibility, and DOM rendering" },
            { name: "CSS", category: "Web Development", priority: "HIGH", why: "Responsive layout design, Flexbox, CSS Grid, and design systems" },
            { name: "Git", category: "Tools & Platforms", priority: "HIGH", why: "Team version control and source history tracking" },
            { name: "TypeScript", category: "Programming", priority: "MEDIUM", why: "Eliminates runtime type errors across complex client applications" },
            { name: "Next.js", category: "Web Development", priority: "MEDIUM", why: "Server-side rendering, routing, and modern full-stack frontend framework" },
            { name: "GitHub", category: "Tools & Platforms", priority: "MEDIUM", why: "Collaborative code reviews and CI deployment workflows" }
        ]
    },
    "data": {
        roleName: "Data Analyst / BI Engineer",
        required: [
            { name: "SQL", category: "Databases", priority: "HIGH", why: "Core language for querying relational databases and data warehouses" },
            { name: "Python", category: "Programming", priority: "HIGH", why: "Data manipulation, automated transformations, and statistical analysis" },
            { name: "Power BI", category: "Data & AI", priority: "HIGH", why: "Industry-standard business intelligence reporting and interactive dashboards" },
            { name: "Data Analytics", category: "Data & AI", priority: "HIGH", why: "Exploratory data analysis, KPI modeling, and business insight synthesis" },
            { name: "Excel", category: "Tools & Platforms", priority: "MEDIUM", why: "Ad-hoc financial modeling, pivot tables, and spreadsheet analytics" },
            { name: "Git", category: "Tools & Platforms", priority: "LOW", why: "Version control for analytical queries, notebooks, and pipelines" }
        ]
    },
    "devops": {
        roleName: "Cloud & DevOps Engineer",
        required: [
            { name: "Docker", category: "Cloud & DevOps", priority: "HIGH", why: "Containerization standard for consistent environment packaging" },
            { name: "Linux", category: "Tools & Platforms", priority: "HIGH", why: "Foundational operating system for cloud servers and clusters" },
            { name: "Git", category: "Tools & Platforms", priority: "HIGH", why: "GitOps and source control foundation for CI/CD pipelines" },
            { name: "GitHub", category: "Tools & Platforms", priority: "HIGH", why: "Automation through GitHub Actions and team pull request governance" },
            { name: "Python", category: "Programming", priority: "MEDIUM", why: "Infrastructure automation, API scripting, and operational tools" },
            { name: "Kubernetes", category: "Cloud & DevOps", priority: "MEDIUM", why: "Production container orchestration and cluster scaling" }
        ]
    },
    "ai": {
        roleName: "AI / Machine Learning Engineer",
        required: [
            { name: "Python", category: "Programming", priority: "HIGH", why: "Primary ecosystem for artificial intelligence and machine learning" },
            { name: "Machine Learning", category: "Data & AI", priority: "HIGH", why: "Supervised and unsupervised mathematical model architectures" },
            { name: "SQL", category: "Databases", priority: "HIGH", why: "Dataset extraction and data pipeline preparation" },
            { name: "Data Structures", category: "Programming", priority: "HIGH", why: "Computational complexity optimization for tensor pipelines" },
            { name: "Generative AI", category: "Data & AI", priority: "MEDIUM", why: "Modern LLMs, vector retrieval, and contextual prompt systems" },
            { name: "Git", category: "Tools & Platforms", priority: "MEDIUM", why: "Reproducible model experimentation and version control" }
        ]
    }
}

// Helper: infer category from skill name
function inferCategory(skillName) {
    const s = skillName.toLowerCase()
    if (["java", "python", "javascript", "typescript", "c++", "c#", "go", "ruby", "data structures", "algorithms", "system design"].includes(s)) {
        return "Programming"
    }
    if (["react", "node.js", "express", "html", "css", "next.js", "vue.js", "angular", "rest api", "graphql"].includes(s)) {
        return "Web Development"
    }
    if (["sql", "postgresql", "mongodb", "mysql", "redis", "database"].includes(s)) {
        return "Databases"
    }
    if (["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "terraform", "devops", "cloud"].includes(s)) {
        return "Cloud & DevOps"
    }
    if (["machine learning", "generative ai", "data analytics", "power bi", "tableau", "statistics", "deep learning", "ai"].includes(s)) {
        return "Data & AI"
    }
    if (["git", "github", "linux", "jira", "postman", "excel"].includes(s)) {
        return "Tools & Platforms"
    }
    return "Tools & Platforms"
}

// Helper: generate curriculum learning path for a missing skill
function generateLearningMilestones(skillName, priority) {
    const s = skillName.toLowerCase()
    if (s.includes("typescript")) {
        return {
            curriculum: "TypeScript Fundamentals → Interfaces & Types → Generics → React with TypeScript",
            action: "Complete TypeScript basic types, refactor 1 React component to TS, and build a typed API client."
        }
    }
    if (s.includes("docker")) {
        return {
            curriculum: "Container Concepts → Dockerfile Authoring → Image Optimization → Multi-container Docker Compose",
            action: "Containerize a Node/Python backend, configure a docker-compose.yml with DB, and test local runtime."
        }
    }
    if (s.includes("sql") || s.includes("database")) {
        return {
            curriculum: "Relational Modeling → Complex Joins → Window Functions → Indexing & Query Tuning",
            action: "Practice 15 intermediate SQL LeetCode problems and create an indexed multi-table schema."
        }
    }
    if (s.includes("react")) {
        return {
            curriculum: "Component Lifecycles → Custom Hooks → Context & State Management → Performance Optimization",
            action: "Build a responsive dashboard using custom hooks, consuming a public REST API."
        }
    }
    if (s.includes("node")) {
        return {
            curriculum: "Event Loop & Streams → Express Router → JWT Auth Middleware → Error Handling & Testing",
            action: "Construct an authenticated REST API with input validation and clean controller architecture."
        }
    }
    if (s.includes("java")) {
        return {
            curriculum: "OOP Principles → Collections Framework → Multithreading → Spring Boot Microservices",
            action: "Implement clean object-oriented domain models and practice core Java collections algorithms."
        }
    }
    if (s.includes("python")) {
        return {
            curriculum: "Python Idioms → Data Structures & Comprehensions → Virtual Environments → API & Scripting",
            action: "Write automated scripts for data transformation or build an asynchronous FastAPI service."
        }
    }
    if (s.includes("data structures") || s.includes("algorithms")) {
        return {
            curriculum: "Arrays & HashMaps → Linked Lists & Trees → Graphs & BFS/DFS → Dynamic Programming",
            action: "Solve 20 fundamental problem-solving challenges with clear time and space complexity audits."
        }
    }
    if (s.includes("system design")) {
        return {
            curriculum: "Client-Server Architecture → Database Sharding & Caching → Load Balancing → Message Queues",
            action: "Document a high-level design diagram for an e-commerce or URL shortener service."
        }
    }

    return {
        curriculum: `Foundations of ${skillName} → Core Patterns & Syntax → Practical Application → Project Integration`,
        action: `Complete introductory documentation for ${skillName}, build a focused proof-of-concept, and add it to your profile.`
    }
}

/**
 * @name analyzeSkillGaps
 * @description Central analysis function comparing candidate data against target requirements.
 */
async function analyzeSkillGaps(candidateProfile, options = {}) {
    const { targetRole: manualTargetRole, jobId } = options

    // Check if candidate profile has sufficient information
    const candidateSkillsList = candidateProfile?.skills || []
    const rawResumeText = (candidateProfile?.resume?.rawText || "").toLowerCase()
    const projects = candidateProfile?.projects || []
    const experiences = candidateProfile?.experience || []
    const careerTargetRole = candidateProfile?.careerPreferences?.targetRole || ""

    const effectiveTargetRole = manualTargetRole || careerTargetRole || "Full Stack Developer"

    // Profile incomplete detection
    if (candidateSkillsList.length === 0 && !rawResumeText && !careerTargetRole && !jobId) {
        return {
            status: "PROFILE_INCOMPLETE",
            message: "Complete your Candidate Profile to unlock your Skill Gap Matrix.",
            missingElements: ["Target Role", "Technical Skills", "Resume Document"],
            overallCoverage: 0,
            skills: [],
            learningRoadmap: []
        }
    }

    // 1. Resolve Target Required Skills
    let targetJob = null
    let requiredSkillsList = []
    let benchmarkTitle = effectiveTargetRole
    let targetCompany = ""

    if (jobId) {
        targetJob = await jobModel.findById(jobId)
        if (targetJob) {
            benchmarkTitle = targetJob.title
            targetCompany = targetJob.company
            const allJobSkills = [
                ...(targetJob.requiredSkills || []).map(name => ({
                    name,
                    category: inferCategory(name),
                    priority: "HIGH",
                    why: `Mandatory requirement for ${targetJob.title} at ${targetJob.company}`
                })),
                ...(targetJob.preferredSkills || []).map(name => ({
                    name,
                    category: inferCategory(name),
                    priority: "MEDIUM",
                    why: `Preferred asset for ${targetJob.title} at ${targetJob.company}`
                }))
            ]
            requiredSkillsList = allJobSkills
        }
    }

    // If no specific job or job has no skills, use role frameworks
    if (requiredSkillsList.length === 0) {
        const lowerRole = effectiveTargetRole.toLowerCase()
        let matchedFrameworkKey = Object.keys(ROLE_SKILL_FRAMEWORKS).find(key => lowerRole.includes(key))

        if (!matchedFrameworkKey) {
            matchedFrameworkKey = "full stack" // sensible default
        }

        const framework = ROLE_SKILL_FRAMEWORKS[matchedFrameworkKey]
        benchmarkTitle = framework.roleName
        requiredSkillsList = framework.required
    }

    // 2. Fetch historical interview reports & coding submission evidence for this user
    let interviewGapsMap = new Map()
    let codingSolvedMap = new Map()

    if (candidateProfile?.user) {
        try {
            const reports = await interviewReportModel.find({ user: candidateProfile.user }).select("skillGaps").limit(5)
            reports.forEach(r => {
                (r.skillGaps || []).forEach(g => {
                    interviewGapsMap.set(g.skill.toLowerCase(), g.severity)
                })
            })

            const codingSubmissions = await CodingSubmission.find({
                user: candidateProfile.user,
                status: "Accepted"
            }).populate("question", "topics title").limit(50)

            codingSubmissions.forEach(sub => {
                if (sub.question) {
                    (sub.question.topics || []).forEach(topic => {
                        const tLower = topic.toLowerCase()
                        if (!codingSolvedMap.has(tLower)) {
                            codingSolvedMap.set(tLower, { count: 0, sampleTitle: sub.question.title })
                        }
                        codingSolvedMap.get(tLower).count++
                    })
                }
            })
        } catch (e) {
            // Ignore optional lookups
        }
    }

    // 3. Evidence Evaluation Engine
    const normalizedProfileSkills = candidateSkillsList.map(s => ({
        name: (typeof s === "string" ? s : s.name).trim(),
        lower: (typeof s === "string" ? s : s.name).trim().toLowerCase(),
        category: typeof s === "object" ? s.category : "General"
    }))

    const evaluatedSkills = []
    let matchedCount = 0
    let weakCount = 0
    let gapCount = 0

    // Keep track of category stats
    const categoryStats = new Map()

    requiredSkillsList.forEach(req => {
        const reqName = req.name
        const reqLower = reqName.toLowerCase()
        const category = req.category || inferCategory(reqName)

        // Initialize category tracking
        if (!categoryStats.has(category)) {
            categoryStats.set(category, { totalRequired: 0, matchedCount: 0, weakCount: 0, gapCount: 0 })
        }
        categoryStats.get(category).totalRequired++

        const candidateEvidence = []

        // Evidence 1: Profile Skill
        const foundInProfile = normalizedProfileSkills.find(
            cs => cs.lower === reqLower || cs.lower.includes(reqLower) || reqLower.includes(cs.lower)
        )
        if (foundInProfile) {
            candidateEvidence.push({
                source: "profile_skill",
                detail: `Verified in candidate profile skills (${foundInProfile.name})`
            })
        }

        // Evidence 2: Project Evidence
        projects.forEach(p => {
            const pTechs = (p.technologies || []).map(t => t.toLowerCase())
            const inTech = pTechs.some(t => t === reqLower || t.includes(reqLower) || reqLower.includes(t))
            const inDesc = (p.description || "").toLowerCase().includes(reqLower)

            if (inTech || inDesc) {
                candidateEvidence.push({
                    source: "project",
                    detail: `Demonstrated in project: "${p.projectName}"`
                })
            }
        })

        // Evidence 3: Experience Evidence
        experiences.forEach(exp => {
            const inTitle = (exp.jobTitle || "").toLowerCase().includes(reqLower)
            const inDesc = (exp.description || "").toLowerCase().includes(reqLower)

            if (inTitle || inDesc) {
                candidateEvidence.push({
                    source: "experience",
                    detail: `Applied professionally at ${exp.company} (${exp.jobTitle})`
                })
            }
        })

        // Evidence 4: Raw Resume Mention
        let foundInResume = false
        if (rawResumeText && rawResumeText.includes(reqLower)) {
            foundInResume = true
            candidateEvidence.push({
                source: "resume_text",
                detail: "Referenced in uploaded resume document"
            })
        }

        // Evidence 5: Past Interview Report
        if (interviewGapsMap.has(reqLower)) {
            candidateEvidence.push({
                source: "interview_report",
                detail: `Flagged as a ${interviewGapsMap.get(reqLower)} gap in past interview strategy`
            })
        }

        // Evidence 6: Coding Round Performance
        if (codingSolvedMap.has(reqLower)) {
            const codingInfo = codingSolvedMap.get(reqLower)
            candidateEvidence.push({
                source: "coding_round",
                detail: `Demonstrated through ${codingInfo.count} accepted problem(s) in Coding Round ("${codingInfo.sampleTitle}")`
            })
        }

        // Determine Status
        let status = "MISSING"
        let evidenceStatus = "NO_EVIDENCE"
        let priority = req.priority || "MEDIUM"

        const hasSubstantialEvidence = candidateEvidence.some(
            e => e.source === "profile_skill" || e.source === "project" || e.source === "experience" || e.source === "coding_round"
        )

        if (hasSubstantialEvidence) {
            status = "MATCHED"
            evidenceStatus = "VERIFIED"
            matchedCount++
            categoryStats.get(category).matchedCount++
        } else if (foundInResume) {
            // Mentioned ONLY in resume text without projects/experiences
            status = "WEAK_EVIDENCE"
            evidenceStatus = "PARTIAL_EVIDENCE"
            weakCount++
            categoryStats.get(category).weakCount++
            if (priority === "LOW") priority = "MEDIUM"
        } else {
            // Missing completely
            status = "MISSING"
            evidenceStatus = "NO_EVIDENCE"
            gapCount++
            categoryStats.get(category).gapCount++
            // Keep or elevate priority if core
            if (req.priority === "HIGH") priority = "HIGH"
        }

        const milestone = generateLearningMilestones(reqName, priority)

        evaluatedSkills.push({
            name: reqName,
            category,
            status,
            priority,
            whyItMatters: req.why || `Key competency for ${benchmarkTitle}`,
            evidenceStatus,
            candidateEvidence,
            learningAction: milestone.action,
            curriculum: milestone.curriculum,
            progressState: status === "MATCHED" ? "Completed" : "Not Started",
            addedToLearningPlan: false
        })
    })

    // 4. Overall Skill Coverage Calculation
    const totalRequired = requiredSkillsList.length
    const coverageScore = totalRequired > 0
        ? Math.round(((matchedCount * 1.0) + (weakCount * 0.5)) / totalRequired * 100)
        : 0

    // 5. Generate Prioritized Learning Roadmap
    const missingOrWeak = evaluatedSkills
        .filter(s => s.status !== "MATCHED")
        .sort((a, b) => {
            const pWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 }
            return (pWeight[b.priority] || 1) - (pWeight[a.priority] || 1)
        })

    const learningRoadmap = missingOrWeak.map((item, idx) => ({
        step: idx + 1,
        skill: item.name,
        priority: item.priority,
        curriculum: item.curriculum,
        action: item.learningAction
    }))

    // Format category summaries
    const categorySummaries = Array.from(categoryStats.entries()).map(([categoryName, counts]) => ({
        categoryName,
        totalRequired: counts.totalRequired,
        matchedCount: counts.matchedCount,
        weakCount: counts.weakCount,
        gapCount: counts.gapCount
    }))

    return {
        status: "SUCCESS",
        targetRole: benchmarkTitle,
        targetJob: targetJob ? targetJob._id : null,
        targetJobTitle: targetJob ? targetJob.title : "",
        targetCompany: targetCompany,
        overallCoverage: Math.min(100, Math.max(0, coverageScore)),
        totalRequiredSkills: totalRequired,
        matchedSkillsCount: matchedCount,
        weakSkillsCount: weakCount,
        gapSkillsCount: gapCount,
        categorySummaries,
        skills: evaluatedSkills,
        learningRoadmap,
        analyzedAt: new Date()
    }
}

module.exports = {
    analyzeSkillGaps,
    ROLE_SKILL_FRAMEWORKS
}
