const mongoose = require("mongoose")

let MongoMemoryServer = null
try {
    MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer
} catch (e) {
    // MongoMemoryServer is a devDependency not present in production builds
}

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
        console.log("Connected to Database successfully at Atlas")
    } catch (err) {
        console.warn("[Database Notice]: Could not reach MongoDB Atlas (" + err.message + ").")
        if (MongoMemoryServer) {
            console.warn("Falling back to resilient local In-Memory MongoDB...")
            const mongod = await MongoMemoryServer.create()
            const uri = mongod.getUri()
            await mongoose.connect(uri)
            console.log("Connected to Local In-Memory Database successfully at:", uri)
        } else {
            console.error("[Database Warning]: MongoMemoryServer devDependency is not installed in production environment. Ensure MONGO_URI is set correctly.")
            throw err
        }
    }

    try {
        const { seedJobsIfEmpty } = require("./seedJobs")
        await seedJobsIfEmpty()
    } catch (e) {
        console.warn("seedJobs error:", e.message)
    }

    try {
        const { seedCodingQuestionsIfEmpty } = require("./seedCodingQuestions")
        await seedCodingQuestionsIfEmpty()
    } catch (e) {
        console.warn("seedCoding error:", e.message)
    }

    try {
        const { seedAptitudeQuestionsIfEmpty } = require("./seedAptitudeQuestions")
        await seedAptitudeQuestionsIfEmpty()
    } catch (e) {
        console.warn("seedAptitude error:", e.message)
    }

    try {
        const { seedInterviewQuestionsIfEmpty } = require("./seedInterviewQuestions")
        await seedInterviewQuestionsIfEmpty()
    } catch (e) {
        console.warn("seedInterview error:", e.message)
    }
}

module.exports = connectToDB