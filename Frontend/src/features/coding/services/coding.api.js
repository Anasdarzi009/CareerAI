import axios from 'axios';
import { API_BASE_URL } from '../../../config/api.config';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/coding`,
    withCredentials: true
});

export const getCodingQuestions = async (params = {}) => {
    const response = await api.get('/questions', { params });
    return response.data;
};

export const getCodingQuestionById = async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
};

export const runSampleTests = async ({ questionId, language, code }) => {
    const response = await api.post('/run-sample', { questionId, language, code });
    return response.data;
};

export const submitCodingCode = async ({ questionId, language, code, assessmentId }) => {
    const response = await api.post('/submit', { questionId, language, code, assessmentId });
    return response.data;
};

export const getCodingSubmissions = async (params = {}) => {
    const response = await api.get('/submissions', { params });
    return response.data;
};

export const getCodingSubmissionById = async (id) => {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
};

export const getCodingStats = async () => {
    const response = await api.get('/stats');
    return response.data;
};

export const createCodingAssessment = async (payload) => {
    const response = await api.post('/assessments', payload);
    return response.data;
};

export const getCodingAssessments = async () => {
    const response = await api.get('/assessments');
    return response.data;
};

export const getCodingAssessmentById = async (id) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
};

export const startCodingAssessment = async (id) => {
    const response = await api.post(`/assessments/${id}/start`);
    return response.data;
};

export const submitCodingAssessment = async (id, payload) => {
    const response = await api.post(`/assessments/${id}/submit`, payload);
    return response.data;
};
