import axios from 'axios'
import { API_BASE_URL } from '../../../config/api.config'

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/jobs`,
    withCredentials: true
})

export const getJobs = async (params = {}) => {
    const response = await api.get('/', { params })
    return response.data
}

export const getJobById = async (id) => {
    const response = await api.get(`/${id}`)
    return response.data
}

export const getRecommendedJobs = async () => {
    const response = await api.get('/recommended')
    return response.data
}

export const getSavedJobs = async () => {
    const response = await api.get('/saved')
    return response.data
}

export const saveJob = async (id) => {
    const response = await api.post(`/${id}/save`)
    return response.data
}

export const unsaveJob = async (id) => {
    const response = await api.delete(`/${id}/save`)
    return response.data
}

export const getApplications = async () => {
    const response = await api.get('/applications')
    return response.data
}

export const applyJob = async (id, data = {}) => {
    const response = await api.post(`/${id}/application`, data)
    return response.data
}

export const updateApplicationStatus = async (applicationId, data = {}) => {
    const response = await api.patch(`/applications/${applicationId}`, data)
    return response.data
}
