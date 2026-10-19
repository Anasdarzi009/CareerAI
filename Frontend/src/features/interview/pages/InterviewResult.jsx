import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getInterviewAttemptById } from '../services/interviewExecution.api';
import '../style/interview.scss';

const InterviewResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQIndex, setExpandedQIndex] = useState(0);

    useEffect(() => {
        const fetchAttempt = async () => {
            setLoading(true);
            try {
                const data = await getInterviewAttemptById(id);
                setAttempt(data.attempt);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load interview results.');
            } finally {
                setLoading(false);
            }
        };
        fetchAttempt();
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
                <p>Generating evidence-based interview evaluation report...</p>
            </div>
        );
    }

    if (error || !attempt) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#fca5a5' }}>
                <h3>Unable to load interview result</h3>
                <p>{error || 'Session not found.'}</p>
                <button
                    type="button"
                    onClick={() => navigate('/interview-round')}
                    style={{ marginTop: '1rem', background: '#27272a', border: '1px solid #3f3f46', color: '#f4f4f5', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Return to Interview Round Hub
                </button>
            </div>
        );
    }

    const overallScore = attempt.overallScore || 0;
    const voiceScore = attempt.voiceScore || 0;
    const contentScore = attempt.contentScore || 0;
    const videoScore = attempt.videoScore || 0;

    const voiceSummary = attempt.voiceSummary || {};
    const contentSummary = attempt.contentSummary || {};
    const videoSummary = attempt.videoSummary || {};

    const questions = attempt.questions || [];
    const answeredCount = questions.filter(q => q.candidateAnswer && !q.isSkipped).length;
    const skippedCount = questions.filter(q => q.isSkipped).length;

    return (
        <div className="interview-result-view" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #27272a', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: attempt.status === 'terminated_due_to_violation' ? '#ef4444' : '#4ade80', background: attempt.status === 'terminated_due_to_violation' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)', padding: '0.25rem 0.65rem', borderRadius: '9999px', marginBottom: '0.5rem' }}>
                        {attempt.status === 'terminated_due_to_violation' ? '⚠️ Session Terminated (Integrity Violation)' : '✓ Evaluation Finalized • Evidence-Based Diagnostic'}
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f4f4f5', margin: 0 }}>
                        {attempt.role} Mock Interview Report
                    </h1>
                    <span style={{ fontSize: '0.825rem', color: '#71717a' }}>
                        {attempt.interviewType} Round • {attempt.difficulty} Level • Completed on {new Date(attempt.completedAt || attempt.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/interview-round')}
                        style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '6px', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        ← Back to Hub
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/placement-readiness')}
                        style={{ background: '#ec4899', border: 'none', color: '#ffffff', borderRadius: '6px', padding: '0.5rem 1.15rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                        View Placement Readiness →
                    </button>
                </div>
            </header>

            {/* Violation Alert Banner if Session Terminated */}
            {attempt.status === 'terminated_due_to_violation' && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    <div>
                        <strong style={{ color: '#ef4444', display: 'block', fontSize: '0.9rem' }}>
                            Interview Terminated Early
                        </strong>
                        <span style={{ color: '#fca5a5', fontSize: '0.8rem' }}>
                            {attempt.terminationReason || 'A browser tab switch or workspace loss was detected. Answer scores and evidence recorded up to the violation event have been preserved.'}
                        </span>
                    </div>
                </div>
            )}

            {/* Score Showcase Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {/* Overall Score */}
                <div style={{ background: '#141416', border: '1px solid #ec4899', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: 700, textTransform: 'uppercase' }}>Overall Rating</span>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: overallScore >= 75 ? '#4ade80' : (overallScore >= 50 ? '#facc15' : '#f87171'), lineHeight: 1 }}>
                        {overallScore}<span style={{ fontSize: '1.1rem', color: '#71717a' }}>/100</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                        {overallScore >= 80 ? 'Placement Bar-Raiser' : (overallScore >= 65 ? 'Competitive Candidate' : 'Requires Additional Practice')}
                    </span>
                </div>

                {/* Content Score */}
                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Content &amp; Technical (50%)</span>
                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>
                        {contentScore}<span style={{ fontSize: '1.1rem', color: '#71717a' }}>/100</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                        Correctness: {contentSummary.averageCorrectness || contentScore}% • Relevance: {contentSummary.averageRelevance || 80}%
                    </span>
                </div>

                {/* Voice Score */}
                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase' }}>Voice &amp; Fluency (30%)</span>
                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>
                        {voiceScore}<span style={{ fontSize: '1.1rem', color: '#71717a' }}>/100</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                        Speed: {voiceSummary.averageWpm || 0} WPM • {voiceSummary.totalFillers || 0} Fillers
                    </span>
                </div>

                {/* Video Score */}
                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase' }}>Video Presentation ({attempt.hasVideo ? '20%' : 'N/A'})</span>
                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: attempt.hasVideo ? '#4ade80' : '#71717a', lineHeight: 1 }}>
                        {attempt.hasVideo ? `${videoScore}` : 'Off'}<span style={{ fontSize: '1.1rem', color: '#71717a' }}>{attempt.hasVideo ? '/100' : ''}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                        {attempt.hasVideo ? `Eye Contact: ${videoSummary.averageEyeContact || 0}% • Stability: ${videoSummary.averageHeadStability || 0}%` : 'Voice & Content rebalanced to 100%'}
                    </span>
                </div>
            </div>

            {/* Diagnostic Breakdown: Voice, Content, Video Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Voice Diagnostics */}
                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f4f4f5', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🎙 Voice &amp; Communication Analytics
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Speaking Speed:</span>
                            <strong style={{ color: '#f4f4f5' }}>{voiceSummary.averageWpm || 0} WPM (Target: 120-160 WPM)</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Total Verbal Fillers:</span>
                            <strong style={{ color: (voiceSummary.totalFillers || 0) > 4 ? '#f87171' : '#4ade80' }}>
                                {voiceSummary.totalFillers || 0} detected
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Pause Intervals:</span>
                            <strong style={{ color: '#f4f4f5' }}>{voiceSummary.totalPauses || 0} natural pause(s)</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Fluency Assessment:</span>
                            <strong style={{ color: '#a855f7' }}>{voiceSummary.fluencyRating || 'Normal'}</strong>
                        </div>
                    </div>
                </div>

                {/* Content Diagnostics */}
                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f4f4f5', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🧠 Technical &amp; Content Correctness
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Technical Accuracy:</span>
                            <strong style={{ color: '#f4f4f5' }}>{contentSummary.averageCorrectness || contentScore}%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Question Relevance:</span>
                            <strong style={{ color: '#f4f4f5' }}>{contentSummary.averageRelevance || 80}%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Concept Completeness:</span>
                            <strong style={{ color: '#f4f4f5' }}>{contentSummary.averageCompleteness || 75}%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Questions Answered:</span>
                            <strong style={{ color: '#4ade80' }}>{answeredCount} of {questions.length} ({skippedCount} skipped)</strong>
                        </div>
                    </div>
                </div>

                {/* Strengths & Recommendations */}
                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f4f4f5', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🎯 Actionable Recommendations
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#d4d4d8', lineHeight: 1.5 }}>
                        {(attempt.recommendations || []).map((rec, i) => (
                            <li key={i}>{rec}</li>
                        ))}
                    </ul>
                </div>

                {/* Interview Integrity & Monitoring */}
                <div style={{ background: '#141416', border: `1px solid ${attempt.status === 'terminated_due_to_violation' ? '#ef4444' : '#27272a'}`, borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f4f4f5', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🔒 Interview Integrity &amp; Monitoring
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Monitoring Status:</span>
                            <strong style={{ color: attempt.status === 'terminated_due_to_violation' ? '#ef4444' : '#4ade80' }}>
                                {attempt.status === 'terminated_due_to_violation' ? 'Terminated (Violation)' : 'Clean Session'}
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Tab Switches Detected:</span>
                            <strong style={{ color: (attempt.tabSwitchCount || 0) > 0 ? '#ef4444' : '#4ade80' }}>
                                {attempt.tabSwitchCount || 0}
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Window Focus Losses:</span>
                            <strong style={{ color: (attempt.focusLossCount || 0) > 0 ? '#facc15' : '#4ade80' }}>
                                {attempt.focusLossCount || 0}
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Total Monitored Incidents:</span>
                            <strong style={{ color: (attempt.monitoringEvents?.length || 0) > 0 ? '#facc15' : '#4ade80' }}>
                                {(attempt.monitoringEvents?.length || 0) === 0 ? '0 (No violations detected)' : `${attempt.monitoringEvents?.length} events recorded`}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Question-by-Question Detailed Review */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                    QUESTION-BY-QUESTION EVALUATION
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {questions.map((q, idx) => {
                        const isExpanded = expandedQIndex === idx;
                        const vm = q.voiceMetrics || {};
                        const cm = q.contentMetrics || {};

                        return (
                            <div key={idx} style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', overflow: 'hidden' }}>
                                {/* Trigger Bar */}
                                <div
                                    onClick={() => setExpandedQIndex(isExpanded ? -1 : idx)}
                                    style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? '#18181b' : 'transparent' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                            Q{idx + 1}
                                        </span>
                                        <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: '#f4f4f5', margin: 0 }}>
                                            {q.questionText}
                                        </h4>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: q.questionScore >= 70 ? '#4ade80' : '#facc15' }}>
                                            {q.isSkipped ? 'Skipped' : `${q.questionScore}/100`}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: '#71717a' }}>{isExpanded ? '▲' : '▼'}</span>
                                    </div>
                                </div>

                                {/* Expanded Answer Details */}
                                {isExpanded && (
                                    <div style={{ padding: '1.25rem', borderTop: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {/* Transcript */}
                                        <div>
                                            <span style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Candidate Verbatim Transcript:
                                            </span>
                                            <p style={{ margin: '0.35rem 0 0 0', background: '#09090b', border: '1px solid #27272a', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.85rem', color: q.candidateAnswer ? '#f4f4f5' : '#71717a', lineHeight: 1.5, fontStyle: q.candidateAnswer ? 'normal' : 'italic' }}>
                                                {q.candidateAnswer ? `"${q.candidateAnswer}"` : 'No verbal answer recorded.'}
                                            </p>
                                        </div>

                                        {/* Metrics Row */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                                            <div style={{ background: '#09090b', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #27272a' }}>
                                                <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block' }}>Technical Correctness</span>
                                                <strong style={{ fontSize: '0.95rem', color: '#38bdf8' }}>{cm.technicalCorrectness || 0}%</strong>
                                            </div>
                                            <div style={{ background: '#09090b', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #27272a' }}>
                                                <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block' }}>Speaking Rate</span>
                                                <strong style={{ fontSize: '0.95rem', color: '#a855f7' }}>{vm.wpm || 0} WPM</strong>
                                            </div>
                                            <div style={{ background: '#09090b', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #27272a' }}>
                                                <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block' }}>Verbal Fillers</span>
                                                <strong style={{ fontSize: '0.95rem', color: '#facc15' }}>{vm.fillerCount || 0} detected</strong>
                                            </div>
                                            <div style={{ background: '#09090b', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #27272a' }}>
                                                <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block' }}>Answer Duration</span>
                                                <strong style={{ fontSize: '0.95rem', color: '#4ade80' }}>{q.audioDurationSeconds || 0}s</strong>
                                            </div>
                                        </div>

                                        {/* Evaluator Feedback */}
                                        {q.feedback && (
                                            <div style={{ background: '#1c1917', border: '1px solid #44403c', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#f5d0fe' }}>
                                                💡 <strong>AI Feedback:</strong> {q.feedback}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default InterviewResult;
