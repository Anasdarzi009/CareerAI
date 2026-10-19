import { useState, useEffect, useCallback } from 'react';
import {
    getCareerRoadmap,
    generateCareerRoadmap,
    updateRoadmapAction,
    updateRoadmapStage
} from '../services/roadmap.api';
import { getJobs } from '../../jobs/services/jobs.api';

export const useCareerRoadmap = () => {
    const [roadmap, setRoadmap] = useState(null);
    const [availableJobs, setAvailableJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [activeStageNumber, setActiveStageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [regenerating, setRegenerating] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch available jobs for target selector
    useEffect(() => {
        let isMounted = true;
        getJobs()
            .then(data => {
                if (isMounted) setAvailableJobs(data.jobs || []);
            })
            .catch(() => {});
        return () => { isMounted = false; };
    }, []);

    // Fetch or initialize roadmap
    const fetchRoadmap = useCallback(async (jobId = null, role = null) => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (jobId) params.jobId = jobId;
            if (role) params.targetRole = role;

            const res = await getCareerRoadmap(params);
            if (res.data) {
                setRoadmap(res.data);
                setTargetRole(res.data.targetRole || '');
                if (res.data.currentStage) {
                    setActiveStageNumber(res.data.currentStage);
                }
            }
        } catch (err) {
            console.error('fetchRoadmap error:', err);
            const errData = err.response?.data;
            if (errData?.code === 'PROFILE_INCOMPLETE') {
                setError({
                    type: 'PROFILE_INCOMPLETE',
                    message: errData.message,
                    missingFields: errData.missingFields || []
                });
            } else {
                setError({
                    type: 'GENERAL',
                    message: errData?.message || 'Failed to load career roadmap.'
                });
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoadmap(selectedJobId || null, targetRole || null);
    }, [fetchRoadmap, selectedJobId]);

    // Recalculate or switch target role/job
    const handleGenerateRoadmap = async (customRole, jobId = null) => {
        setRegenerating(true);
        setError(null);
        setSuccessMessage('');
        try {
            const payload = {};
            if (customRole) payload.targetRole = customRole;
            if (jobId) payload.jobId = jobId;

            const res = await generateCareerRoadmap(payload);
            if (res.data) {
                setRoadmap(res.data);
                setTargetRole(res.data.targetRole || '');
                if (res.data.currentStage) {
                    setActiveStageNumber(res.data.currentStage);
                }
                setSuccessMessage('Career Roadmap updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3500);
            }
        } catch (err) {
            console.error('handleGenerateRoadmap error:', err);
            const errData = err.response?.data;
            if (errData?.code === 'PROFILE_INCOMPLETE') {
                setError({
                    type: 'PROFILE_INCOMPLETE',
                    message: errData.message,
                    missingFields: errData.missingFields || []
                });
            } else {
                setError({
                    type: 'GENERAL',
                    message: errData?.message || 'Failed to generate career roadmap.'
                });
            }
        } finally {
            setRegenerating(false);
        }
    };

    // Toggle Action Item Checkbox
    const handleToggleAction = async (stageNumber, actionId, currentStatus) => {
        if (!roadmap?._id) return;
        setActionLoadingId(actionId);

        // Optimistic update
        const updatedStages = (roadmap.stages || []).map(stage => {
            if (stage.stageNumber === stageNumber) {
                const updatedActions = (stage.actions || []).map(a => {
                    if (a.id === actionId) {
                        return { ...a, isCompleted: !currentStatus };
                    }
                    return a;
                });
                const completedCount = updatedActions.filter(a => a.isCompleted).length;
                const completionPercentage = Math.round((completedCount / updatedActions.length) * 100);
                return {
                    ...stage,
                    actions: updatedActions,
                    completionPercentage,
                    status: completionPercentage === 100 ? 'COMPLETED' : (completionPercentage > 0 ? 'IN_PROGRESS' : stage.status)
                };
            }
            return stage;
        });

        const totalPct = updatedStages.reduce((acc, s) => acc + s.completionPercentage, 0);
        const overallProgress = Math.round(totalPct / updatedStages.length);

        setRoadmap(prev => ({
            ...prev,
            stages: updatedStages,
            overallProgress
        }));

        try {
            const res = await updateRoadmapAction({
                roadmapId: roadmap._id,
                stageNumber,
                actionId,
                isCompleted: !currentStatus
            });
            if (res.data) {
                setRoadmap(res.data);
            }
        } catch (err) {
            console.error('handleToggleAction error:', err);
            // Revert on failure
            fetchRoadmap(selectedJobId || null, targetRole || null);
        } finally {
            setActionLoadingId(null);
        }
    };

    return {
        roadmap,
        loading,
        regenerating,
        actionLoadingId,
        error,
        successMessage,
        availableJobs,
        selectedJobId,
        setSelectedJobId,
        targetRole,
        setTargetRole,
        activeStageNumber,
        setActiveStageNumber,
        fetchRoadmap,
        handleGenerateRoadmap,
        handleToggleAction
    };
};
