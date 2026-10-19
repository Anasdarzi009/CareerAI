import axios from "axios"
import { API_BASE_URL } from "../../../config/api.config"

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const cleanUsername = String(username || "").trim()
        const cleanEmail = String(email || "").trim().toLowerCase()
        const response = await api.post('/api/auth/register', {
            username: cleanUsername,
            email: cleanEmail,
            password
        })

        return response.data

    } catch (err) {

        console.log(err)
        throw err

    }

}

export async function login({ email, identifier, password }) {

    try {
        const cleanIdentifier = String(identifier || email || "").trim()
        const response = await api.post("/api/auth/login", {
            email: cleanIdentifier,
            identifier: cleanIdentifier,
            password
        })

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }

}

export async function resetPassword({ identifier, email, newPassword }) {
    try {
        const cleanIdentifier = String(identifier || email || "").trim()
        const response = await api.post("/api/auth/reset-password", {
            identifier: cleanIdentifier,
            email: cleanIdentifier,
            newPassword
        })
        return response.data
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }

}

export async function updateProfile({ username, gender, avatar }) {
    try {
        const response = await api.patch("/api/auth/profile", {
            username,
            gender,
            avatar
        })
        return response.data
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function changePassword({ currentPassword, newPassword, confirmPassword }) {
    try {
        const response = await api.post("/api/auth/change-password", {
            currentPassword,
            newPassword,
            confirmPassword
        })
        return response.data
    } catch (err) {
        console.log(err)
        throw err
    }
}