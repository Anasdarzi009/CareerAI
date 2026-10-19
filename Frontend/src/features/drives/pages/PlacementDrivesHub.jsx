import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { usePlacementDrives } from '../hooks/usePlacementDrives';
import DriveHeader from '../components/DriveHeader';
import DriveTemplateCard from '../components/DriveTemplateCard';
import '../style/placement-drives.scss';

const PlacementDrivesHub = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('templates');
    const [startingId, setStartingId] = useState(null);

    const {
        templates,
        drives,
        stats,
        loadingTemplates,
        loadingHistory,
        fetchTemplates,
        fetchHistory,
        handleStartDrive,
        error
    } = usePlacementDrives();

    useEffect(() => {
        fetchTemplates();
        fetchHistory();
    }, [fetchTemplates, fetchHistory]);

    const onStartDriveClick = async (templateId) => {
        setStartingId(templateId);
        const drive = await handleStartDrive(templateId);
        setStartingId(null);
        if (drive && drive._id) {
            navigate(`/placement-drives/runner/${drive._id}`);
        }
    };

    // Find any in-progress drive
    const inProgressDrive = drives.find(d => d.status === 'In Progress');

    return (
        <div className="drives-container">
            <DriveHeader
                stats={stats}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {error && (
                <div className="drives-alert drives-alert--error">{error}</div>
            )}

            {/* In-Progress Session Resume Banner */}
            {inProgressDrive && (
                <div className="drives-resume-banner">
                    <div className="drives-resume-banner__info">
                        <span className="drives-resume-tag">Drive In Progress</span>
                        <h4>{inProgressDrive.title}</h4>
                        <p>You have an ongoing placement drive simulation session at Round {inProgressDrive.currentRoundIndex + 1}.</p>
                    </div>
                    <Link
                        to={`/placement-drives/runner/${inProgressDrive._id}`}
                        className="drives-btn drives-btn--primary"
                    >
                        Resume Drive Simulation →
                    </Link>
                </div>
            )}

            {/* Tab 1: Company Drive Tracks */}
            {activeTab === 'templates' && (
                <div className="drives-tab-pane">
                    <div className="drives-pane-header">
                        <div>
                            <h2 className="drives-pane-title">Verified Corporate Placement Tracks</h2>
                            <p className="drives-pane-subtitle">
                                Structured multi-round recruitment drives modeled on exact hiring patterns from top product, IT consulting, and high-growth technology companies.
                            </p>
                        </div>
                    </div>

                    {loadingTemplates ? (
                        <div className="drives-loading-state">
                            <div className="drives-spinner drives-spinner--large"></div>
                            <p>Loading corporate placement drive blueprints...</p>
                        </div>
                    ) : (
                        <div className="drives-templates-grid">
                            {templates.map(tmpl => (
                                <DriveTemplateCard
                                    key={tmpl.id}
                                    template={tmpl}
                                    onStartDrive={onStartDriveClick}
                                    isStarting={startingId === tmpl.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Candidate Drive History */}
            {activeTab === 'history' && (
                <div className="drives-tab-pane">
                    <div className="drives-pane-header">
                        <div>
                            <h2 className="drives-pane-title">Placement Drive History &amp; Dossiers</h2>
                            <p className="drives-pane-subtitle">
                                Complete record of your multi-round recruitment attempts, round evaluations, and official hiring recommendations.
                            </p>
                        </div>
                    </div>

                    {loadingHistory ? (
                        <div className="drives-loading-state">
                            <div className="drives-spinner drives-spinner--large"></div>
                            <p>Loading placement history...</p>
                        </div>
                    ) : drives.length === 0 ? (
                        <div className="drives-empty-state">
                            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 14 14" />
                            </svg>
                            <h3>No Placement Drive History Yet</h3>
                            <p>You haven't attempted a full multi-round placement drive. Select a company track from the Company Drive Tracks tab to start.</p>
                            <button
                                type="button"
                                className="drives-btn drives-btn--primary"
                                onClick={() => setActiveTab('templates')}
                            >
                                Explore Company Tracks →
                            </button>
                        </div>
                    ) : (
                        <div className="drives-history-table-wrapper">
                            <table className="drives-history-table">
                                <thead>
                                    <tr>
                                        <th>Company Track</th>
                                        <th>Target Role</th>
                                        <th>Verdict</th>
                                        <th>Overall Score</th>
                                        <th>Rounds Cleared</th>
                                        <th>Attempted On</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drives.map(d => {
                                        const isRec = d.hiringVerdict === 'RECOMMENDED FOR HIRE';
                                        const isBord = d.hiringVerdict && d.hiringVerdict.includes('BORDERLINE');
                                        const clearedCount = (d.rounds || []).filter(r => r.passed).length;
                                        return (
                                            <tr key={d._id}>
                                                <td>
                                                    <strong>{d.companyName}</strong>
                                                    <div className="drives-table-sub">{d.title}</div>
                                                </td>
                                                <td>{d.targetRole}</td>
                                                <td>
                                                    <span className={`drives-verdict-tag ${isRec ? 'hire' : isBord ? 'borderline' : 'fail'}`}>
                                                        {d.hiringVerdict}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>{d.overallScore}/100</strong>
                                                </td>
                                                <td>
                                                    {clearedCount} of {(d.rounds || []).length} rounds
                                                </td>
                                                <td>
                                                    {new Date(d.createdAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/placement-drives/runner/${d._id}`}
                                                        className="drives-table-link"
                                                    >
                                                        {d.status === 'Completed' ? 'View Placement Dossier →' : 'Resume Drive →'}
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlacementDrivesHub;
