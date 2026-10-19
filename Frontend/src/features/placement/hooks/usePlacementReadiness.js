import { useState, useEffect, useCallback } from 'react';
import {
    getPlacementReadiness,
    recalculatePlacementReadiness
} from '../services/placement.api';

export const usePlacementReadiness = () => {
    const [readiness, setReadiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recalculating, setRecalculating] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchReadiness = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPlacementReadiness();
            if (res.data) {
                setReadiness(res.data);
            }
        } catch (err) {
            console.error('fetchReadiness error:', err);
            setError(err.response?.data?.message || 'Failed to load placement readiness assessment.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReadiness();
    }, [fetchReadiness]);

    const handleRecalculate = async () => {
        setRecalculating(true);
        setError(null);
        setSuccessMessage('');
        try {
            const res = await recalculatePlacementReadiness();
            if (res.data) {
                setReadiness(res.data);
                setSuccessMessage('Placement readiness recalculated successfully.');
                setTimeout(() => setSuccessMessage(''), 3500);
            }
        } catch (err) {
            console.error('handleRecalculate error:', err);
            setError(err.response?.data?.message || 'Failed to recalculate placement readiness.');
        } finally {
            setRecalculating(false);
        }
    };

    return {
        readiness,
        loading,
        recalculating,
        error,
        successMessage,
        fetchReadiness,
        handleRecalculate
    };
};
