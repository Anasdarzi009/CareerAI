import axios from 'axios';
import { API_BASE_URL } from '../../../config/api.config';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

/**
 * Start a new mock interview attempt session
 */
export const startMockInterview = async (config = {}) => {
    const response = await api.post('/api/interview/start', config);
    return response.data;
};

/**
 * Submit candidate answer and voice/content/video metrics for a specific question
 */
export const submitInterviewAnswer = async (attemptId, payload = {}) => {
    const response = await api.post(`/api/interview/${attemptId}/answer`, payload);
    return response.data;
};

/**
 * Upload or sanitize transcript for an interview session
 */
export const uploadInterviewTranscript = async (attemptId, payload = {}) => {
    const response = await api.post(`/api/interview/${attemptId}/transcript`, payload);
    return response.data;
};

/**
 * Finalize and grade completed mock interview
 */
export const finishMockInterview = async (attemptId) => {
    const response = await api.post(`/api/interview/${attemptId}/finish`);
    return response.data;
};

/**
 * Terminate interview session due to monitoring violation (e.g. tab switch)
 */
export const terminateInterviewSession = async (attemptId, payload = {}) => {
    const response = await api.post(`/api/interview/${attemptId}/terminate`, payload);
    return response.data;
};

/**
 * Fetch candidate interview history
 */
export const getInterviewHistory = async () => {
    const response = await api.get('/api/interview/history');
    return response.data;
};

/**
 * Fetch interview attempt by ID
 */
export const getInterviewAttemptById = async (attemptId) => {
    const response = await api.get(`/api/interview/attempts/${attemptId}`);
    return response.data;
};

/**
 * Fetch candidate interview statistics
 */
export const getInterviewStats = async () => {
    const response = await api.get('/api/interview/stats');
    return response.data;
};

/**
 * Fetch interview question catalog metadata
 */
export const getInterviewQuestionsCatalog = async () => {
    const response = await api.get('/api/interview/questions');
    return response.data;
};
