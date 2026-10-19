import axios from 'axios';
import { API_BASE_URL } from '../../../config/api.config';

const API = axios.create({
    baseURL: `${API_BASE_URL}/api/analytics`,
    withCredentials: true
});

export const analyticsApi = {
    /**
     * Get candidate placement analytics, offer probabilities, and recruitment gates
     */
    async getAnalytics() {
        const res = await API.get('/');
        return res.data;
    },

    /**
     * Run dynamic What-If sensitivity simulation
     */
    async simulateWhatIf(adjustments) {
        const res = await API.post('/simulate-what-if', adjustments);
        return res.data;
    },

    /**
     * Verify a public placement credential
     */
    async verifyCredential(token) {
        const res = await API.get(`/verify/${token}`);
        return res.data;
    }
};

export default analyticsApi;
