import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useMockInterview } from '../hooks/useMockInterview';
import { verifyInterviewPhrase, TARGET_PHRASE } from '../services/phraseVerification';
import '../style/interview.scss';

const InterviewRoundRunner = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        attempt,
        loading,
        error,
        currentQuestionIndex,
        currentQuestion,
        isRecording,
        liveTranscript,
        audioDuration,
        audioLevel,
        micStatus,
        cameraStatus,
        videoMetrics,
        monitoringEvents,
        isTerminated,
        terminationReason,
        isSubmitting,
        isSpeakingQuestion,
        initMedia,
        attachVideoTracker,
        calibrateTracker,
        startRecording,
        stopRecording,
        submitAnswer,
        finishInterview,
        terminateSession,
        speakQuestion,
        armInterviewMonitoring,
        setIsInterviewActive
    } = useMockInterview(id);

    // Multi-stage state machine: 'instructions' | 'readiness' | 'calibrating' | 'interview' | 'terminated'
    const [step, setStep] = useState('instructions');
    const [consentChecked, setConsentChecked] = useState(false);

    // Readiness check states
    const [browserCompat, setBrowserCompat] = useState(false);
    const [micVerified, setMicVerified] = useState(false);
    const [voiceTestStatus, setVoiceTestStatus] = useState('idle'); // 'idle' | 'listening' | 'verifying' | 'verified' | 'rejected'
    const [voiceTestHeard, setVoiceTestHeard] = useState('');
    const [voiceTestError, setVoiceTestError] = useState('');
    const [audioInputDetected, setAudioInputDetected] = useState(false);
    const [mediaReady, setMediaReady] = useState(false);

    const voiceRecognitionRef = useRef(null);

    // Calibration countdown
    const [calibrationTimer, setCalibrationTimer] = useState(3);
    const [calibrationStatus, setCalibrationStatus] = useState('holding'); // 'holding' | 'success' | 'failed'

    const videoRef = useRef(null);
    const calibrationIntervalRef = useRef(null);

    // If session is already terminated or finishes
    useEffect(() => {
        if (isTerminated) {
            setStep('terminated');
        }
    }, [isTerminated]);

    // Check browser compatibility on mount
    useEffect(() => {
        const hasMediaDevices = Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        const hasAudioContext = Boolean(window.AudioContext || window.webkitAudioContext);
        const hasVisibility = typeof document.visibilityState !== 'undefined';
        setBrowserCompat(hasMediaDevices && hasAudioContext && hasVisibility);
    }, []);

    // Attach video stream and Face Landmark tracker to video element
    const setupVideoElement = useCallback((videoEl) => {
        if (!videoEl) return;
        videoRef.current = videoEl;
        if (attempt?.hasVideo && navigator.mediaDevices) {
            initMedia(true).then(stream => {
                videoEl.srcObject = stream;
                attachVideoTracker(videoEl);
                setMediaReady(true);
            }).catch(err => {
                console.warn('Camera stream setup error:', err);
            });
        }
    }, [attempt?.hasVideo, initMedia, attachVideoTracker]);

    // Track audio input activity (sound waves detected by hardware microphone)
    useEffect(() => {
        if (step === 'readiness' && audioLevel > 14) {
            setAudioInputDetected(true);
        }
    }, [step, audioLevel]);

    // Dedicated Pre-Flight Voice Phrase Recognition Test
    const startVoicePhraseTest = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('SpeechRecognition not supported in browser environment.');
            // Fallback: if browser lacks SpeechRecognition, verify via audio input
            setVoiceTestStatus('listening');
            return;
        }

        try {
            if (voiceRecognitionRef.current) {
                try { voiceRecognitionRef.current.abort(); } catch {}
            }

            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = 'en-US';

            setVoiceTestStatus('listening');
            setVoiceTestError('');

            rec.onresult = (event) => {
                let interim = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    interim += event.results[i][0].transcript;
                }
                const text = interim.trim();
                if (!text) return;
                setVoiceTestHeard(text);

                // Strictly evaluate phrase with normalize & anchor keywords
                const verification = verifyInterviewPhrase(text);
                if (verification.valid) {
                    setVoiceTestStatus('verified');
                    setMicVerified(true);
                    setVoiceTestError('');
                    try { rec.stop(); } catch {}
                } else {
                    const words = text.split(/\s+/).filter(Boolean);
                    if (words.length >= 2) {
                        setVoiceTestStatus('rejected');
                        setVoiceTestError(`We heard: "${text}". Please say: "${TARGET_PHRASE}"`);
                    }
                }
            };

            rec.onerror = (err) => {
                console.warn('Voice test recognition error:', err);
                if (err.error === 'not-allowed') {
                    setVoiceTestStatus('rejected');
                    setVoiceTestError('Microphone permission was denied. Please allow microphone access in your browser.');
                }
            };

            rec.start();
            voiceRecognitionRef.current = rec;
        } catch (err) {
            console.warn('Voice phrase recognition start error:', err);
        }
    }, []);

    // Start voice test on entering readiness step, clean up on leave
    useEffect(() => {
        if (step === 'readiness') {
            startVoicePhraseTest();
        } else {
            if (voiceRecognitionRef.current) {
                try { voiceRecognitionRef.current.abort(); } catch {}
            }
        }

        return () => {
            if (voiceRecognitionRef.current) {
                try { voiceRecognitionRef.current.abort(); } catch {}
            }
        };
    }, [step, startVoicePhraseTest]);

    const handleRetryVoiceTest = () => {
        setVoiceTestHeard('');
        setVoiceTestError('');
        setVoiceTestStatus('listening');
        startVoicePhraseTest();
    };

    // Arm interview monitoring immediately when active step starts
    useEffect(() => {
        if (step === 'interview') {
            armInterviewMonitoring();
            setIsInterviewActive(true);
        }
    }, [step, armInterviewMonitoring, setIsInterviewActive]);

    // Calibration step countdown
    useEffect(() => {
        if (step !== 'calibrating') return;

        setCalibrationTimer(3);
        setCalibrationStatus('holding');

        let countdown = 3;
        const intervalId = setInterval(() => {
            countdown -= 1;
            setCalibrationTimer(countdown);

            if (countdown <= 0) {
                clearInterval(intervalId);
                calibrateTracker();
                setCalibrationStatus('success');
                // Automatically transition to monitored interview workspace
                setTimeout(() => {
                    setStep('interview');
                    armInterviewMonitoring();
                    setIsInterviewActive(true);
                }, 800);
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [step, calibrateTracker, armInterviewMonitoring, setIsInterviewActive]);

    // Anti-Cheat: Prevent Copy, Paste, Cut and Context Menu during active interview
    useEffect(() => {
        if (step !== 'interview') return;

        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [step]);

    // Controls
    const handleStartStopSpeaking = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSubmitAndNext = async (isSkipped = false) => {
        try {
            const result = await submitAnswer(isSkipped);
            if (result && result.isLastQuestion) {
                handleFinish();
            }
        } catch (err) {
            console.error('Submit answer error:', err);
        }
    };

    const handleFinish = async () => {
        try {
            await finishInterview();
            navigate(`/interview-round/result/${id}`);
        } catch (err) {
            console.error('Finish interview error:', err);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#a1a1aa' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #27272a', borderTopColor: '#ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                <p>Initializing CareerAI secure mock interview workspace...</p>
            </div>
        );
    }

    if (error || !attempt) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#fca5a5', maxWidth: '600px', margin: '0 auto' }}>
                <h3>Unable to load interview session</h3>
                <p>{error || 'Session not found or access restricted.'}</p>
                <button
                    type="button"
                    onClick={() => navigate('/interview-round')}
                    style={{ marginTop: '1rem', background: '#27272a', border: '1px solid #3f3f46', color: '#f4f4f5', padding: '0.6rem 1.25rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                    Return to Interview Round Hub
                </button>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 5: TERMINATED STATE (VIOLATION)
    // ─────────────────────────────────────────────────────────────────────────
    if (step === 'terminated' || isTerminated) {
        return (
            <div style={{ width: '100%', maxWidth: '750px', margin: '2rem auto', background: '#141416', border: '1px solid #ef4444', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 40px rgba(239, 68, 68, 0.15)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '1.75rem', color: '#ef4444' }}>
                    ⚠️
                </div>

                <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Session Terminated • Integrity Protocol
                    </span>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f4f4f5', margin: '0.4rem 0' }}>
                        Interview Terminated Due to Monitoring Violation
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
                        {terminationReason || 'A browser tab switch or workspace loss was detected during your active interview round.'}
                    </p>
                </div>

                <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '1rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                        <span>Violation Event:</span>
                        <strong style={{ color: '#ef4444' }}>TAB_SWITCH Detected</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                        <span>Policy Enforcement:</span>
                        <span style={{ color: '#f4f4f5' }}>Monitored interview window lost focus</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                        <span>Evidence State:</span>
                        <span style={{ color: '#4ade80' }}>Prior answered questions &amp; telemetry preserved</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => navigate(`/interview-round/result/${id}`)}
                        style={{ background: '#ec4899', border: 'none', color: '#ffffff', padding: '0.75rem 1.75rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        View Evaluation &amp; Incident Report →
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/interview-round')}
                        style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                        Return to Hub
                    </button>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 1: PRE-INTERVIEW INSTRUCTIONS & CONSENT
    // ─────────────────────────────────────────────────────────────────────────
    if (step === 'instructions') {
        return (
            <div style={{ width: '100%', maxWidth: '840px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <header style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px', marginBottom: '0.5rem' }}>
                        CareerAI • AI Mock Interview
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f4f4f5', margin: '0.25rem 0' }}>
                        Welcome to your AI Mock Interview
                    </h1>
                    <p style={{ fontSize: '0.9rem', color: '#a1a1aa', margin: 0 }}>
                        Please review the assessment guidelines and system monitoring rules before starting.
                    </p>
                </header>

                {/* Session Details Banner */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem' }}>
                    <div>
                        <span style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Interview Type</span>
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: '#f4f4f5', marginTop: '0.2rem' }}>{attempt.interviewType} Interview</strong>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Role Domain</span>
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: '#f4f4f5', marginTop: '0.2rem' }}>{attempt.role}</strong>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Difficulty Tier</span>
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: '#f4f4f5', marginTop: '0.2rem' }}>{attempt.difficulty} Tier</strong>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase' }}>Total Questions</span>
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: '#f4f4f5', marginTop: '0.2rem' }}>{attempt.questions?.length || 5} Questions</strong>
                    </div>
                </div>

                {/* Important Rules List */}
                <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                        📋 Monitored Assessment Guidelines
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#d4d4d8', fontSize: '0.875rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><strong>Simulated Experience:</strong> This is an AI-assisted interview simulator. Questions are delivered via audio and text.</li>
                        <li><strong>Spoken Verbal Responses:</strong> Answers must be spoken aloud into your microphone. Your speech will be transcribed in real time.</li>
                        <li><strong>Camera &amp; Visibility:</strong> Keep your camera active and sit upright facing your screen. Video presentation metrics (eye contact, head stability) are derived from observable facial signals.</li>
                        <li><strong>Immutable Transcript:</strong> Real-time transcripts cannot be manually edited or pasted into, preserving speech integrity.</li>
                        <li><strong>Zero External Assistance:</strong> Do not use second monitors, external devices, or search engines.</li>
                        <li style={{ color: '#fca5a5' }}>
                            <strong>Tab Switch Policy:</strong> Switching browser tabs or minimizing the interview window during an active question will <strong>immediately terminate the interview session</strong>.
                        </li>
                    </ul>
                </div>

                {/* Mandatory Consent Box */}
                <div style={{ background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <input
                            type="checkbox"
                            id="consent-check"
                            checked={consentChecked}
                            onChange={(e) => setConsentChecked(e.target.checked)}
                            style={{ marginTop: '0.2rem', width: '18px', height: '18px', accentColor: '#ec4899', cursor: 'pointer' }}
                        />
                        <label htmlFor="consent-check" style={{ fontSize: '0.85rem', color: '#f4f4f5', cursor: 'pointer', lineHeight: 1.4 }}>
                            I understand the interview rules and agree to be monitored during this simulated assessment. I agree that switching browser tabs will terminate the round.
                        </label>
                    </div>

                    {consentChecked && (
                        <div style={{ background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#f4f4f5' }}>
                            🎙️ <strong style={{ color: '#ec4899' }}>Readiness Requirement:</strong> In the next step, you must verbally speak the phrase:
                            <span style={{ display: 'block', color: '#f4f4f5', fontWeight: 700, marginTop: '0.25rem', fontSize: '0.88rem' }}>
                                "{TARGET_PHRASE}."
                            </span>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/interview-round')}
                        style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '0.65rem 1.25rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={!consentChecked}
                        onClick={() => setStep('readiness')}
                        style={{
                            background: consentChecked ? '#ec4899' : '#27272a',
                            border: 'none',
                            color: consentChecked ? '#ffffff' : '#71717a',
                            padding: '0.65rem 1.75rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: consentChecked ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Continue to System Readiness Check →
                    </button>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 2: SYSTEM READINESS CHECK
    // ─────────────────────────────────────────────────────────────────────────
    if (step === 'readiness') {
        const hasSpeechApi = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
        const canCalibrate = browserCompat && (cameraStatus === 'ready' || !attempt.hasVideo) && (hasSpeechApi ? micVerified : (micVerified || audioInputDetected));

        return (
            <div style={{ width: '100%', maxWidth: '960px', margin: '1rem auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <header style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                        Pre-Flight Diagnostics
                    </span>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f4f4f5', margin: '0.2rem 0' }}>
                        INTERVIEW READINESS CHECK
                    </h1>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0 }}>
                        Verify your audio, camera preview, and face alignment before proceeding.
                    </p>
                </header>

                <div className="interview-readiness-grid">
                    {/* Left: Checklist & Test Prompts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* 1. Browser Check */}
                        <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <strong style={{ fontSize: '0.9rem', color: '#f4f4f5', display: 'block' }}>Browser &amp; WebRTC Compatibility</strong>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>MediaDevices, AudioContext, Page Visibility APIs</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: browserCompat ? '#4ade80' : '#ef4444', fontWeight: 700 }}>
                                {browserCompat ? '✓ Compatible' : '✕ Unsupported'}
                            </span>
                        </div>

                        {/* 2. Microphone Test */}
                        <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <strong style={{ fontSize: '0.9rem', color: '#f4f4f5', display: 'block' }}>Microphone Voice Test</strong>
                                    <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Voice phrase verification &amp; audio signal level</span>
                                </div>
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: micVerified ? '#4ade80' : (voiceTestStatus === 'rejected' ? '#ef4444' : '#facc15'),
                                    fontWeight: 700
                                }}>
                                    {micVerified ? '✓ Verified' : (voiceTestStatus === 'rejected' ? '✕ Not Verified' : (voiceTestStatus === 'listening' ? '● Listening...' : 'Waiting for speech...'))}
                                </span>
                            </div>

                            <p style={{ fontSize: '0.85rem', color: '#d4d4d8', margin: 0, lineHeight: 1.5 }}>
                                Please say clearly into your microphone: <strong style={{ color: '#ec4899', display: 'block', fontSize: '0.95rem', marginTop: '0.2rem' }}>"{TARGET_PHRASE}."</strong>
                            </p>

                            {/* Decibel Meter */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#09090b', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Mic Signal:</span>
                                <div style={{ flex: 1, height: '8px', background: '#27272a', borderRadius: '9999px', overflow: 'hidden' }}>
                                    <div style={{ width: `${audioLevel}%`, height: '100%', background: audioLevel > 20 ? '#4ade80' : '#38bdf8', transition: 'width 0.1s ease' }}></div>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: audioInputDetected ? '#4ade80' : '#a1a1aa', minWidth: '40px' }}>
                                    {audioInputDetected ? '✓ Audio Active' : `${audioLevel}%`}
                                </span>
                            </div>

                            {/* Voice Feedback Card */}
                            {micVerified ? (
                                <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', borderRadius: '6px', padding: '0.6rem 0.8rem', fontSize: '0.8rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>✓</span>
                                    <span>Voice phrase verified: <em>"{voiceTestHeard || TARGET_PHRASE}"</em></span>
                                </div>
                            ) : voiceTestStatus === 'rejected' ? (
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', padding: '0.65rem 0.8rem', fontSize: '0.8rem', color: '#f87171', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <div>{voiceTestError || `We heard: "${voiceTestHeard}". Please speak the full phrase.`}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>Please say: "{TARGET_PHRASE}."</span>
                                        <button
                                            type="button"
                                            onClick={handleRetryVoiceTest}
                                            style={{ background: '#27272a', border: '1px solid #ef4444', color: '#f4f4f5', borderRadius: '4px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            ↻ Try Again
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', animation: 'pulse 1.2s infinite' }}></span>
                                    <span>Listening for verification phrase...</span>
                                    {voiceTestHeard && <span style={{ color: '#a1a1aa' }}>(Hearing: "{voiceTestHeard}")</span>}
                                </div>
                            )}
                        </div>

                        {/* 3. Camera Status */}
                        <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <strong style={{ fontSize: '0.9rem', color: '#f4f4f5', display: 'block' }}>Camera Connection &amp; CV Sensor</strong>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Video feed with real-time facial landmark tracking</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: cameraStatus === 'ready' ? '#4ade80' : '#ef4444', fontWeight: 700 }}>
                                {cameraStatus === 'ready' ? '● Connected' : (cameraStatus === 'denied' ? '✕ Denied' : 'Connecting...')}
                            </span>
                        </div>
                    </div>

                    {/* Right: Live Camera Preview & Position Guide */}
                    <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f4f4f5' }}>Camera Feed &amp; Centering</span>
                        <div style={{ width: '100%', height: '240px', background: '#09090b', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <video
                                ref={setupVideoElement}
                                autoPlay
                                playsInline
                                muted
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                            />

                            {/* Centering crosshair / guide overlay */}
                            <div style={{ position: 'absolute', width: '140px', height: '170px', border: `2px dashed ${videoMetrics.centered ? '#4ade80' : '#ec4899'}`, borderRadius: '50%', pointerEvents: 'none', transition: 'border-color 0.2s ease' }}></div>

                            {/* Live Badge */}
                            <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: videoMetrics.faceDetected ? '#4ade80' : '#f87171' }}>
                                {videoMetrics.faceDetected ? '✓ Face In View' : '✕ No Face Detected'}
                            </div>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#a1a1aa', textAlign: 'center' }}>
                            {videoMetrics.faceDetected ? (
                                videoMetrics.centered ? (
                                    <span style={{ color: '#4ade80' }}>✓ Face well centered. Ready for calibration.</span>
                                ) : (
                                    <span style={{ color: '#facc15' }}>Align your face inside the dashed oval.</span>
                                )
                            ) : (
                                <span style={{ color: '#f87171' }}>Position your face directly in front of the camera.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #27272a' }}>
                    <button
                        type="button"
                        onClick={() => setStep('instructions')}
                        style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', padding: '0.65rem 1.25rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                        ← Back
                    </button>
                    <button
                        type="button"
                        disabled={!canCalibrate}
                        onClick={() => setStep('calibrating')}
                        style={{
                            background: canCalibrate ? '#ec4899' : '#27272a',
                            border: 'none',
                            color: canCalibrate ? '#ffffff' : '#71717a',
                            padding: '0.65rem 1.75rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: canCalibrate ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Proceed to Camera Calibration →
                    </button>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 3: FACE & CAMERA CALIBRATION (3 SECONDS)
    // ─────────────────────────────────────────────────────────────────────────
    if (step === 'calibrating') {
        return (
            <div style={{ width: '100%', maxWidth: '640px', margin: '2rem auto', background: '#141416', border: '1px solid #27272a', borderRadius: '12px', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase' }}>
                        Calibration Phase
                    </span>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f4f4f5', margin: '0.25rem 0' }}>
                        Calibrating Face &amp; Eye-Contact Baseline
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: 0 }}>
                        Look directly at the camera and hold steady for 3 seconds.
                    </p>
                </div>

                {/* Video feed container */}
                <div style={{ width: '100%', height: '280px', background: '#09090b', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '2px solid #ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <video
                        ref={setupVideoElement}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />

                    {/* Countdown Overlay */}
                    <div style={{ position: 'absolute', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.75)', border: '3px solid #ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', backdropFilter: 'blur(6px)' }}>
                        {calibrationTimer > 0 ? calibrationTimer : '✓'}
                    </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#f4f4f5' }}>
                    {calibrationStatus === 'success' ? (
                        <span style={{ color: '#4ade80', fontWeight: 700 }}>✓ Calibration Locked! Launching Monitored Interview...</span>
                    ) : (
                        <span>Hold position... Tracking face orientation &amp; gaze vector.</span>
                    )}
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STAGE 4: ACTIVE MONITORED INTERVIEW RUNNER
    // ─────────────────────────────────────────────────────────────────────────
    const totalQuestions = attempt.questions?.length || 1;
    const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;
    const qNumber = String(currentQuestionIndex + 1).padStart(2, '0');
    const totalQNumber = String(totalQuestions).padStart(2, '0');

    return (
        <div className="interview-runner" style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Top Bar with Security & Progress Status */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', background: '#141416', border: '1px solid #27272a', borderRadius: '8px', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/interview-round')}
                        style={{ background: '#27272a', border: '1px solid #3f3f46', color: '#a1a1aa', borderRadius: '4px', padding: '0.35rem 0.65rem', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                        ← Exit Round
                    </button>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {attempt.interviewType} Round • {attempt.difficulty} Tier
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                🔒 Monitored Session
                            </span>
                        </div>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                            {attempt.role}
                        </h2>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {/* Recording Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: isRecording ? '#ef4444' : '#a1a1aa' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isRecording ? '#ef4444' : '#71717a', animation: isRecording ? 'pulse 1.5s infinite' : 'none' }}></span>
                        <strong>{isRecording ? 'LIVE RECORDING' : 'READY'}</strong>
                    </div>

                    {/* Question progress */}
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                        Question <strong style={{ color: '#f4f4f5' }}>{qNumber}</strong> / {totalQNumber}
                    </div>

                    <button
                        type="button"
                        onClick={handleFinish}
                        disabled={isSubmitting}
                        style={{ background: '#27272a', border: '1px solid #71717a', color: '#f4f4f5', borderRadius: '6px', padding: '0.4rem 0.95rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                        {isSubmitting ? 'Grading...' : 'End & Grade Interview'}
                    </button>
                </div>
            </header>

            {/* Main Workspace (2 Columns) */}
            <div className="interview-active-workspace">
                {/* Left Column: Interviewer Prompt & Immutable Transcript */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Question Prompt Card */}
                    <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    {currentQuestion?.category || 'Technical'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Interviewer Prompt</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => speakQuestion(currentQuestion?.questionText || '')}
                                disabled={isSpeakingQuestion}
                                style={{ background: '#1f1f23', border: '1px solid #27272a', color: isSpeakingQuestion ? '#ec4899' : '#a1a1aa', borderRadius: '6px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                            >
                                🔊 {isSpeakingQuestion ? 'Speaking...' : 'Listen to Question'}
                            </button>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f4f4f5', margin: 0, lineHeight: 1.45 }}>
                            "{currentQuestion?.questionText}"
                        </h3>

                        <p style={{ fontSize: '0.8rem', color: '#71717a', margin: 0 }}>
                            💡 <em>Click "Start Answering", speak clearly into your microphone, then click "Submit Answer". Your spoken words will appear below in real time.</em>
                        </p>
                    </div>

                    {/* Answer & Speech Transcription Area */}
                    <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f4f4f5' }}>Your Verbal Answer</span>
                                {isRecording && (
                                    <span style={{ fontSize: '0.7rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                        Transcribing Speech...
                                    </span>
                                )}
                            </div>

                            <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                                Duration: <strong style={{ color: '#f4f4f5' }}>{audioDuration}s</strong>
                            </div>
                        </div>

                        {/* Real-time Audio Waveform Decibel Meter */}
                        <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: '6px', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#71717a' }}>🎙 Mic Input:</span>
                            <div style={{ flex: 1, height: '8px', background: '#18181b', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        width: `${audioLevel}%`,
                                        height: '100%',
                                        background: audioLevel > 60 ? '#ef4444' : (audioLevel > 20 ? '#22c55e' : '#3b82f6'),
                                        transition: 'width 0.1s ease'
                                    }}
                                ></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#a1a1aa', minWidth: '40px', textAlign: 'right' }}>
                                {audioLevel}%
                            </span>
                        </div>

                        {/* STRICTLY IMMUTABLE REAL-TIME TRANSCRIPT PANEL */}
                        <div
                            className="immutable-transcript-box"
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onDrop={(e) => e.preventDefault()}
                            style={{
                                width: '100%',
                                minHeight: '140px',
                                maxHeight: '220px',
                                overflowY: 'auto',
                                background: '#0d0d10',
                                border: '1px solid #27272a',
                                borderRadius: '6px',
                                padding: '1rem',
                                color: liveTranscript ? '#f4f4f5' : '#71717a',
                                fontSize: '0.875rem',
                                lineHeight: 1.6,
                                fontFamily: 'inherit',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                cursor: 'default'
                            }}
                        >
                            {liveTranscript ? (
                                <span>{liveTranscript}</span>
                            ) : (
                                <span style={{ fontStyle: 'italic', color: '#52525b' }}>
                                    Your spoken words will appear here in real time as you speak.
                                </span>
                            )}
                        </div>

                        {/* Speech Action Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={handleStartStopSpeaking}
                                    style={{
                                        background: isRecording ? '#dc2626' : '#ec4899',
                                        border: 'none',
                                        color: '#ffffff',
                                        borderRadius: '6px',
                                        padding: '0.55rem 1.35rem',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isRecording ? '⏹ Stop Speaking' : '🎙 Start Answering'}
                                </button>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => handleSubmitAndNext(true)}
                                    disabled={isSubmitting}
                                    style={{ background: 'transparent', border: '1px solid #3f3f46', color: '#71717a', borderRadius: '6px', padding: '0.55rem 0.95rem', fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    Skip Question
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSubmitAndNext(false)}
                                    disabled={isSubmitting || (!liveTranscript && !isRecording)}
                                    style={{
                                        background: '#22c55e',
                                        border: 'none',
                                        color: '#000000',
                                        borderRadius: '6px',
                                        padding: '0.55rem 1.35rem',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        cursor: isSubmitting || (!liveTranscript && !isRecording) ? 'not-allowed' : 'pointer',
                                        opacity: (!liveTranscript && !isRecording) ? 0.5 : 1
                                    }}
                                >
                                    {isSubmitting ? 'Evaluating...' : isLastQuestion ? 'Submit & Finalize →' : 'Submit Answer & Next →'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Webcam Preview, Real CV Landmark Overlay & Progression */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Video Camera Preview */}
                    <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f4f4f5' }}>Webcam Presentation</span>
                            <span style={{ fontSize: '0.7rem', color: cameraStatus === 'ready' ? '#4ade80' : '#a1a1aa' }}>
                                {cameraStatus === 'ready' ? '● Camera Active' : 'Camera Disabled'}
                            </span>
                        </div>

                        {/* Video Element */}
                        <div style={{ width: '100%', height: '220px', background: '#09090b', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <video
                                ref={setupVideoElement}
                                autoPlay
                                playsInline
                                muted
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                            />

                            {/* Computer Vision Landmark Tracker Badge */}
                            {attempt.hasVideo && (
                                <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', color: videoMetrics.faceDetected ? '#4ade80' : '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: videoMetrics.faceDetected ? '#4ade80' : '#f87171' }}></span>
                                    {videoMetrics.faceDetected ? (videoMetrics.lookingAtCamera ? 'Gaze Centered' : (videoMetrics.lookingDown ? 'Looking Down' : 'Gaze Shifted')) : 'No Face'}
                                </div>
                            )}

                            {/* Multi-Face Warning */}
                            {videoMetrics.faceCount > 1 && (
                                <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', color: '#ffffff', fontWeight: 700 }}>
                                    Multiple Faces Detected
                                </div>
                            )}
                        </div>

                        {/* Real-time Computer Vision Metrics */}
                        {attempt.hasVideo && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #27272a' }}>
                                <div style={{ background: '#09090b', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block' }}>Eye Contact</span>
                                    <strong style={{ fontSize: '0.9rem', color: videoMetrics.eyeContactPercent >= 70 ? '#4ade80' : (videoMetrics.eyeContactPercent >= 40 ? '#facc15' : '#f87171') }}>
                                        {videoMetrics.eyeContactPercent}%
                                    </strong>
                                </div>
                                <div style={{ background: '#09090b', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.65rem', color: '#71717a', display: 'block' }}>Head Stability</span>
                                    <strong style={{ fontSize: '0.9rem', color: videoMetrics.headStabilityPercent >= 70 ? '#4ade80' : '#f87171' }}>
                                        {videoMetrics.headStabilityPercent}%
                                    </strong>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Monitoring Security Panel */}
                    <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '0.4rem' }}>
                            <span style={{ fontWeight: 700, color: '#f4f4f5' }}>LIVE MONITORING</span>
                            <span style={{ fontSize: '0.65rem', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                                Active
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Camera:</span>
                            <strong style={{ color: cameraStatus === 'ready' ? '#4ade80' : '#ef4444' }}>
                                {cameraStatus === 'ready' ? '● Active' : '✕ Disabled'}
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Face:</span>
                            <strong style={{ color: videoMetrics.faceDetected ? '#4ade80' : '#ef4444' }}>
                                {videoMetrics.faceDetected ? (videoMetrics.faceCount > 1 ? '⚠️ Multiple Faces' : '● Detected') : 'Not Detected'}
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Eye Contact:</span>
                            <strong style={{ color: videoMetrics.eyeContactPercent >= 70 ? '#4ade80' : (videoMetrics.eyeContactPercent >= 40 ? '#facc15' : '#ef4444') }}>
                                {videoMetrics.eyeContactPercent >= 70 ? 'Good' : (videoMetrics.eyeContactPercent >= 40 ? 'Fair' : 'Poor')} ({videoMetrics.eyeContactPercent}%)
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Head Stability:</span>
                            <strong style={{ color: videoMetrics.headStabilityPercent >= 70 ? '#4ade80' : '#ef4444' }}>
                                {videoMetrics.headStabilityPercent >= 70 ? 'Stable' : 'Poor'} ({videoMetrics.headStabilityPercent}%)
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Presentation:</span>
                            <strong style={{ color: videoMetrics.presentationStatus === 'Gaze Centered' ? '#4ade80' : '#facc15' }}>
                                {videoMetrics.presentationStatus}
                            </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', borderTop: '1px solid #1f1f23', paddingTop: '0.4rem' }}>
                            <span>Tab Switch Monitor:</span>
                            <strong style={{ color: '#4ade80' }}>● Armed (Terminating)</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa' }}>
                            <span>Violations Recorded:</span>
                            <strong style={{ color: monitoringEvents.length > 0 ? '#facc15' : '#4ade80' }}>
                                {monitoringEvents.length}
                            </strong>
                        </div>
                    </div>

                    {/* Question Progression List */}
                    <div style={{ background: '#141416', border: '1px solid #27272a', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f4f4f5' }}>Session Questions</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {attempt.questions?.map((q, idx) => {
                                const isCurrent = idx === currentQuestionIndex;
                                const isAnswered = Boolean(q.candidateAnswer);
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '0.6rem 0.75rem',
                                            borderRadius: '6px',
                                            background: isCurrent ? '#1f1f23' : '#0d0d10',
                                            border: `1px solid ${isCurrent ? '#ec4899' : '#27272a'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '0.5rem',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: isAnswered ? '#22c55e' : (isCurrent ? '#ec4899' : '#27272a'), color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                                                {idx + 1}
                                            </span>
                                            <span style={{ color: isCurrent ? '#f4f4f5' : '#a1a1aa', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {q.questionText}
                                            </span>
                                        </div>

                                        <span style={{ fontSize: '0.65rem', color: isAnswered ? '#4ade80' : (isCurrent ? '#ec4899' : '#71717a') }}>
                                            {isAnswered ? 'Answered' : (isCurrent ? 'Current' : 'Pending')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewRoundRunner;
