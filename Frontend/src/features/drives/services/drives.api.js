import axios from 'axios';
import { API_BASE_URL } from '../../../config/api.config';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/drives`,
    withCredentials: true
});

export const getDriveTemplates = async () => {
    const response = await api.get('/templates');
    return response.data;
};

export const startPlacementDrive = async (templateId) => {
    const response = await api.post('/start', { templateId });
    return response.data;
};

export const getDriveHistory = async () => {
    const response = await api.get('/history');
    return response.data;
};

export const getDriveSession = async (driveId) => {
    const response = await api.get(`/${driveId}`);
    return response.data;
};

export const submitDriveRound = async (driveId, roundNumber, payload) => {
    const response = await api.post(`/${driveId}/rounds/${roundNumber}/submit`, payload);
    return response.data;
};
