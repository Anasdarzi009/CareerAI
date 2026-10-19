import React from 'react';
import { Link } from 'react-router';
import { useCareerRoadmap } from '../hooks/useCareerRoadmap';
import RoadmapHeader from '../components/RoadmapHeader';
import CurrentPosition from '../components/CurrentPosition';
import RoadmapTargetSelector from '../components/RoadmapTargetSelector';
import RoadmapTimeline from '../components/RoadmapTimeline';
import RoadmapStageDetails from '../components/RoadmapStageDetails';
import '../style/career-roadmap.scss';

const CareerRoadmap = () => {
    const {
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
    } = useCareerRoadmap();

    // 1. Loading State
    if (loading) {
        return (
            <div className="roadmap-container roadmap-container--loading">
                <div className="roadmap-loading-state">
                    <div className="roadmap-spinner roadmap-spinner--large"></div>
                    <h3 className="roadmap-loading-state__title">Auditing Candidate Data & Building Roadmap</h3>
                    <p className="roadmap-loading-state__subtitle">
                        Cross-referencing Candidate Profile, Resume ATS metrics, and Skill Gap Analysis...
                    </p>
                </div>
            </div>
        );
    }

    // 2. Profile Incomplete State
    if (error && error.type === 'PROFILE_INCOMPLETE') {
        return (
            <div className="roadmap-container">
                <div className="roadmap-empty-state">
                    <div className="roadmap-empty-state__icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="12" y1="18" x2="12" y2="12"/>
                            <line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                    </div>
                    <h2 className="roadmap-empty-state__title">Set a target role to build your Career Roadmap.</h2>
                    <p className="roadmap-empty-state__desc">
                        A verified target role and baseline profile credentials are required to generate your 6-stage milestone roadmap.
                    </p>
                    <div className="roadmap-empty-state__actions">
                        <Link to="/resume-profile" className="roadmap-btn roadmap-btn--primary">
                            Complete Profile →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 3. General Error State
    if (error && error.type === 'GENERAL') {
        return (
            <div className="roadmap-container">
                <div className="roadmap-error-banner">
                    <div className="roadmap-error-banner__content">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>{error.message}</span>
                    </div>
                    <button
                        className="roadmap-btn roadmap-btn--secondary"
                        onClick={() => fetchRoadmap(selectedJobId || null, targetRole || null)}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // 4. Normal State
    const currentStage = roadmap?.stages?.find(s => s.stageNumber === activeStageNumber) || roadmap?.stages?.[0];

    return (
        <div className="roadmap-container">
            {/* Success Toast */}
            {successMessage && (
                <div className="roadmap-toast roadmap-toast--success">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Header */}
            <RoadmapHeader
                targetRole={roadmap?.targetRole || targetRole}
                targetCompany={roadmap?.targetCompany}
                overallProgress={roadmap?.overallProgress || 0}
                updatedAt={roadmap?.updatedAt}
                onRecalculate={() => handleGenerateRoadmap(targetRole, selectedJobId || null)}
                regenerating={regenerating}
            />

            {/* Target Role & Opportunity Selector */}
            <RoadmapTargetSelector
                currentTargetRole={roadmap?.targetRole || targetRole}
                targetCompany={roadmap?.targetCompany}
                selectedJobId={selectedJobId}
                availableJobs={availableJobs}
                onSelectRole={(newRole) => {
                    setTargetRole(newRole);
                    handleGenerateRoadmap(newRole, null);
                }}
                onSelectJob={(jobId) => {
                    setSelectedJobId(jobId);
                    handleGenerateRoadmap(null, jobId);
                }}
                isGenerating={regenerating}
            />

            {/* Current Position Audit Section */}
            <CurrentPosition currentPosition={roadmap?.currentPosition} />

            {/* Two-Column Roadmap Layout */}
            <div className="roadmap-workspace">
                {/* Left Column: Timeline */}
                <div className="roadmap-workspace__timeline-col">
                    <RoadmapTimeline
                        stages={roadmap?.stages || []}
                        activeStageNumber={activeStageNumber}
                        onSelectStage={(num) => setActiveStageNumber(num)}
                    />
                </div>

                {/* Right Column: Active Stage Details */}
                <div className="roadmap-workspace__detail-col">
                    <RoadmapStageDetails
                        stage={currentStage}
                        onToggleAction={handleToggleAction}
                        actionLoadingId={actionLoadingId}
                    />
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmap;
