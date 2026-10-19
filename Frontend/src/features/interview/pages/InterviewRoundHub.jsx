import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
    startMockInterview,
    getInterviewHistory,
    getInterviewStats
} from '../services/interviewExecution.api';
import '../style/home.scss';

const InterviewRoundHub = () => {
    const navigate = useNavigate();

    // Setup configuration
    const [interviewType, setInterviewType] = useState('Technical');
    const [role, setRole] = useState('Full Stack Developer');
    const [difficulty, setDifficulty] = useState('Mid');
    const [hasVideo, setHasVideo] = useState(true);
    const [questionCount, setQuestionCount] = useState(5);
    const [isStarting, setIsStarting] = useState(false);

    // Data state
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const [statsRes, historyRes] = await Promise.all([
                getInterviewStats(),
                getInterviewHistory()
            ]);
            setStats(statsRes.stats);
            setHistory(historyRes.attempts || []);
        } catch (err) {
            console.error('Error fetching interview data:', err);
            setFetchError('Unable to load candidate interview sessions. Please retry.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleStartInterview = async (overrideType) => {
        setIsStarting(true);
        try {
            const res = await startMockInterview({
                interviewType: overrideType || interviewType,
                role,
                difficulty,
                hasVideo,
                questionCount: +questionCount
            });
            navigate(`/interview-round/runner/${res.attempt._id}`);
        } catch (err) {
            console.error('Start interview error:', err);
            alert('Failed to initialize mock interview: ' + (err.response?.data?.message || err.message));
            setIsStarting(false);
        }
    };

    const executionTemplates = [
        {
            type: 'Technical',
            title: 'Technical Problem-Solving & Architecture Round',
            durationMinutes: 45,
            desc: 'Simulate high-stakes live technical screening evaluating system architecture, algorithm trade-offs, and debugging methodology.',
            badge: 'TECHNICAL SCREENING'
        },
        {
            type: 'Behavioral',
            title: 'Behavioral & Leadership Evaluation (STAR Framework)',
            durationMinutes: 30,
            desc: 'Live situational round evaluating leadership, conflict resolution, ambiguity handling, and communication impact.',
            badge: 'HR / CULTURE FIT'
        },
        {
            type: 'Mixed',
            title: 'Full Corporate Placement Mock Interview',
            durationMinutes: 60,
            desc: 'Complete multi-competency placement interview simulating final round campus hiring bar-raisers.',
            badge: 'BAR-RAISER SIMULATION'
        }
    ];

    return (
        <div className="interview-round-hub" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Header */}
            <header className="hub-header" style={{ borderBottom: '1px solid #27272a', paddingBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.25)', padding: '0.25rem 0.65rem', borderRadius: '9999px', width: 'fit-content' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ec4899' }}></span>
                    Screening Stage 03 • Live Mock Interview Execution
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f4f4f5', margin: 0 }}>INTERVIEW ROUND</h1>
                <p style={{ fontSize: '0.925rem', color: '#a1a1aa', margin: 0, maxWidth: '800px', lineHeight: 1.5 }}>
                    Execute full interactive mock interviews using your microphone and webcam. Answer live technical &amp; behavioral questions under timed pressure and receive an evidence-based diagnostic evaluation.
                </p>
                <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '6px', padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#d4d4d8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <span>
                        💡 <strong>Looking for preparation planning?</strong> To analyze a specific job description and generate customized question roadmaps, visit <strong style={{ color: '#ec4899', cursor: 'pointer' }} onClick={() => navigate('/interview-prep')}>Interview Preparation</strong>.
                    </span>
                    <button
                        type="button"
                        style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '4px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer' }}
                        onClick={() => navigate('/interview-prep')}
                    >
                        Go to Interview Preparation →
                    </button>
                </div>
            </header>

            {/* Performance Metric Counters (Real Candidate Data Only) */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase' }}>Best Rating</span>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, color: (stats?.bestScore || 0) >= 75 ? '#4ade80' : '#f4f4f5' }}>
                        {stats?.hasData ? `${stats.bestScore}/100` : '—'}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                        {stats?.hasData ? 'Highest evaluated performance' : 'No attempts recorded'}
                    </span>
                </div>

                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase' }}>Average Score</span>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, color: (stats?.averageScore || 0) >= 70 ? '#4ade80' : '#facc15' }}>
                        {stats?.hasData ? `${stats.averageScore}%` : '—'}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                        {stats?.hasData ? `Across ${stats.totalInterviews} session(s)` : 'Awaiting baseline'}
                    </span>
                </div>

                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase' }}>Technical Depth</span>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#38bdf8' }}>
                        {stats?.hasData ? `${stats.contentPerformance}%` : '—'}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                        {stats?.hasData ? 'Content accuracy & relevance' : 'No evaluated answers'}
                    </span>
                </div>

                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase' }}>Voice Fluency</span>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#a855f7' }}>
                        {stats?.hasData ? `${stats.voicePerformance}%` : '—'}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                        {stats?.hasData ? 'Cadence, speed & filler control' : 'No audio recorded'}
                    </span>
                </div>
            </section>

            {/* Custom Interview Launch Configuration Card */}
            <section style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                            CONFIGURED MOCK INTERVIEW SIMULATOR
                        </h3>
                        <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                            Customize role, difficulty, and interview type before launching your session.
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleStartInterview()}
                        disabled={isStarting}
                        style={{
                            background: '#ec4899',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '6px',
                            padding: '0.6rem 1.5rem',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            cursor: isStarting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isStarting ? 'Setting up session...' : 'Start Mock Interview Now →'}
                    </button>
                </div>

                {/* Configuration Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #27272a' }}>
                    {/* Role */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa' }}>Target Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#f4f4f5', padding: '0.5rem', fontSize: '0.825rem', outline: 'none' }}
                        >
                            <option value="Full Stack Developer">Full Stack Developer</option>
                            <option value="Frontend Engineer">Frontend Engineer</option>
                            <option value="Backend Engineer">Backend Engineer</option>
                            <option value="Data Analyst">Data Analyst</option>
                            <option value="Cloud / DevOps">Cloud / DevOps</option>
                            <option value="General">General Software Engineer</option>
                        </select>
                    </div>

                    {/* Type */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa' }}>Interview Type</label>
                        <select
                            value={interviewType}
                            onChange={(e) => setInterviewType(e.target.value)}
                            style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#f4f4f5', padding: '0.5rem', fontSize: '0.825rem', outline: 'none' }}
                        >
                            <option value="Technical">Technical Round (Architecture &amp; Coding)</option>
                            <option value="Behavioral">Behavioral Round (STAR Method)</option>
                            <option value="HR">HR &amp; Culture Fit Round</option>
                            <option value="Mixed">Mixed Full Placement Simulation</option>
                        </select>
                    </div>

                    {/* Difficulty */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa' }}>Seniority Tier</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '6px', color: '#f4f4f5', padding: '0.5rem', fontSize: '0.825rem', outline: 'none' }}
                        >
                            <option value="Entry">Entry Level / Campus Fresher</option>
                            <option value="Mid">Mid-Level (1-3 yrs experience)</option>
                            <option value="Senior">Senior / Corporate Bar-Raiser</option>
                        </select>
                    </div>

                    {/* Video Toggle */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa' }}>Webcam Tracking</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#f4f4f5', cursor: 'pointer', height: '100%' }}>
                            <input
                                type="checkbox"
                                checked={hasVideo}
                                onChange={(e) => setHasVideo(e.target.checked)}
                                style={{ accentColor: '#ec4899', width: '16px', height: '16px' }}
                            />
                            Enable Eye Contact &amp; Presentation Analysis
                        </label>
                    </div>
                </div>
            </section>

            {/* Presets Grid */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                    POPULAR MOCK INTERVIEW TRACKS
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {executionTemplates.map((tmpl, idx) => (
                        <div key={idx} style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.685rem', fontWeight: 700, color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                    {tmpl.badge}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>⏱ {tmpl.durationMinutes} mins</span>
                            </div>

                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', margin: 0, lineHeight: 1.3 }}>{tmpl.title}</h4>
                            <p style={{ fontSize: '0.825rem', color: '#a1a1aa', margin: 0, flex: 1, lineHeight: 1.45 }}>{tmpl.desc}</p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #27272a' }}>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Voice + Video Enabled</span>
                                <button
                                    type="button"
                                    style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '6px', padding: '0.4rem 0.95rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                    onClick={() => handleStartInterview(tmpl.type)}
                                >
                                    Launch Track →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Candidate Mock Interview Sessions History */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                    YOUR COMPLETED MOCK INTERVIEWS
                </h3>

                {loading ? (
                    <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', color: '#a1a1aa', fontSize: '0.85rem' }}>
                        Loading candidate interview sessions...
                    </div>
                ) : fetchError ? (
                    <div style={{ background: '#1c1417', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '1rem 1.25rem', color: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem' }}>{fetchError}</span>
                        <button
                            type="button"
                            onClick={loadData}
                            style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '4px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                            Retry
                        </button>
                    </div>
                ) : history && history.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {history.map((att) => (
                            <div key={att._id} style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f4f4f5', margin: 0 }}>
                                            {att.role} ({att.interviewType} Round)
                                        </h4>
                                        <span style={{ fontSize: '0.7rem', color: att.status === 'Completed' ? '#4ade80' : '#facc15', background: att.status === 'Completed' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(250, 204, 21, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                            {att.status}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                                        Score: <strong style={{ color: (att.overallScore || 0) >= 70 ? '#4ade80' : '#facc15' }}>{att.overallScore || 0}/100</strong> • Voice: {att.voiceScore || 0}% • Content: {att.contentScore || 0}% • {new Date(att.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {att.status === 'Completed' ? (
                                        <button
                                            type="button"
                                            style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#f4f4f5', borderRadius: '6px', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                            onClick={() => navigate(`/interview-round/result/${att._id}`)}
                                        >
                                            View Diagnostic Report →
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            style={{ background: '#ec4899', border: 'none', color: '#ffffff', borderRadius: '6px', padding: '0.45rem 1rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                            onClick={() => navigate(`/interview-round/runner/${att._id}`)}
                                        >
                                            Resume Session →
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ background: '#141416', border: '1px dashed #27272a', borderRadius: '8px', padding: '2.5rem 1.5rem', textAlign: 'center', color: '#71717a' }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#d4d4d8', fontWeight: 600 }}>
                            No interview attempts recorded yet.
                        </p>
                        <p style={{ margin: 0, fontSize: '0.8rem' }}>
                            Select a target role and click "Start Mock Interview Now" above to experience your first live simulated interview.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default InterviewRoundHub;
