import axios from 'axios';
import { API_BASE_URL } from '../../../config/api.config';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/roadmap`,
    withCredentials: true
});

export const getCareerRoadmap = async (params = {}) => {
    const response = await api.get('/', { params });
    return response.data;
};

export const generateCareerRoadmap = async (payload = {}) => {
    const response = await api.post('/generate', payload);
    return response.data;
};

export const getJobCareerRoadmap = async (jobId) => {
    const response = await api.get(`/${jobId}`);
    return response.data;
};

export const updateRoadmapAction = async (payload) => {
    const response = await api.patch('/action', payload);
    return response.data;
};

export const updateRoadmapStage = async (payload) => {
    const response = await api.patch('/stage', payload);
    return response.data;
};
