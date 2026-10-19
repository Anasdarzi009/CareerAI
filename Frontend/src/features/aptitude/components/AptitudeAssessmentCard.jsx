import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import * as aptitudeApi from '../services/aptitude.api';

const AptitudeAssessmentCard = ({ assessments = [], onAssessmentCreated }) => {
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);

    const presets = [
        {
            title: 'Campus Corporate Screening Assessment',
            category: 'All Categories',
            durationMinutes: 15,
            questionCount: 10,
            desc: 'Balanced corporate screening simulation covering Quantitative, Logical Reasoning, and Verbal Ability under strict timer constraints.',
            badge: 'RECOMMENDED FIRST ROUND'
        },
        {
            title: 'Quantitative Problem-Solving Sprint',
            category: 'Quantitative Aptitude',
            durationMinutes: 12,
            questionCount: 8,
            desc: 'Targeted assessment testing mathematical agility, speed & distance, percentages, and data interpretation.',
            badge: 'MATH RIGOR'
        },
        {
            title: 'Logical Reasoning & Deductive Challenge',
            category: 'Logical Reasoning',
            durationMinutes: 12,
            questionCount: 8,
            desc: 'Screening round focused on number sequences, deductive syllogisms, seating arrangements, and directional logic.',
            badge: 'ANALYTICAL RIGOR'
        },
        {
            title: 'Verbal Ability & Technical Precision',
            category: 'Verbal Ability',
            durationMinutes: 10,
            questionCount: 8,
            desc: 'Corporate verbal screening covering sentence correction, reading comprehension, and technical vocabulary.',
            badge: 'COMMUNICATION'
        }
    ];

    const handleLaunchPreset = async (preset) => {
        setIsCreating(true);
        try {
            const res = await aptitudeApi.createAptitudeAssessment({
                title: preset.title,
                category: preset.category,
                durationMinutes: preset.durationMinutes,
                questionCount: preset.questionCount
            });

            if (res.success && res.data?.assessment?._id) {
                if (onAssessmentCreated) onAssessmentCreated();
                navigate(`/aptitude/assessment/${res.data.assessment._id}`);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to initialize assessment.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="aptitude-assessments-hub">
            {/* Presets Grid */}
            <div className="assessments-presets-header">
                <h3>LAUNCH CORPORATE TIMED ASSESSMENT</h3>
                <p>Simulate official on-campus screening rounds. Server-side countdown timers, anti-cheat validation, and automated grading.</p>
            </div>

            <div className="presets-cards-grid">
                {presets.map((preset, idx) => (
                    <div key={idx} className="preset-card">
                        <div className="preset-card__top">
                            <span className="preset-badge">{preset.badge}</span>
                            <span className="preset-time">⏱ {preset.durationMinutes} mins</span>
                        </div>

                        <h4 className="preset-card__title">{preset.title}</h4>
                        <p className="preset-card__desc">{preset.desc}</p>

                        <div className="preset-card__footer">
                            <span className="preset-meta">{preset.questionCount} Questions</span>
                            <button
                                type="button"
                                className="aptitude-btn aptitude-btn--primary aptitude-btn--sm"
                                onClick={() => handleLaunchPreset(preset)}
                                disabled={isCreating}
                            >
                                {isCreating ? 'Configuring...' : 'Start Assessment →'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Existing Assessments List */}
            <div className="existing-assessments-section">
                <h3>YOUR TIMED ASSESSMENTS</h3>
                {assessments.length > 0 ? (
                    <div className="assessments-history-list">
                        {assessments.map((a) => {
                            const isCompleted = a.status === 'Completed';
                            const isInProgress = a.status === 'In Progress';

                            return (
                                <div key={a._id} className="assessment-history-item">
                                    <div className="history-item-left">
                                        <div className="history-status-indicator">
                                            <span className={`status-pill status-pill--${a.status?.toLowerCase().replace(' ', '-')}`}>
                                                {a.status}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="history-item-title">{a.title}</h4>
                                            <span className="history-item-meta">
                                                {a.totalQuestions} Questions • {a.durationMinutes} mins • {new Date(a.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="history-item-right">
                                        {isCompleted && (
                                            <div className="history-score-display">
                                                <span className="score-num">{a.overallScore}%</span>
                                                <span className="accuracy-label">{a.accuracy}% accuracy</span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className={`aptitude-btn ${isCompleted ? 'aptitude-btn--secondary' : 'aptitude-btn--primary'} aptitude-btn--sm`}
                                            onClick={() => navigate(`/aptitude/assessment/${a._id}`)}
                                        >
                                            {isCompleted ? 'View Full Report →' : isInProgress ? 'Resume Assessment →' : 'Begin Assessment →'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-assessments-box">
                        <p>No timed corporate assessments started yet. Select a preset above to begin your first round evaluation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AptitudeAssessmentCard;
