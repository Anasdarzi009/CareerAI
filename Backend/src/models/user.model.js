const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already taken" ],
        required: true,
        trim: true
    },

    email: {
        type: String,
        unique: [ true, "Account already exists with this email address" ],
        required: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        default: "avatar-1"
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Prefer not to say", ""],
        default: "Prefer not to say"
    }
}, { timestamps: true })

const userModel = mongoose.model("users", userSchema)

module.exports = userModel