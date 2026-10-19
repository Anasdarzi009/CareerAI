import { useState, useEffect, useRef, useCallback } from 'react';
import {
    submitInterviewAnswer,
    finishMockInterview,
    terminateInterviewSession,
    getInterviewAttemptById
} from '../services/interviewExecution.api';
import { FaceLandmarkTracker } from '../services/FaceLandmarkTracker';
import { API_BASE_URL } from '../../../config/api.config';

export const useMockInterview = (attemptId) => {
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');
    const [audioDuration, setAudioDuration] = useState(0);
    const [audioLevel, setAudioLevel] = useState(0); // 0-100 amplitude

    const [micStatus, setMicStatus] = useState('idle'); // 'idle' | 'ready' | 'recording' | 'denied' | 'unsupported'
    const [cameraStatus, setCameraStatus] = useState('idle'); // 'idle' | 'ready' | 'active' | 'denied'

    // Evidence-based computer vision tracking metrics from MediaPipe
    const [videoMetrics, setVideoMetrics] = useState({
        faceDetected: false,
        faceCount: 0,
        centered: false,
        lookingAtCamera: true,
        lookingDown: false,
        lookingAway: false,
        pitch: 0,
        yaw: 0,
        roll: 0,
        eyeContactPercent: 88,
        headStabilityPercent: 92,
        presentationStatus: 'Calibrating...',
        engagementScore: 90,
        nervousnessIndicators: []
    });

    // Integrity & Monitoring Events
    const [monitoringEvents, setMonitoringEvents] = useState([]);
    const [isTerminated, setIsTerminated] = useState(false);
    const [terminationReason, setTerminationReason] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

    // Media & recognition references
    const mediaStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animFrameRef = useRef(null);
    const recognitionRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const trackerRef = useRef(null);
    const monitoringEventsRef = useRef([]);

    // Resilient state refs to prevent stale closure race conditions
    const isInterviewActiveRef = useRef(false);
    const isTerminatedRef = useRef(false);
    const currentQuestionIndexRef = useRef(0);

    useEffect(() => {
        currentQuestionIndexRef.current = currentQuestionIndex;
    }, [currentQuestionIndex]);

    // ── Load Attempt ─────────────────────────────────────────────────────────
    const loadAttempt = useCallback(async () => {
        if (!attemptId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getInterviewAttemptById(attemptId);
            setAttempt(data.attempt);
            setCurrentQuestionIndex(data.attempt.currentQuestionIndex || 0);
            if (data.attempt.status === 'terminated_due_to_violation') {
                setIsTerminated(true);
                isTerminatedRef.current = true;
                setTerminationReason(data.attempt.terminationReason || 'Terminated due to monitoring violation.');
            }
            if (data.attempt.monitoringEvents) {
                setMonitoringEvents(data.attempt.monitoringEvents);
                monitoringEventsRef.current = data.attempt.monitoringEvents;
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load interview attempt.');
        } finally {
            setLoading(false);
        }
    }, [attemptId]);

    useEffect(() => {
        loadAttempt();
    }, [loadAttempt]);

    // ── Media Stream Initialization ──────────────────────────────────────────
    const initMedia = useCallback(async (enableVideo = true) => {
        if (mediaStreamRef.current && mediaStreamRef.current.active) {
            const hasVideoTrack = mediaStreamRef.current.getVideoTracks().length > 0;
            if (!enableVideo || hasVideoTrack) {
                return mediaStreamRef.current;
            }
        }

        try {
            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: enableVideo ? { width: 640, height: 480, facingMode: 'user' } : false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            mediaStreamRef.current = stream;
            setMicStatus('ready');
            if (enableVideo && stream.getVideoTracks().length > 0) {
                setCameraStatus('ready');
            }

            // Web Audio API decibels analyser
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    const ctx = new AudioCtx();
                    audioContextRef.current = ctx;
                    const source = ctx.createMediaStreamSource(stream);
                    const analyser = ctx.createAnalyser();
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    analyserRef.current = analyser;

                    const dataArray = new Uint8Array(analyser.frequencyBinCount);
                    const checkAudio = () => {
                        if (analyserRef.current) {
                            analyserRef.current.getByteFrequencyData(dataArray);
                            let sum = 0;
                            for (let i = 0; i < dataArray.length; i++) {
                                sum += dataArray[i];
                            }
                            const avg = sum / dataArray.length;
                            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
                        }
                        animFrameRef.current = requestAnimationFrame(checkAudio);
                    };
                    checkAudio();
                }
            } catch (audioErr) {
                console.warn('Web Audio decibel analyzer initialized in basic mode:', audioErr);
            }

            return stream;
        } catch (err) {
            console.error('Media stream error:', err);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setMicStatus('denied');
                setCameraStatus('denied');
            } else {
                setMicStatus('unsupported');
            }
            throw err;
        }
    }, []);

    // ── Attach Video Element to MediaPipe FaceLandmarkTracker ─────────────────
    const attachVideoTracker = useCallback((videoElement) => {
        if (!videoElement) return;

        if (trackerRef.current && trackerRef.current.video === videoElement && trackerRef.current.isRunning) {
            return;
        }

        if (trackerRef.current) {
            trackerRef.current.stop();
        }

        const tracker = new FaceLandmarkTracker(videoElement, {
            sampleRateMs: 250, // 4 Hz sampling
            onFrame: (obs) => {
                setVideoMetrics({
                    faceDetected: obs.faceDetected,
                    faceCount: obs.faceCount,
                    centered: obs.centered,
                    lookingAtCamera: obs.lookingAtCamera,
                    lookingDown: obs.lookingDown,
                    lookingAway: obs.lookingAway,
                    pitch: Math.round(obs.pitch || 0),
                    yaw: Math.round(obs.yaw || 0),
                    roll: Math.round(obs.roll || 0),
                    eyeContactPercent: obs.eyeContactPercent,
                    headStabilityPercent: obs.headStabilityPercent,
                    presentationStatus: obs.presentationStatus,
                    engagementScore: obs.faceDetected ? Math.round((obs.eyeContactPercent + obs.headStabilityPercent) / 2) : 0,
                    nervousnessIndicators: obs.nervousnessIndicators
                });
            },
            onViolation: (violation) => {
                // Strictly only record monitoring violations during active interview!
                if (!isInterviewActiveRef.current || isTerminatedRef.current) {
                    return;
                }

                const newEvt = {
                    type: violation.type,
                    timestamp: violation.timestamp,
                    questionIndex: currentQuestionIndexRef.current,
                    durationSeconds: 0,
                    details: violation.details
                };
                monitoringEventsRef.current.push(newEvt);
                setMonitoringEvents([...monitoringEventsRef.current]);
            }
        });

        tracker.start();
        trackerRef.current = tracker;
    }, []);

    const calibrateTracker = useCallback(() => {
        if (trackerRef.current) {
            trackerRef.current.calibrate();
        }
    }, []);

    // ── Speech Recognition Setup ─────────────────────────────────────────────
    const setupSpeechRecognition = useCallback(() => {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            console.warn('Browser speech recognition not supported in this browser.');
            return null;
        }

        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; i++) {
                fullText += event.results[i][0].transcript + ' ';
            }
            setLiveTranscript(fullText.trim());
        };

        recognition.onerror = (event) => {
            console.warn('Speech recognition warning/error:', event.error);
        };

        recognitionRef.current = recognition;
        return recognition;
    }, []);

    // ── Start Answering ──────────────────────────────────────────────────────
    const startRecording = useCallback(() => {
        setLiveTranscript('');
        setAudioDuration(0);
        setIsRecording(true);
        isInterviewActiveRef.current = true;

        if (trackerRef.current) {
            trackerRef.current.resetHistory();
        }

        let rec = recognitionRef.current;
        if (!rec) {
            rec = setupSpeechRecognition();
        }
        if (rec) {
            try {
                rec.start();
            } catch {
                // Already started
            }
        }

        const startTime = Date.now();
        timerIntervalRef.current = setInterval(() => {
            setAudioDuration(Math.round((Date.now() - startTime) / 1000));
        }, 1000);
    }, [setupSpeechRecognition]);

    // ── Stop Answering ───────────────────────────────────────────────────────
    const stopRecording = useCallback(() => {
        setIsRecording(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch {
                // Already stopped
            }
        }
    }, []);

    // ── Terminate Interview on Tab Switch / Violation ─────────────────────────
    const terminateSession = useCallback(async (reason = 'Browser tab/window switch detected.', violationType = 'TAB_SWITCH') => {
        if (!attemptId || isTerminatedRef.current) return;
        isTerminatedRef.current = true;
        isInterviewActiveRef.current = false;
        setIsTerminated(true);
        setTerminationReason(reason);
        stopRecording();

        if (trackerRef.current) {
            trackerRef.current.stop();
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
        }

        const payload = {
            reason,
            violationType,
            monitoringEvents: monitoringEventsRef.current,
            questionIndex: currentQuestionIndexRef.current
        };

        // Resilient fetch with keepalive: true ensures the termination request completes
        // even when the browser tab is hidden or backgrounded by Chromium
        try {
            fetch(`${API_BASE_URL}/api/interview/${attemptId}/terminate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                keepalive: true,
                body: JSON.stringify(payload)
            }).catch(() => {});
        } catch {
            // Keepalive fallback
        }

        try {
            const data = await terminateInterviewSession(attemptId, payload);
            setAttempt(data.attempt);
            return data.attempt;
        } catch (err) {
            console.error('Error terminating interview session:', err);
        }
    }, [attemptId, stopRecording]);

    // ── Page Visibility & Tab Switch Listener ────────────────────────────────
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isInterviewActiveRef.current && !isTerminatedRef.current) {
                console.warn('⚠️ Tab switch detected during active interview. Terminating session.');
                terminateSession('Browser tab/window switch detected during active interview.', 'TAB_SWITCH');
            }
        };

        const handleWindowBlur = () => {
            if (isInterviewActiveRef.current && !isTerminatedRef.current) {
                const blurEvt = {
                    type: 'WINDOW_FOCUS_LOSS',
                    timestamp: new Date().toISOString(),
                    questionIndex: currentQuestionIndexRef.current,
                    durationSeconds: 0,
                    details: 'Window lost focus temporarily.'
                };
                monitoringEventsRef.current.push(blurEvt);
                setMonitoringEvents([...monitoringEventsRef.current]);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [terminateSession]);

    // Arm active state for interview runner
    const armInterviewMonitoring = useCallback(() => {
        isInterviewActiveRef.current = true;
    }, []);

    const setIsInterviewActive = useCallback((active) => {
        isInterviewActiveRef.current = Boolean(active);
    }, []);

    // ── Submit Current Question Answer ───────────────────────────────────────
    const submitAnswer = useCallback(async (isSkipped = false) => {
        if (!attempt || isTerminatedRef.current) return;
        setIsSubmitting(true);
        setError(null);
        try {
            stopRecording();

            const payload = {
                questionIndex: currentQuestionIndex,
                transcript: liveTranscript,
                candidateAnswer: liveTranscript,
                audioDurationSeconds: audioDuration,
                videoMetrics: {
                    hasVideo: attempt.hasVideo,
                    ...videoMetrics
                },
                monitoringEvents: monitoringEventsRef.current,
                isSkipped
            };

            const data = await submitInterviewAnswer(attempt._id, payload);
            setAttempt(prev => {
                if (!prev) return data.attempt;
                const updatedQuestions = [...prev.questions];
                updatedQuestions[currentQuestionIndex] = data.question;
                return {
                    ...prev,
                    questions: updatedQuestions,
                    currentQuestionIndex: data.currentQuestionIndex
                };
            });

            setLiveTranscript('');
            setAudioDuration(0);

            if (!data.isLastQuestion) {
                setCurrentQuestionIndex(data.currentQuestionIndex);
            }

            return data;
        } catch (err) {
            console.error('Submit answer error:', err);
            setError(err.response?.data?.message || 'Failed to submit interview answer.');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [attempt, stopRecording, currentQuestionIndex, liveTranscript, audioDuration, videoMetrics]);

    // ── Finish Mock Interview ────────────────────────────────────────────────
    const finishInterview = useCallback(async () => {
        if (!attempt) return;
        setIsSubmitting(true);
        setError(null);
        try {
            stopRecording();
            isInterviewActiveRef.current = false;

            if (trackerRef.current) {
                trackerRef.current.stop();
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(t => t.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => {});
            }
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }

            const data = await finishMockInterview(attempt._id);
            setAttempt(data.attempt);
            return data.attempt;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to finalize interview.');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [attempt, stopRecording]);

    // ── Text to Speech: Natural Soft Female Interviewer Voice Readout ─────────
    const speakQuestion = useCallback((text) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Pick soft natural female voice
        const pickVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) return;

            // Prioritize natural English female voices
            const femaleVoice = voices.find(v =>
                v.lang.startsWith('en') && (
                    /female|woman|samantha|victoria|karen|moira|fiona|tessa|zira|serena/i.test(v.name)
                )
            ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
        };

        pickVoice();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = pickVoice;
        }

        // Professional, calm, natural 1.0x cadence (strictly NOT 1.5x)
        utterance.rate = 0.94;
        utterance.pitch = 1.02;
        utterance.volume = 1.0;

        utterance.onstart = () => setIsSpeakingQuestion(true);
        utterance.onend = () => setIsSpeakingQuestion(false);
        utterance.onerror = () => setIsSpeakingQuestion(false);
        window.speechSynthesis.speak(utterance);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (trackerRef.current) {
                trackerRef.current.stop();
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(t => t.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => {});
            }
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch {}
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return {
        attempt,
        loading,
        error,
        currentQuestionIndex,
        currentQuestion: attempt?.questions?.[currentQuestionIndex] || null,
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
        mediaStream: mediaStreamRef.current,
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
    };
};
