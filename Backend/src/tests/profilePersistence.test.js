const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const candidateProfileModel = require("../models/candidateProfile.model")
const userModel = require("../models/user.model")
const profileController = require("../controllers/profile.controller")

async function runTests() {
    console.log("Starting comprehensive profile persistence test suite...")
    let mongod = null

    try {
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await mongoose.connect(uri)
        console.log("✓ Connected to in-memory MongoDB instance")

        // Create test user
        const testUser = await userModel.create({
            username: "anas_tester",
            email: "anas@careerai.test",
            password: "hashedpassword123"
        })
        const userId = testUser._id.toString()
        console.log("✓ Created test user with ID:", userId)

        // Mock response helper
        const createMockRes = () => {
            const res = {}
            res.statusCode = 200
            res.status = (code) => {
                res.statusCode = code
                return res
            }
            res.json = (data) => {
                res.body = data
                return res
            }
            return res
        }

        // Test 1: getProfileController creates default profile if none exists
        console.log("\n--- Test 1: getProfileController Initial Fetch ---")
        {
            const req = { user: { id: userId } }
            const res = createMockRes()
            await profileController.getProfileController(req, res)

            if (res.statusCode !== 200) throw new Error(`Test 1 Failed: status ${res.statusCode}`)
            if (!res.body.profile) throw new Error("Test 1 Failed: no profile in body")
            if (res.body.profile.personal.fullName !== "anas_tester") {
                throw new Error(`Test 1 Failed: expected fullName 'anas_tester', got '${res.body.profile.personal.fullName}'`)
            }
            console.log("✓ Test 1 Passed: Default profile created with username")
        }

        // Test 2: Save Personal Details using canonical payload
        console.log("\n--- Test 2: Save Personal Details (Canonical Payload) ---")
        {
            const req = {
                user: { id: userId },
                body: {
                    personal: {
                        fullName: "Anas Darzi",
                        phoneNumber: "+91 98765 43210",
                        location: "Mumbai, Maharashtra",
                        headline: "Full Stack Engineer & Cloud Architect"
                    }
                }
            }
            const res = createMockRes()
            await profileController.updateProfileController(req, res)

            if (res.statusCode !== 200) throw new Error(`Test 2 Failed: status ${res.statusCode}`)
            const saved = res.body.profile.personal
            if (saved.phoneNumber !== "+91 98765 43210" || saved.location !== "Mumbai, Maharashtra" || saved.headline !== "Full Stack Engineer & Cloud Architect") {
                throw new Error(`Test 2 Failed: data mismatch ${JSON.stringify(saved)}`)
            }

            // Direct MongoDB persistence check
            const fromDb = await candidateProfileModel.findOne({ user: userId })
            if (fromDb.personal.phoneNumber !== "+91 98765 43210" || fromDb.personal.location !== "Mumbai, Maharashtra") {
                throw new Error("Test 2 Failed: MongoDB did not persist fields")
            }
            console.log("✓ Test 2 Passed: Canonical personal details saved and persisted in MongoDB")
        }

        // Test 3: Save Personal Details with Double Nested Payload (the exact production bug)
        console.log("\n--- Test 3: Save Personal Details (Double Nested Payload Root Cause) ---")
        {
            const req = {
                user: { id: userId },
                body: {
                    personal: {
                        personal: {
                            fullName: "Anas Darzi Updated",
                            phoneNumber: "+91 99999 88888",
                            location: "Bengaluru, India",
                            headline: "Senior AI Engineer"
                        }
                    }
                }
            }
            const res = createMockRes()
            await profileController.updateProfileController(req, res)

            if (res.statusCode !== 200) throw new Error(`Test 3 Failed: status ${res.statusCode}`)
            const saved = res.body.profile.personal
            if (saved.phoneNumber !== "+91 99999 88888" || saved.location !== "Bengaluru, India" || saved.headline !== "Senior AI Engineer") {
                throw new Error(`Test 3 Failed: double nested payload was stripped! ${JSON.stringify(saved)}`)
            }

            // Direct DB check
            const fromDb = await candidateProfileModel.findOne({ user: userId })
            if (fromDb.personal.phoneNumber !== "+91 99999 88888" || fromDb.personal.location !== "Bengaluru, India") {
                throw new Error("Test 3 Failed: MongoDB did not persist double nested fields")
            }
            console.log("✓ Test 3 Passed: Double-nested payload safely unwrapped and persisted in MongoDB")
        }

        // Test 4: Re-fetching profile (simulating page refresh / re-login)
        console.log("\n--- Test 4: Re-fetching Profile (Page Refresh / Re-login) ---")
        {
            const req = { user: { id: userId } }
            const res = createMockRes()
            await profileController.getProfileController(req, res)

            if (res.statusCode !== 200) throw new Error(`Test 4 Failed: status ${res.statusCode}`)
            const loaded = res.body.profile.personal
            if (loaded.phoneNumber !== "+91 99999 88888" || loaded.location !== "Bengaluru, India" || loaded.headline !== "Senior AI Engineer") {
                throw new Error(`Test 4 Failed: reloaded profile lost data: ${JSON.stringify(loaded)}`)
            }
            console.log("✓ Test 4 Passed: Re-fetched profile maintains all personal details")
        }

        // Test 5: Save Academic Background (Canonical and Double-Nested)
        console.log("\n--- Test 5: Save Academic Details (Double-Nested and Persistence) ---")
        {
            const req = {
                user: { id: userId },
                body: {
                    academics: {
                        academics: {
                            ssc: { percentage: 89.5, passingYear: 2018, board: "CBSE" },
                            hsc: { percentage: 85.2, passingYear: 2020, stream: "Science", board: "Maharashtra State Board" },
                            undergraduate: {
                                degree: "B.Tech",
                                branch: "Computer Engineering",
                                college: "VJTI Mumbai",
                                cgpaOrPercentage: 8.92,
                                passingYear: 2024
                            }
                        }
                    }
                }
            }
            const res = createMockRes()
            await profileController.updateProfileController(req, res)

            if (res.statusCode !== 200) throw new Error(`Test 5 Failed: status ${res.statusCode}`)
            const academics = res.body.profile.academics
            if (academics.ssc.percentage !== 89.5 || academics.undergraduate.cgpaOrPercentage !== 8.92) {
                throw new Error(`Test 5 Failed: academic fields not saved: ${JSON.stringify(academics)}`)
            }

            const fromDb = await candidateProfileModel.findOne({ user: userId })
            if (fromDb.academics.ssc.percentage !== 89.5 || fromDb.academics.undergraduate.cgpaOrPercentage !== 8.92) {
                throw new Error("Test 5 Failed: MongoDB did not persist academics")
            }
            // Ensure personal details were NOT wiped by saving academics
            if (fromDb.personal.phoneNumber !== "+91 99999 88888") {
                throw new Error("Test 5 Failed: Personal details were wiped when saving academics!")
            }
            console.log("✓ Test 5 Passed: Academic details persisted without wiping personal details")
        }

        // Test 6: Save Skills and Experience
        console.log("\n--- Test 6: Save Skills & Experience (Wrapped payloads) ---")
        {
            const req = {
                user: { id: userId },
                body: {
                    skills: {
                        skills: [
                            { name: "React", category: "Web" },
                            { name: "Node.js", category: "Web" },
                            { name: "Python", category: "Programming" }
                        ]
                    },
                    experience: {
                        experience: [
                            {
                                jobTitle: "Software Development Intern",
                                company: "TechCorp Labs",
                                employmentType: "Internship",
                                startDate: "2023-06",
                                endDate: "2023-12",
                                currentlyWorking: false,
                                description: "Built microservices and optimized database queries."
                            }
                        ]
                    }
                }
            }
            const res = createMockRes()
            await profileController.updateProfileController(req, res)

            if (res.statusCode !== 200) throw new Error(`Test 6 Failed: status ${res.statusCode}`)
            if (res.body.profile.skills.length !== 3 || res.body.profile.experience.length !== 1) {
                throw new Error("Test 6 Failed: skills or experience count mismatch")
            }

            const fromDb = await candidateProfileModel.findOne({ user: userId })
            if (fromDb.skills.length !== 3 || fromDb.experience.length !== 1) {
                throw new Error("Test 6 Failed: MongoDB did not persist skills/experience")
            }
            console.log("✓ Test 6 Passed: Skills and experience saved and persisted in MongoDB")
        }

        // Test 7: Validation bounds check
        console.log("\n--- Test 7: Academic validation bounds ---")
        {
            const req = {
                user: { id: userId },
                body: {
                    academics: {
                        ssc: { percentage: 150 } // Invalid > 100
                    }
                }
            }
            const res = createMockRes()
            await profileController.updateProfileController(req, res)

            if (res.statusCode !== 400) throw new Error(`Test 7 Failed: expected 400 for invalid percentage, got ${res.statusCode}`)
            console.log("✓ Test 7 Passed: Invalid percentages rejected with 400 status")
        }

        console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! No data loss, full MongoDB persistence verified.\n")
    } catch (err) {
        console.error("Test Suite Failed with error:", err)
        process.exitCode = 1
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect()
        }
        if (mongod) {
            await mongod.stop()
        }
    }
}

runTests()
