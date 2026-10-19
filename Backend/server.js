const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })
const app = require("./src/app")
const connectToDB = require("./src/config/database")

async function startServer() {
    const PORT = process.env.PORT || 3000
    const HOST = "0.0.0.0"
    app.listen(PORT, HOST, () => {
        console.log(`Server is running on port ${PORT} (${HOST})`)
    })

    connectToDB().catch(err => {
        console.warn("[Database Notice]: Running with resilient in-memory placement bank fallback.", err?.message || err)
    })
}

startServer()