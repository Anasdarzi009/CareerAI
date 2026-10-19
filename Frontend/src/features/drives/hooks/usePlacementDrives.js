import { useState, useEffect, useCallback } from 'react';
import {
    getDriveTemplates,
    startPlacementDrive,
    getDriveHistory,
    getDriveSession,
    submitDriveRound
} from '../services/drives.api';

export const usePlacementDrives = () => {
    // Templates & History State
    const [templates, setTemplates] = useState([]);
    const [drives, setDrives] = useState([]);
    const [stats, setStats] = useState(null);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Active Drive State
    const [activeDrive, setActiveDrive] = useState(null);
    const [loadingDrive, setLoadingDrive] = useState(false);
    const [submittingRound, setSubmittingRound] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Templates
    const fetchTemplates = useCallback(async () => {
        setLoadingTemplates(true);
        setError(null);
        try {
            const res = await getDriveTemplates();
            setTemplates(res.templates || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load drive templates');
        } finally {
            setLoadingTemplates(false);
        }
    }, []);

    // Fetch History & Stats
    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const res = await getDriveHistory();
            setDrives(res.drives || []);
            setStats(res.stats || null);
        } catch (err) {
            console.error('Error fetching drive history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    // Load an active drive by ID
    const loadDrive = useCallback(async (driveId) => {
        setLoadingDrive(true);
        setError(null);
        try {
            const res = await getDriveSession(driveId);
            setActiveDrive(res.drive || null);
            return res.drive;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load placement drive');
            return null;
        } finally {
            setLoadingDrive(false);
        }
    }, []);

    // Start a new drive from template
    const handleStartDrive = useCallback(async (templateId) => {
        setError(null);
        try {
            const res = await startPlacementDrive(templateId);
            return res.drive;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start placement drive');
            return null;
        }
    }, []);

    // Submit answers for current round
    const handleSubmitRound = useCallback(async (driveId, roundNumber, payload) => {
        setSubmittingRound(true);
        setError(null);
        try {
            const res = await submitDriveRound(driveId, roundNumber, payload);
            setActiveDrive(res.drive);
            return res.drive;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit drive round');
            return null;
        } finally {
            setSubmittingRound(false);
        }
    }, []);

    return {
        templates,
        drives,
        stats,
        loadingTemplates,
        loadingHistory,
        activeDrive,
        loadingDrive,
        submittingRound,
        error,
        setError,
        fetchTemplates,
        fetchHistory,
        loadDrive,
        handleStartDrive,
        handleSubmitRound
    };
};
