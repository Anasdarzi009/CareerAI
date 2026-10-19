const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const path = require("path")

const app = express()

// Trust reverse proxy (e.g. Render, Cloudflare) for secure cookies
app.set("trust proxy", 1)

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
]

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""))
}
if (process.env.ALLOWED_ORIGINS) {
    const extra = process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim().replace(/\/$/, ""))
    allowedOrigins.push(...extra)
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || /\.vercel\.app$/.test(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`))
        }
    },
    credentials: true
}))

// Healthcheck endpoints for hosting providers
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

app.get("/", (req, res) => {
    res.status(200).json({ name: "CareerAI API", status: "running" })
})

/* Serve uploads statically */
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const profileRouter = require("./routes/profile.routes")
const jobRouter = require("./routes/job.routes")
const skillRouter = require("./routes/skillGap.routes")
const roadmapRouter = require("./routes/careerRoadmap.routes")
const placementRouter = require("./routes/placementReadiness.routes")
const codingRouter = require("./routes/coding.routes")
const drivesRouter = require("./routes/placementDrive.routes")
const analyticsRouter = require("./routes/placementAnalytics.routes")
const aptitudeRouter = require("./routes/aptitude.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/profile", profileRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/skills", skillRouter)
app.use("/api/roadmap", roadmapRouter)
app.use("/api/placement", placementRouter)
app.use("/api/coding", codingRouter)
app.use("/api/aptitude", aptitudeRouter)
app.use("/api/drives", drivesRouter)
app.use("/api/analytics", analyticsRouter)



module.exports = app