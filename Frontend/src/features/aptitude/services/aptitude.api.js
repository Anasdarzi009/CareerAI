import axios from 'axios';
import { API_BASE_URL } from '../../../config/api.config';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/aptitude`,
    withCredentials: true
});

export const getAptitudeQuestions = async (params = {}) => {
    const response = await api.get('/questions', { params });
    return response.data;
};

export const getAptitudeQuestionById = async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
};

export const submitAptitudeAnswer = async (id, payload) => {
    const response = await api.post(`/questions/${id}/answer`, payload);
    return response.data;
};

export const getAptitudeAttempts = async () => {
    const response = await api.get('/attempts');
    return response.data;
};

export const getAptitudeStats = async () => {
    const response = await api.get('/stats');
    return response.data;
};

export const createAptitudeAssessment = async (payload) => {
    const response = await api.post('/assessments', payload);
    return response.data;
};

export const getAptitudeAssessments = async () => {
    const response = await api.get('/assessments');
    return response.data;
};

export const getAptitudeAssessmentById = async (id) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
};

export const startAptitudeAssessment = async (id) => {
    const response = await api.post(`/assessments/${id}/start`);
    return response.data;
};
export const startAssessment = startAptitudeAssessment;

export const submitAptitudeAssessment = async (id, payload) => {
    const response = await api.post(`/assessments/${id}/submit`, payload);
    return response.data;
};
export const submitAssessment = submitAptitudeAssessment;
