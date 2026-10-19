import React from 'react';
import { Link } from 'react-router';

const CurrentPosition = ({ currentPosition = {} }) => {
    const {
        profileComplete = false,
        resumeUploaded = false,
        totalSkillsCount = 0,
        skillCoverage = 0,
        projectsCount = 0,
        experienceCount = 0,
        interviewPlansCount = 0
    } = currentPosition;

    return (
        <section className="current-position">
            <div className="current-position__header">
                <div className="current-position__title-group">
                    <span className="current-position__tag">REAL DATA AUDIT</span>
                    <h2 className="current-position__title">CURRENT POSITION</h2>
                </div>
                <span className="current-position__subtitle">
                    Live candidate baseline audited directly from your Candidate Profile, Resume & Skill Gap Analysis.
                </span>
            </div>

            <div className="current-position__grid">
                {/* Profile Completeness */}
                <div className="current-position__item">
                    <div className="current-position__item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                    <div className="current-position__item-body">
                        <span className="current-position__item-label">Profile</span>
                        <div className="current-position__item-status">
                            {profileComplete ? (
                                <span className="status-badge status-badge--success">✓ Complete</span>
                            ) : (
                                <span className="status-badge status-badge--warning">⚠ Incomplete</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resume Uploaded */}
                <div className="current-position__item">
                    <div className="current-position__item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                    </div>
                    <div className="current-position__item-body">
                        <span className="current-position__item-label">Resume</span>
                        <div className="current-position__item-status">
                            {resumeUploaded ? (
                                <span className="status-badge status-badge--success">✓ Uploaded</span>
                            ) : (
                                <span className="status-badge status-badge--warning">⚠ Missing</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Skills Identified */}
                <div className="current-position__item">
                    <div className="current-position__item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                    </div>
                    <div className="current-position__item-body">
                        <span className="current-position__item-label">Skills</span>
                        <span className="current-position__item-value">{totalSkillsCount} identified</span>
                    </div>
                </div>

                {/* Skill Coverage */}
                <div className="current-position__item">
                    <div className="current-position__item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                    </div>
                    <div className="current-position__item-body">
                        <span className="current-position__item-label">Skill Coverage</span>
                        <span className="current-position__item-value current-position__item-value--highlight">
                            {skillCoverage}%
                        </span>
                    </div>
                </div>

                {/* Projects */}
                <div className="current-position__item">
                    <div className="current-position__item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <div className="current-position__item-body">
                        <span className="current-position__item-label">Projects</span>
                        <span className="current-position__item-value">{projectsCount} documented</span>
                    </div>
                </div>

                {/* Experience */}
                <div className="current-position__item">
                    <div className="current-position__item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                    </div>
                    <div className="current-position__item-body">
                        <span className="current-position__item-label">Experience</span>
                        <span className="current-position__item-value">{experienceCount} entry</span>
                    </div>
                </div>

                {/* Interview Preparation */}
                <div className="current-position__item">
                    <div className="current-position__item-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <div className="current-position__item-body">
                        <span className="current-position__item-label">Interview Preparation</span>
                        <span className="current-position__item-value">{interviewPlansCount} plans</span>
                    </div>
                </div>
            </div>

            {(!profileComplete || !resumeUploaded) && (
                <div className="current-position__notice">
                    <span className="current-position__notice-text">
                        Your baseline profile is incomplete. Completing personal academics and uploading your resume will unlock personalized interview benchmarking and ATS scoring.
                    </span>
                    <Link to="/resume-profile" className="roadmap-link-btn">
                        Update Resume & Profile →
                    </Link>
                </div>
            )}
        </section>
    );
};

export default CurrentPosition;
