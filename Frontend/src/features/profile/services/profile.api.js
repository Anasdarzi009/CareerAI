import axios from "axios"
import { API_BASE_URL } from "../../../config/api.config"

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

export async function getProfile() {
    try {
        const response = await api.get("/api/profile")
        return response.data
    } catch (err) {
        console.error("getProfile error:", err)
        throw err
    }
}

export async function updateProfile(profileData) {
    try {
        const response = await api.patch("/api/profile", profileData)
        return response.data
    } catch (err) {
        console.error("updateProfile error:", err)
        throw err
    }
}

export async function uploadResume(file) {
    try {
        const formData = new FormData()
        formData.append("resume", file)

        const response = await api.post("/api/profile/resume", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return response.data
    } catch (err) {
        console.error("uploadResume error:", err)
        throw err
    }
}

export async function deleteResume() {
    try {
        const response = await api.delete("/api/profile/resume")
        return response.data
    } catch (err) {
        console.error("deleteResume error:", err)
        throw err
    }
}
