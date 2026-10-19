const jobModel = require("../models/job.model")

const SEED_JOBS = [
    {
        title: "Software Development Engineer - Backend (SDE-1)",
        company: "Google Cloud Ecosystem",
        location: "Bengaluru / Hyderabad, India",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceRequired: "0 - 2 years",
        minExperienceYears: 0,
        salaryRange: "₹18 - ₹24 LPA",
        description: "Google Cloud Engineering is seeking early-career Software Engineers to build distributed backend services, high-throughput APIs, and scalable infrastructure. You will collaborate with global teams solving high-concurrency cloud challenges.",
        responsibilities: [
            "Design, implement, and maintain robust microservices using Java, Go, or Python.",
            "Build fault-tolerant REST and gRPC interfaces for cloud platform components.",
            "Write comprehensive unit and integration test suites with high code coverage.",
            "Participate in code reviews, design documentation, and production incident audits."
        ],
        requiredSkills: ["Java", "SQL", "Data Structures", "Algorithms", "System Design"],
        preferredSkills: ["Kubernetes", "Docker", "GCP", "Spring Boot"],
        educationRequirements: "B.Tech / B.E. / M.Tech in Computer Science, IT, or related technical disciplines.",
        eligibilityRequirements: {
            minSscPercentage: 75,
            minHscPercentage: 75,
            minUndergraduateCgpa: 7.5,
            allowedStreams: ["Computer Science", "Information Technology", "Circuital"],
            allowedPassingYears: [2024, 2025, 2026],
            additionalCriteria: "No active backlogs at the time of onboarding."
        },
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applicationUrl: "https://careers.google.com",
        source: "CareerAI Placement Cell (Campus Partner)",
        sourceJobId: "GOOG-SDE1-2025",
        isSample: true,
        sampleLabel: "Demo Opportunity (Placement Partner)",
        status: "Active"
    },
    {
        title: "Full Stack Developer (React & Node.js)",
        company: "Atlassian Systems",
        location: "Bengaluru, India",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceRequired: "0 - 2 years",
        minExperienceYears: 0,
        salaryRange: "₹15 - ₹20 LPA",
        description: "Join the collaborative product engineering group at Atlassian. You will architect responsive, accessible web applications and build resilient Node.js backends powering millions of team workflows.",
        responsibilities: [
            "Develop modern, accessible front-end interfaces with React, TypeScript, and standard CSS.",
            "Build and optimize backend services with Node.js, Express, and PostgreSQL.",
            "Participate in cross-functional agile sprints with designers, PMs, and QA engineers.",
            "Ensure low-latency client performance and clean architectural separation."
        ],
        requiredSkills: ["React", "JavaScript", "Node.js", "Express", "HTML", "CSS", "SQL"],
        preferredSkills: ["TypeScript", "GraphQL", "AWS", "Jest"],
        educationRequirements: "B.E. / B.Tech / BCA / MCA in any branch with strong computing foundation.",
        eligibilityRequirements: {
            minSscPercentage: 70,
            minHscPercentage: 70,
            minUndergraduateCgpa: 7.0,
            allowedStreams: ["Any"],
            allowedPassingYears: [2024, 2025, 2026]
        },
        applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        applicationUrl: "https://www.atlassian.com/company/careers",
        source: "CareerAI Placement Cell (Campus Partner)",
        sourceJobId: "ATLAS-FSD-04",
        isSample: true,
        sampleLabel: "Demo Opportunity (Placement Partner)",
        status: "Active"
    },
    {
        title: "Associate Software Engineer",
        company: "Microsoft Technologies",
        location: "Hyderabad, India",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceRequired: "Fresher / 0 - 1 year",
        minExperienceYears: 0,
        salaryRange: "₹16 - ₹22 LPA",
        description: "Microsoft is looking for motivated fresh engineering graduates passionate about cloud software, developer tooling, and modern enterprise software systems.",
        responsibilities: [
            "Develop features for enterprise cloud software across the Azure ecosystem.",
            "Collaborate with senior engineers to diagnose and resolve performance bottlenecks.",
            "Produce clear design documentation and contribute to open-source developer tooling.",
            "Implement automated testing and continuous integration workflows."
        ],
        requiredSkills: ["C++", "Python", "Data Structures", "Algorithms", "Git"],
        preferredSkills: ["Azure", "Docker", "Linux", "C#"],
        educationRequirements: "B.Tech / B.E. in CS / IT / Electronics.",
        eligibilityRequirements: {
            minSscPercentage: 70,
            minHscPercentage: 70,
            minUndergraduateCgpa: 7.5,
            allowedStreams: ["Computer Science", "Information Technology", "ECE"],
            allowedPassingYears: [2024, 2025, 2026]
        },
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        applicationUrl: "https://careers.microsoft.com",
        source: "CareerAI Placement Cell (Campus Partner)",
        sourceJobId: "MSFT-ASE-91",
        isSample: true,
        sampleLabel: "Demo Opportunity (Placement Partner)",
        status: "Active"
    },
    {
        title: "Frontend Engineering Intern",
        company: "Swiggy Consumer Tech",
        location: "Bengaluru, India",
        workMode: "On-site",
        employmentType: "Internship",
        experienceRequired: "Fresher",
        minExperienceYears: 0,
        salaryRange: "₹45,000 / month Stipend",
        description: "Looking for an enthusiastic Frontend Intern to craft fluid consumer experiences for millions of daily active users on Swiggy's food and quick-commerce web platforms.",
        responsibilities: [
            "Build responsive and high-performance user interfaces using React and modern CSS.",
            "Optimize rendering lifecycles, network payloads, and asset delivery.",
            "Work alongside UX designers to implement polished interactive micro-animations.",
            "Collaborate with backend teams to integrate RESTful API endpoints."
        ],
        requiredSkills: ["React", "JavaScript", "HTML", "CSS", "Git"],
        preferredSkills: ["Redux", "Webpack", "Vite", "Next.js"],
        educationRequirements: "Pursuing or recently completed Bachelor's degree in any discipline.",
        eligibilityRequirements: {
            minSscPercentage: 60,
            minHscPercentage: 60,
            minUndergraduateCgpa: 6.5,
            allowedStreams: ["Any"],
            allowedPassingYears: [2025, 2026, 2027]
        },
        applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        applicationUrl: "https://careers.swiggy.com",
        source: "CareerAI Placement Cell (Campus Partner)",
        sourceJobId: "SWIG-INT-02",
        isSample: true,
        sampleLabel: "Demo Opportunity (Placement Partner)",
        status: "Active"
    },
    {
        title: "Junior Data Analyst / BI Engineer",
        company: "Deloitte Digital",
        location: "Mumbai / Gurugram, India",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceRequired: "0 - 1 year",
        minExperienceYears: 0,
        salaryRange: "₹8 - ₹11 LPA",
        description: "Deloitte is seeking early-career Data Analysts to extract actionable business intelligence from complex corporate data pipelines and build executive dashboards.",
        responsibilities: [
            "Write complex SQL queries, window functions, and data transformations.",
            "Design intuitive Power BI and Tableau dashboards for enterprise decision makers.",
            "Perform statistical analysis, data validation, and exploratory data reporting.",
            "Collaborate with stakeholders to identify critical business metrics and KPIs."
        ],
        requiredSkills: ["SQL", "Power BI", "Data Analytics", "Python"],
        preferredSkills: ["Excel", "Tableau", "ETL", "Statistics"],
        educationRequirements: "B.Tech / B.E. / B.Sc / B.Com with quantitative / computing aptitude.",
        eligibilityRequirements: {
            minSscPercentage: 65,
            minHscPercentage: 65,
            minUndergraduateCgpa: 6.8,
            allowedStreams: ["Any"],
            allowedPassingYears: [2024, 2025, 2026]
        },
        applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        applicationUrl: "https://www2.deloitte.com/careers",
        source: "CareerAI Placement Cell (Campus Partner)",
        sourceJobId: "DELOITTE-DA-10",
        isSample: true,
        sampleLabel: "Demo Opportunity (Placement Partner)",
        status: "Active"
    },
    {
        title: "Cloud & DevOps Engineer (Early Career)",
        company: "Persistent Systems",
        location: "Pune, India",
        workMode: "Hybrid",
        employmentType: "Full-time",
        experienceRequired: "0 - 2 years",
        minExperienceYears: 0,
        salaryRange: "₹7.5 - ₹10.5 LPA",
        description: "Persistent Systems is hiring Cloud and DevOps Engineers to manage continuous integration pipelines, containerized deployments, and cloud infrastructure.",
        responsibilities: [
            "Implement CI/CD automation pipelines using GitHub Actions and Jenkins.",
            "Containerize backend services using Docker and orchestrate on Kubernetes.",
            "Monitor cloud environments for availability, latency, and resource utilization.",
            "Automate infrastructure provisioning using Terraform scripts."
        ],
        requiredSkills: ["Docker", "GitHub", "Linux", "Git", "Python"],
        preferredSkills: ["Kubernetes", "AWS", "Terraform", "Bash"],
        educationRequirements: "B.Tech / B.E. / MCA in Computer Science, IT, or Electronics.",
        eligibilityRequirements: {
            minSscPercentage: 60,
            minHscPercentage: 60,
            minUndergraduateCgpa: 6.5,
            allowedStreams: ["Computer Science", "IT", "ECE"],
            allowedPassingYears: [2024, 2025, 2026]
        },
        applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        applicationUrl: "https://www.persistent.com/careers",
        source: "CareerAI Placement Cell (Campus Partner)",
        sourceJobId: "PERS-DEVOPS-77",
        isSample: true,
        sampleLabel: "Demo Opportunity (Placement Partner)",
        status: "Active"
    },
    {
        title: "AI / Machine Learning Engineer (Graduate)",
        company: "Zomato AI Labs",
        location: "Gurugram, India",
        workMode: "On-site",
        employmentType: "Full-time",
        experienceRequired: "0 - 1 year",
        minExperienceYears: 0,
        salaryRange: "₹14 - ₹19 LPA",
        description: "Join Zomato's AI research lab to build recommendation engines, dynamic dispatch algorithms, and generative AI features for customer discovery.",
        responsibilities: [
            "Train, evaluate, and deploy machine learning models on real-time streaming data.",
            "Develop data preprocessing pipelines for multimodal and tabular features.",
            "Integrate generative AI LLM models and vector embeddings into search workflows.",
            "Conduct experimental A/B testing on recommendation accuracy and latency."
        ],
        requiredSkills: ["Python", "Machine Learning", "Generative AI", "SQL"],
        preferredSkills: ["PyTorch", "TensorFlow", "Pandas", "Scikit-Learn"],
        educationRequirements: "B.Tech / M.Tech in CS / AI / Data Science or equivalent.",
        eligibilityRequirements: {
            minSscPercentage: 75,
            minHscPercentage: 75,
            minUndergraduateCgpa: 8.0,
            allowedStreams: ["Computer Science", "AI & ML", "Data Science"],
            allowedPassingYears: [2024, 2025, 2026]
        },
        applicationDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        applicationUrl: "https://www.zomato.com/careers",
        source: "CareerAI Placement Cell (Campus Partner)",
        sourceJobId: "ZOM-AI-01",
        isSample: true,
        sampleLabel: "Demo Opportunity (Placement Partner)",
        status: "Active"
    },
    {
        title: "Remote Full Stack Engineer",
        company: "GitLab Remote Team",
        location: "Remote (All India)",
        workMode: "Remote",
        employmentType: "Full-time",
        experienceRequired: "1 - 3 years",
        minExperienceYears: 1,
        salaryRange: "₹20 - ₹28 LPA",
        description: "100% remote software engineering role building open-source DevOps and collaboration features for millions of engineers globally.",
        responsibilities: [
            "Contribute to distributed, asynchronous development across GitLab's core platform.",
            "Write scalable backend logic in Ruby on Rails and modern reactive frontends.",
            "Document architectural decisions publicly in handbook-first culture.",
            "Review merge requests from the global open-source community."
        ],
        requiredSkills: ["JavaScript", "SQL", "Git", "Docker"],
        preferredSkills: ["Ruby", "Vue.js", "PostgreSQL", "Go"],
        educationRequirements: "Any technical Bachelor's degree or demonstrated open-source portfolio.",
        eligibilityRequirements: {
            minSscPercentage: 60,
            minHscPercentage: 60,
            minUndergraduateCgpa: 6.0,
            allowedStreams: ["Any"],
            allowedPassingYears: [2023, 2024, 2025, 2026]
        },
        applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        applicationUrl: "https://about.gitlab.com/jobs",
        source: "CareerAI Placement Cell (Campus Partner)",
        sourceJobId: "GITLAB-REMOTE-99",
        isSample: true,
        sampleLabel: "Demo Opportunity (Placement Partner)",
        status: "Active"
    }
]

async function seedJobsIfEmpty() {
    try {
        const count = await jobModel.countDocuments()
        if (count === 0) {
            console.log("No jobs found in database. Seeding controlled demo opportunities...")
            await jobModel.insertMany(SEED_JOBS)
            console.log(`Successfully seeded ${SEED_JOBS.length} controlled placement opportunities.`)
        }
    } catch (err) {
        console.error("seedJobsIfEmpty error:", err)
    }
}

module.exports = {
    SEED_JOBS,
    seedJobsIfEmpty
}
