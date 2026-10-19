import React from 'react';

const AptitudeTimer = ({ secondsRemaining }) => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;

    const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const isUrgent = secondsRemaining <= 120; // 2 mins or less
    const isCritical = secondsRemaining <= 30; // 30s or less

    return (
        <div className={`aptitude-timer ${isCritical ? 'aptitude-timer--critical' : isUrgent ? 'aptitude-timer--urgent' : ''}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <div className="aptitude-timer-content">
                <span className="aptitude-timer-label">Time Remaining</span>
                <span className="aptitude-timer-digits">{formattedTime}</span>
            </div>
        </div>
    );
};

export default AptitudeTimer;
