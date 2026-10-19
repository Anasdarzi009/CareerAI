import axios from 'axios'
import { API_BASE_URL } from '../../../config/api.config'

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/skills`,
    withCredentials: true
})

export const getSkillGap = async (jobId = null) => {
    const params = jobId ? { jobId } : {}
    const response = await api.get('/gap', { params })
    return response.data
}

export const analyzeSkillGap = async (targetRole = null, jobId = null) => {
    const response = await api.post('/analyze', { targetRole, jobId })
    return response.data
}

export const updateSkillProgress = async (skillData) => {
    const response = await api.patch('/progress', skillData)
    return response.data
}
