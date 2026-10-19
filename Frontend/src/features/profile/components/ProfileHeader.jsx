import React from 'react'

export const ProfileHeader = ({ completeness, onNavigateTab }) => {
    const score = completeness?.score ?? 0
    const recommendation = completeness?.recommendation

    return (
        <div className="profile-header">
            <div className="profile-header-left">
                <span className="profile-eyebrow">CANDIDATE PROFILE</span>
                <h1 className="profile-title">Build your CareerAI profile</h1>
                <p className="profile-subtitle">
                    Keep your academic background, skills, experience and resume in one place so CareerAI can personalize your preparation.
                </p>
            </div>

            <div className="profile-completeness-card">
                <div className="completeness-top">
                    <span className="completeness-label">PROFILE COMPLETENESS</span>
                    <span className="completeness-score">{score}%</span>
                </div>

                {/* Linear progress bar */}
                <div className="completeness-bar-track">
                    <div
                        className="completeness-bar-fill"
                        style={{ width: `${score}%` }}
                    />
                </div>

                {/* Recommendation pill */}
                {recommendation && (
                    <div className="completeness-recommendation">
                        <span className="rec-text">Next: <strong>{recommendation.text}</strong></span>
                        {recommendation.targetTab && (
                            <button
                                type="button"
                                className="rec-btn"
                                onClick={() => onNavigateTab(recommendation.targetTab)}
                            >
                                Jump →
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileHeader
