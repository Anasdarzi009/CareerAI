import React, { useState, useEffect } from 'react';

const AssessmentTimer = ({ startedAt, durationMinutes = 60, onTimeUp }) => {
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);

    useEffect(() => {
        if (!startedAt) return;

        const startTime = new Date(startedAt).getTime();
        const totalDurationMs = durationMinutes * 60 * 1000;
        const endTime = startTime + totalDurationMs;

        const updateTimer = () => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeftSeconds(0);
                if (onTimeUp) onTimeUp();
            } else {
                setTimeLeftSeconds(Math.floor(diff / 1000));
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startedAt, durationMinutes, onTimeUp]);

    const minutes = Math.floor(timeLeftSeconds / 60);
    const seconds = timeLeftSeconds % 60;
    const isUrgent = timeLeftSeconds < 300 && timeLeftSeconds > 0; // less than 5 mins

    const formatNumber = (num) => String(num).padStart(2, '0');

    return (
        <div className={`coding-assessment-timer ${isUrgent ? 'coding-assessment-timer--urgent' : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="coding-timer-digits">
                {formatNumber(minutes)}:{formatNumber(seconds)}
            </span>
            <span className="coding-timer-label">remaining</span>
        </div>
    );
};

export default AssessmentTimer;
