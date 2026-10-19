import React from 'react';

const DriveRoundNavigator = ({ rounds = [], currentRoundIndex, onSelectRound }) => {
    return (
        <div className="drives-navigator">
            <div className="drives-navigator__track">
                {rounds.map((round, idx) => {
                    const isActive = idx === currentRoundIndex;
                    const isLocked = round.status === 'LOCKED';
                    const isEvaluated = round.status === 'EVALUATED';

                    return (
                        <div
                            key={round.roundNumber}
                            className={`drives-nav-step ${isActive ? 'drives-nav-step--active' : ''} ${isEvaluated ? 'drives-nav-step--done' : ''} ${isLocked ? 'drives-nav-step--locked' : ''}`}
                            onClick={() => {
                                if (!isLocked && onSelectRound) onSelectRound(idx);
                            }}
                            role="button"
                            tabIndex={isLocked ? -1 : 0}
                        >
                            <div className="drives-nav-step__indicator">
                                {isEvaluated ? (
                                    <span className="drives-check-icon">✓</span>
                                ) : (
                                    <span>0{round.roundNumber}</span>
                                )}
                            </div>
                            <div className="drives-nav-step__info">
                                <span className="drives-nav-step__title">
                                    Round {round.roundNumber}: {round.title.split(':')[0]}
                                </span>
                                <div className="drives-nav-step__status">
                                    {isEvaluated ? (
                                        <span className={`drives-round-badge ${round.passed ? 'drives-round-badge--pass' : 'drives-round-badge--review'}`}>
                                            Score: {round.score}%
                                        </span>
                                    ) : isActive ? (
                                        <span className="drives-round-badge drives-round-badge--active">
                                            In Progress ({round.durationMinutes}m)
                                        </span>
                                    ) : (
                                        <span className="drives-round-badge drives-round-badge--locked">
                                            Locked
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DriveRoundNavigator;
