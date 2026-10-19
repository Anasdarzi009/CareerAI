import React from 'react';
import { useNavigate } from 'react-router';
import { usePlacementAnalytics } from '../hooks/usePlacementAnalytics';
import AnalyticsHeader from '../components/AnalyticsHeader';
import TierProbabilityGrid from '../components/TierProbabilityGrid';
import GateBottleneckRadar from '../components/GateBottleneckRadar';
import WhatIfSimulatorCard from '../components/WhatIfSimulatorCard';
import VerifiableCredentialCard from '../components/VerifiableCredentialCard';
import '../style/placement-analytics.scss';

export const PlacementAnalytics = () => {
    const navigate = useNavigate();
    const {
        analytics,
        summary,
        loading,
        error,
        refresh,
        simulation,
        simulating,
        simParams,
        runSimulation,
        resetSimulation
    } = usePlacementAnalytics();

    if (loading && !analytics) {
        return (
            <div className="analytics-loading-state">
                <div className="analytics-spinner" />
                <h3 className="loading-title">Calculating Placement Intelligence...</h3>
                <p className="loading-sub">Synthesizing academic cutoffs, algorithmic test results, and recruitment gateways.</p>
            </div>
        );
    }

    if (error && !analytics) {
        return (
            <div className="analytics-error-state">
                <div className="error-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h3 className="error-title">Unable to Compute Placement Intelligence</h3>
                <p className="error-msg">{error}</p>
                <button className="btn-retry" onClick={refresh}>Try Again</button>
            </div>
        );
    }

    const gates = analytics?.recruitmentGates || [];
    const tiers = analytics?.tierProbabilities || [];
    const verification = analytics?.verificationDossier;

    // Check if profile is completely unpopulated
    const isProfileEmpty = gates.every(g => g.score === 0);

    return (
        <div className="placement-analytics-container">
            {/* Header with KPI strip */}
            <AnalyticsHeader
                summary={summary}
                onRefresh={refresh}
                loading={loading}
            />

            {/* Profile Incomplete Banner if candidate has zero data */}
            {isProfileEmpty && (
                <div className="unassessed-banner">
                    <div className="banner-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>
                    <div className="banner-text">
                        <h4 className="banner-title">Candidate Profile &amp; Practice Data Needed</h4>
                        <p className="banner-sub">
                            Your forecast is currently on baseline because no academic records, coding submissions, or placement drives
                            have been recorded yet. Complete your profile to unlock verified offer probabilities.
                        </p>
                    </div>
                    <button
                        className="btn-banner-action"
                        onClick={() => navigate('/resume-profile')}
                    >
                        Complete Profile
                    </button>
                </div>
            )}

            {/* Main Analytics Content Layout */}
            <div className="analytics-body-layout">
                {/* 1. Multi-Tier Probability Forecast */}
                <TierProbabilityGrid tiers={tiers} />

                {/* 2. Gateways & Bottlenecks Evaluation */}
                <GateBottleneckRadar gates={gates} />

                {/* 3. Interactive What-If Simulator */}
                <WhatIfSimulatorCard
                    simulation={simulation}
                    simulating={simulating}
                    simParams={simParams}
                    onSimulate={runSimulation}
                    onReset={resetSimulation}
                />

                {/* 4. Official Verifiable Credential */}
                <VerifiableCredentialCard
                    verification={verification}
                    summary={summary}
                />
            </div>
        </div>
    );
};

export default PlacementAnalytics;
