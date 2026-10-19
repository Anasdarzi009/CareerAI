import { useState, useEffect, useCallback } from 'react';
import analyticsApi from '../services/analytics.api';

export const usePlacementAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // What-If Simulator state
    const [simulation, setSimulation] = useState(null);
    const [simulating, setSimulating] = useState(false);
    const [simParams, setSimParams] = useState({
        boostCodingScore: 0,
        clearPlacementDrive: false,
        closeSkillGapsCount: 0
    });

    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await analyticsApi.getAnalytics();
            if (res.success && res.data) {
                setAnalyticsData(res.data.analytics);
                setSummary(res.data.summary);
            }
        } catch (err) {
            console.error('Failed to load placement analytics:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load placement analytics.');
        } finally {
            setLoading(false);
        }
    }, []);

    const runSimulation = useCallback(async (params) => {
        try {
            setSimulating(true);
            const merged = { ...simParams, ...params };
            setSimParams(merged);

            const res = await analyticsApi.simulateWhatIf(merged);
            if (res.success && res.data) {
                setSimulation(res.data);
            }
        } catch (err) {
            console.error('Failed to run simulation:', err);
        } finally {
            setSimulating(false);
        }
    }, [simParams]);

    const resetSimulation = useCallback(() => {
        setSimParams({
            boostCodingScore: 0,
            clearPlacementDrive: false,
            closeSkillGapsCount: 0
        });
        setSimulation(null);
    }, []);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        analytics: analyticsData,
        summary,
        loading,
        error,
        refresh: fetchAnalytics,
        // Simulation
        simulation,
        simulating,
        simParams,
        runSimulation,
        resetSimulation
    };
};

export default usePlacementAnalytics;
