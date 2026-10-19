import axios from 'axios';
import { API_BASE_URL } from '../../../config/api.config';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/placement`,
    withCredentials: true
});

export const getPlacementReadiness = async () => {
    const response = await api.get('/readiness');
    return response.data;
};

export const recalculatePlacementReadiness = async () => {
    const response = await api.post('/readiness/recalculate');
    return response.data;
};

export const getJobReadinessBreakdown = async () => {
    const response = await api.get('/readiness/jobs');
    return response.data;
};
