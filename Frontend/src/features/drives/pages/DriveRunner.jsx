import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { usePlacementDrives } from '../hooks/usePlacementDrives';
import DriveRoundNavigator from '../components/DriveRoundNavigator';
import AptitudeRoundRunner from '../components/AptitudeRoundRunner';
import CodingRoundRunner from '../components/CodingRoundRunner';
import InterviewRoundRunner from '../components/InterviewRoundRunner';
import DriveDossierView from '../components/DriveDossierView';
import '../style/placement-drives.scss';

const DriveRunner = () => {
    const { id } = useParams();
    const {
        activeDrive,
        loadingDrive,
        submittingRound,
        loadDrive,
        handleSubmitRound,
        error
    } = usePlacementDrives();

    const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);

    useEffect(() => {
        if (id) {
            loadDrive(id).then(drive => {
                if (drive && drive.currentRoundIndex !== undefined) {
                    setSelectedRoundIndex(drive.currentRoundIndex);
                }
            });
        }
    }, [id, loadDrive]);

    // Update selected round when drive's current round changes
    useEffect(() => {
        if (activeDrive && activeDrive.currentRoundIndex !== undefined) {
            setSelectedRoundIndex(activeDrive.currentRoundIndex);
        }
    }, [activeDrive?.currentRoundIndex]);

    if (loadingDrive) {
        return (
            <div className="drives-loading-screen">
                <div className="drives-spinner drives-spinner--large"></div>
                <h3>Configuring Corporate Placement Simulation</h3>
                <p>Initializing assessment harness, coding sandbox, and technical interview parameters...</p>
            </div>
        );
    }

    if (!activeDrive) {
        return (
            <div className="drives-error-screen">
                <h3>Placement Drive Session Unavailable</h3>
                <p>{error || 'The requested placement drive session could not be found.'}</p>
                <Link to="/placement-drives" className="drives-btn drives-btn--primary">
                    ← Return to Placement Drives Hub
                </Link>
            </div>
        );
    }

    // If drive is completely finished, render official Placement Dossier
    if (activeDrive.status === 'Completed') {
        return (
            <div className="drives-container">
                <DriveDossierView drive={activeDrive} />
            </div>
        );
    }

    const rounds = activeDrive.rounds || [];
    const activeRound = rounds[selectedRoundIndex] || rounds[0];

    const onRoundSubmitHandler = async (payload) => {
        if (!activeRound) return;
        const updated = await handleSubmitRound(activeDrive._id, activeRound.roundNumber, payload);
        if (updated && updated.currentRoundIndex !== undefined) {
            setSelectedRoundIndex(updated.currentRoundIndex);
        }
    };

    return (
        <div className="drives-runner-container">
            {/* Top Bar */}
            <div className="drives-runner-header">
                <div className="drives-runner-header__left">
                    <Link to="/placement-drives" className="drives-back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span>Drives Hub</span>
                    </Link>
                    <span className="drives-sep">/</span>
                    <span className="drives-company-tag">{activeDrive.companyName}</span>
                    <h2 className="drives-header-title">{activeDrive.title}</h2>
                </div>

                <div className="drives-runner-header__right">
                    <span className="drives-role-badge">Role: {activeDrive.targetRole}</span>
                    <span className="drives-live-badge">
                        <span className="drives-badge-dot"></span>
                        Live Simulation Session
                    </span>
                </div>
            </div>

            {error && (
                <div className="drives-alert drives-alert--error">{error}</div>
            )}

            {/* Visual Round Navigation Pipeline */}
            <DriveRoundNavigator
                rounds={rounds}
                currentRoundIndex={selectedRoundIndex}
                onSelectRound={setSelectedRoundIndex}
            />

            {/* Render Active Round Component */}
            <div className="drives-round-workspace">
                {activeRound?.roundType === 'APTITUDE_CS' && (
                    <AptitudeRoundRunner
                        round={activeRound}
                        onSubmit={onRoundSubmitHandler}
                        isSubmitting={submittingRound}
                    />
                )}

                {activeRound?.roundType === 'CODING_ASSESSMENT' && (
                    <CodingRoundRunner
                        round={activeRound}
                        onSubmit={onRoundSubmitHandler}
                        isSubmitting={submittingRound}
                    />
                )}

                {activeRound?.roundType === 'TECHNICAL_HR_INTERVIEW' && (
                    <InterviewRoundRunner
                        round={activeRound}
                        onSubmit={onRoundSubmitHandler}
                        isSubmitting={submittingRound}
                    />
                )}
            </div>
        </div>
    );
};

export default DriveRunner;
