import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAptitude } from '../hooks/useAptitude';
import AptitudeQuestion from '../components/AptitudeQuestion';
import '../style/aptitude.scss';

const AptitudePractice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        currentQuestion,
        currentAttempt,
        loading,
        error,
        fetchQuestion,
        answerQuestion,
        isSubmittingAnswer
    } = useAptitude();

    useEffect(() => {
        if (id) {
            fetchQuestion(id);
        }
    }, [id, fetchQuestion]);

    const handleSubmitAnswer = async (selectedOptionIndex, timeSpentSeconds) => {
        if (!id) return;
        await answerQuestion(id, selectedOptionIndex, timeSpentSeconds);
    };

    return (
        <div className="aptitude-practice-page">
            {/* Context bar */}
            <div className="practice-top-bar">
                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate('/aptitude')}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Return to Aptitude Practice Hub
                </button>

                <div className="practice-mode-label">
                    <span>Focused Practice Mode</span>
                </div>
            </div>

            {loading ? (
                <div className="practice-loading-state">
                    <p>Loading question specifications from server...</p>
                </div>
            ) : error ? (
                <div className="practice-error-state">
                    <p>⚠ {error}</p>
                    <button
                        type="button"
                        className="aptitude-btn aptitude-btn--secondary"
                        onClick={() => navigate('/aptitude')}
                    >
                        Back to Questions
                    </button>
                </div>
            ) : currentQuestion ? (
                <main className="practice-main-stage">
                    <AptitudeQuestion
                        question={currentQuestion}
                        existingAttempt={currentAttempt}
                        onSubmitAnswer={handleSubmitAnswer}
                        isSubmitting={isSubmittingAnswer}
                    />
                </main>
            ) : null}
        </div>
    );
};

export default AptitudePractice;
