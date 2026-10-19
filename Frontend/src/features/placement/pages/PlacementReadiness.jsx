import React from 'react';
import { Link } from 'react-router';
import { usePlacementReadiness } from '../hooks/usePlacementReadiness';
import PlacementReadinessHeader from '../components/PlacementReadinessHeader';
import OverallReadinessCard from '../components/OverallReadinessCard';
import ReadinessDimensions from '../components/ReadinessDimensions';
import PlacementBlockers from '../components/PlacementBlockers';
import PlacementStrengths from '../components/PlacementStrengths';
import ReadinessChecklist from '../components/ReadinessChecklist';
import JobReadinessSection from '../components/JobReadinessSection';
import NextBestActions from '../components/NextBestActions';
import '../style/placement-readiness.scss';

const PlacementReadiness = () => {
    const {
        readiness,
        loading,
        recalculating,
        error,
        successMessage,
        fetchReadiness,
        handleRecalculate
    } = usePlacementReadiness();

    // 1. Loading State
    if (loading) {
        return (
            <div className="placement-container placement-container--loading">
                <div className="placement-loading-state">
                    <div className="placement-spinner placement-spinner--large"></div>
                    <h3 className="placement-loading-state__title">Evaluating Placement Readiness</h3>
                    <p className="placement-loading-state__subtitle">
                        Auditing academic criteria, verified skills, project evidence, and institutional job cutoffs...
                    </p>
                </div>
            </div>
        );
    }

    // 2. Error State
    if (error && !readiness) {
        return (
            <div className="placement-container">
                <div className="placement-unassessed-state">
                    <div className="placement-unassessed-state__icon">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <h3 className="placement-unassessed-state__title">Unable to Load Placement Readiness</h3>
                    <p className="placement-unassessed-state__desc">{error}</p>
                    <div className="placement-unassessed-state__actions">
                        <button className="placement-btn placement-btn--primary" onClick={fetchReadiness}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Unassessed Candidate State
    if (readiness && !readiness.isAssessed) {
        return (
            <div className="placement-container">
                <div className="placement-unassessed-state">
                    <div className="placement-unassessed-state__icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                    </div>
                    <h2 className="placement-unassessed-state__title">
                        Your placement readiness hasn't been fully assessed yet.
                    </h2>
                    <p className="placement-unassessed-state__desc">
                        A verified candidate profile with academic percentages (10th/12th/Degree) and an uploaded technical resume are required before recruitment cutoffs can be verified.
                    </p>
                    <div className="placement-unassessed-state__actions">
                        <Link to="/resume-profile" className="placement-btn placement-btn--primary">
                            Complete Profile &amp; Resume →
                        </Link>
                    </div>
                </div>

                {/* Show initial checklist even in unassessed state */}
                {readiness.checklist && readiness.checklist.length > 0 && (
                    <ReadinessChecklist checklist={readiness.checklist} />
                )}
            </div>
        );
    }

    // 4. Normal Assessed State
    return (
        <div className="placement-container">
            {/* Success Toast */}
            {successMessage && (
                <div className="placement-toast">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Header */}
            <PlacementReadinessHeader
                lastCalculatedAt={readiness?.lastCalculatedAt}
                onRecalculate={handleRecalculate}
                recalculating={recalculating}
            />

            {/* Overall Score Card */}
            <OverallReadinessCard
                overallReadiness={readiness?.overallReadiness || 0}
                readinessLevel={readiness?.readinessLevel || 'Not Ready'}
                isAssessed={readiness?.isAssessed}
                eligibleJobsCount={readiness?.eligibleJobsCount || 0}
                ineligibleJobsCount={readiness?.ineligibleJobsCount || 0}
                unverifiedJobsCount={readiness?.unverifiedJobsCount || 0}
            />

            {/* Next Best Actions (Top Priority) */}
            <NextBestActions nextActions={readiness?.nextActions || []} />

            {/* Placement Blockers */}
            <PlacementBlockers blockers={readiness?.blockers || []} />

            {/* 8-Dimension Breakdown */}
            <ReadinessDimensions dimensions={readiness?.dimensions || {}} />

            {/* Placement Strengths */}
            <PlacementStrengths strengths={readiness?.strengths || []} />

            {/* Verification Checklist */}
            <ReadinessChecklist checklist={readiness?.checklist || []} />

            {/* Job Readiness Section */}
            <JobReadinessSection jobReadiness={readiness?.jobReadiness || []} />
        </div>
    );
};

export default PlacementReadiness;
