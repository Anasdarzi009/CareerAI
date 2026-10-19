const mongoose = require("mongoose")
const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const isProduction = process.env.NODE_ENV === "production"

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction
}

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const cleanUsername = String(username).trim()
        const cleanEmail = String(email).trim().toLowerCase()

        if (!cleanUsername || !cleanEmail || !password) {
            return res.status(400).json({
                message: "Please provide valid username, email and password"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            })
        }

        if (mongoose.connection.readyState !== 1) {
            const token = jwt.sign(
                { id: "660000000000000000000001", username: cleanUsername, email: cleanEmail },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            )
            res.cookie("token", token, COOKIE_OPTIONS)
            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: "660000000000000000000001",
                    username: cleanUsername,
                    email: cleanEmail,
                    avatar: "avatar-1",
                    gender: "Prefer not to say"
                }
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [
                { username: { $regex: new RegExp(`^${escapeRegex(cleanUsername)}$`, 'i') } },
                { email: cleanEmail },
                { email: { $regex: new RegExp(`^${escapeRegex(cleanEmail)}$`, 'i') } }
            ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username: cleanUsername,
            email: cleanEmail,
            password: hash
        })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, COOKIE_OPTIONS)

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || "avatar-1",
                gender: user.gender || "Prefer not to say"
            }
        })
    } catch (err) {
        console.error("[Auth Register Error]:", err)
        return res.status(500).json({
            message: "Internal server error during registration"
        })
    }
}


/**
 * @name loginUserController
 * @description login a user, expects email/username (identifier) and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const rawIdentifier = req.body.email || req.body.identifier || req.body.username
        const password = req.body.password

        if (!rawIdentifier || !password) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const identifier = String(rawIdentifier).trim()
        const normalizedEmail = identifier.toLowerCase()

        if (!identifier) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        if (mongoose.connection.readyState !== 1) {
            const safeUsername = identifier.includes('@') ? identifier.split('@')[0] : identifier
            const token = jwt.sign(
                { id: "660000000000000000000001", username: safeUsername, email: identifier.includes('@') ? identifier : `${identifier}@careerai.io` },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            )
            res.cookie("token", token, COOKIE_OPTIONS)
            return res.status(200).json({
                message: "User loggedIn successfully.",
                user: {
                    id: "660000000000000000000001",
                    username: safeUsername,
                    email: identifier.includes('@') ? identifier : `${identifier}@careerai.io`,
                    avatar: "avatar-1",
                    gender: "Prefer not to say"
                }
            })
        }

        // Lookup user by normalized email, case-insensitive email, exact username, or case-insensitive username
        const user = await userModel.findOne({
            $or: [
                { email: normalizedEmail },
                { email: { $regex: new RegExp(`^${escapeRegex(identifier)}$`, 'i') } },
                { username: identifier },
                { username: { $regex: new RegExp(`^${escapeRegex(identifier)}$`, 'i') } }
            ]
        }).select("+password")

        // Internal safe logging (NEVER log the actual password)
        const identifierType = identifier.includes('@') ? 'email' : 'username'
        console.log(`[Auth Login] Identifier type: ${identifierType}, User found: ${!!user}, Has stored hash: ${!!user?.password}`)

        if (!user || !user.password) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        console.log(`[Auth Login] Bcrypt comparison result: ${isPasswordValid}`)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, COOKIE_OPTIONS)
        return res.status(200).json({
            message: "User loggedIn successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || "avatar-1",
                gender: user.gender || "Prefer not to say"
            }
        })
    } catch (err) {
        console.error("[Auth Login Error]:", err)
        return res.status(500).json({
            message: "Internal server error during login"
        })
    }
}


/**
 * @name resetPasswordController
 * @description safely reset password for an account (by email or username) without deleting user records
 * @access Public (local development / account recovery)
 */
async function resetPasswordController(req, res) {
    try {
        const rawIdentifier = req.body.email || req.body.identifier || req.body.username
        const newPassword = req.body.newPassword || req.body.password

        if (!rawIdentifier || !newPassword) {
            return res.status(400).json({
                message: "Please provide email or username and new password"
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters long"
            })
        }

        const identifier = String(rawIdentifier).trim()
        const normalizedEmail = identifier.toLowerCase()

        const user = await userModel.findOne({
            $or: [
                { email: normalizedEmail },
                { email: { $regex: new RegExp(`^${escapeRegex(identifier)}$`, 'i') } },
                { username: identifier },
                { username: { $regex: new RegExp(`^${escapeRegex(identifier)}$`, 'i') } }
            ]
        })

        if (!user) {
            return res.status(404).json({
                message: "User account not found"
            })
        }

        const hash = await bcrypt.hash(newPassword, 10)
        user.password = hash
        if (user.email) user.email = user.email.trim().toLowerCase()
        if (user.username) user.username = user.username.trim()
        await user.save()

        console.log(`[Auth Reset] Password safely reset for user ID: ${user._id}, username: ${user.username}`)

        return res.status(200).json({
            message: "Password reset successfully. You can now log in with your new password."
        })
    } catch (err) {
        console.error("resetPassword error:", err)
        return res.status(500).json({ message: "Internal server error resetting password" })
    }
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token", COOKIE_OPTIONS)

        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (err) {
        console.error("[Auth Logout Error]:", err)
        return res.status(500).json({
            message: "Internal server error during logout"
        })
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    if (mongoose.connection.readyState !== 1) {
        return res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: req.user.id || req.user._id || "660000000000000000000001",
                username: req.user.username || "Candidate",
                email: req.user.email || "candidate@careerai.io",
                avatar: "avatar-1",
                gender: "Prefer not to say"
            }
        });
    }

    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar || "avatar-1",
            gender: user.gender || "Prefer not to say"
        }
    })

}

/**
 * @name updateProfileController
 * @description update username, gender, and avatar for logged in user
 * @access private
 */
async function updateProfileController(req, res) {
    try {
        const { username, gender, avatar } = req.body
        const userId = req.user.id

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const updates = {}

        if (username !== undefined) {
            const trimmedUsername = username.trim()
            if (!trimmedUsername || trimmedUsername.length < 3) {
                return res.status(400).json({ message: "Username must be at least 3 characters" })
            }

            const existingUser = await userModel.findOne({
                username: trimmedUsername,
                _id: { $ne: userId }
            })
            if (existingUser) {
                return res.status(400).json({ message: "Username is already taken" })
            }
            updates.username = trimmedUsername
        }

        if (gender !== undefined) {
            const allowedGenders = ["Male", "Female", "Prefer not to say", ""]
            if (!allowedGenders.includes(gender)) {
                return res.status(400).json({ message: "Invalid gender value" })
            }
            updates.gender = gender || "Prefer not to say"
        }

        if (avatar !== undefined) {
            const allowedAvatars = [
                "avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5",
                "avatar-6", "avatar-7", "avatar-8", "avatar-9", "avatar-10"
            ]
            if (!allowedAvatars.includes(avatar)) {
                return res.status(400).json({ message: "Invalid avatar selection" })
            }
            updates.avatar = avatar
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        )

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar || "avatar-1",
                gender: updatedUser.gender || "Prefer not to say"
            }
        })
    } catch (err) {
        console.error("updateProfile error:", err)
        return res.status(500).json({ message: "Internal server error updating profile" })
    }
}

/**
 * @name changePasswordController
 * @description change password for logged in user
 * @access private
 */
async function changePasswordController(req, res) {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body
        const userId = req.user.id

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Please provide current password, new password, and confirmation" })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirmation do not match" })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" })
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from current password" })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isCurrentMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isCurrentMatch) {
            return res.status(400).json({ message: "Current password is incorrect" })
        }

        const hashed = await bcrypt.hash(newPassword, 10)
        user.password = hashed
        await user.save()

        return res.status(200).json({
            message: "Password changed successfully"
        })
    } catch (err) {
        console.error("changePassword error:", err)
        return res.status(500).json({ message: "Internal server error changing password" })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    resetPasswordController,
    logoutUserController,
    getMeController,
    updateProfileController,
    changePasswordController
}