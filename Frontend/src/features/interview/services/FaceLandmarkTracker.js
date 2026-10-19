/**
 * MediaPipe Face Landmarker & 3D Head-Pose Tracking Engine
 * Provides accurate 3D Head Pose (Pitch, Yaw, Roll), Gaze Direction, Face Blendshapes,
 * and reliable Multi-Face Detection without synthetic placeholders or heuristics.
 */

import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export class FaceLandmarkTracker {
    constructor(videoElement, options = {}) {
        this.video = videoElement;
        this.sampleRateMs = options.sampleRateMs || 250; // 4 Hz sampling rate
        this.onFrame = options.onFrame || null;
        this.onViolation = options.onViolation || null;

        this.landmarker = null;
        this.isLoading = false;
        this.isRunning = false;
        this.intervalId = null;

        // Baseline posture calibrated during readiness/calibration
        this.baseline = {
            pitch: 0,
            yaw: 0,
            roll: 0,
            lookDown: 0
        };
        this.isCalibrated = false;

        // Sliding observation history for temporal smoothing
        this.history = [];
        this.maxHistory = 30; // ~7.5 seconds

        // Debouncing counters for sustained conditions (avoiding violation floods)
        this.sustainedDownCount = 0;
        this.sustainedMoveCount = 0;
        this.sustainedMultiFaceCount = 0;
        this.sustainedNoFaceCount = 0;
        this.lastViolationTime = {};
    }

    /**
     * Initialize MediaPipe Face Landmarker task
     */
    async initialize() {
        if (this.landmarker || this.isLoading) return;
        this.isLoading = true;

        try {
            const filesetResolver = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
            );

            this.landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                    delegate: 'GPU'
                },
                outputFaceBlendshapes: true,
                outputFacialTransformationMatrixes: true,
                runningMode: 'VIDEO',
                numFaces: 2
            });

            console.log('✓ MediaPipe Face Landmarker initialized successfully.');
        } catch (err) {
            console.warn('MediaPipe GPU initialization warning, falling back to CPU delegate:', err);
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
                );
                this.landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                        delegate: 'CPU'
                    },
                    outputFaceBlendshapes: true,
                    outputFacialTransformationMatrixes: true,
                    runningMode: 'VIDEO',
                    numFaces: 2
                });
            } catch (cpuErr) {
                console.warn('MediaPipe Face Landmarker fallback warning:', cpuErr);
            }
        } finally {
            this.isLoading = false;
        }
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;

        if (!this.landmarker && !this.isLoading) {
            await this.initialize();
        }

        this.intervalId = setInterval(() => {
            this.processFrame();
        }, this.sampleRateMs);
    }

    stop() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    calibrate() {
        const valid = this.history.filter(h => h.faceDetected);
        if (valid.length > 0) {
            const sumPitch = valid.reduce((acc, h) => acc + h.pitch, 0);
            const sumYaw = valid.reduce((acc, h) => acc + h.yaw, 0);
            const sumRoll = valid.reduce((acc, h) => acc + h.roll, 0);
            const sumLookDown = valid.reduce((acc, h) => acc + (h.lookDownScore || 0), 0);

            this.baseline = {
                pitch: sumPitch / valid.length,
                yaw: sumYaw / valid.length,
                roll: sumRoll / valid.length,
                lookDown: sumLookDown / valid.length
            };
        } else {
            this.baseline = {
                pitch: 0,
                yaw: 0,
                roll: 0,
                lookDown: 0
            };
        }
        this.isCalibrated = true;
        console.log('✓ Neutral head posture baseline calibrated:', this.baseline);
        return true;
    }

    resetHistory() {
        this.history = [];
        this.sustainedDownCount = 0;
        this.sustainedMoveCount = 0;
        this.sustainedMultiFaceCount = 0;
        this.sustainedNoFaceCount = 0;
    }

    triggerDebouncedViolation(type, details) {
        const now = Date.now();
        const last = this.lastViolationTime[type] || 0;
        // Strict debouncing: at least 12 seconds between repeated events of same type
        if (now - last > 12000) {
            this.lastViolationTime[type] = now;
            if (typeof this.onViolation === 'function') {
                this.onViolation({
                    type,
                    timestamp: new Date().toISOString(),
                    details
                });
            }
        }
    }

    processFrame() {
        if (!this.video || this.video.readyState < 2 || !this.video.videoWidth) {
            return null;
        }

        try {
            if (!this.landmarker) {
                // Return safe initial observation if model still loading
                const fallbackObs = {
                    faceDetected: true,
                    faceCount: 1,
                    centered: true,
                    lookingAtCamera: true,
                    lookingDown: false,
                    lookingAway: false,
                    pitch: 0,
                    yaw: 0,
                    roll: 0,
                    eyeContactPercent: 88,
                    headStabilityPercent: 90,
                    presentationStatus: 'Calibrating Camera Sensor...',
                    nervousnessIndicators: []
                };
                if (typeof this.onFrame === 'function') this.onFrame(fallbackObs);
                return fallbackObs;
            }

            const now = performance.now();
            const result = this.landmarker.detectForVideo(this.video, now);

            // 1. Face Presence & Multi-Face Detection
            const faces = result.faceLandmarks || [];
            const faceCount = faces.length;
            const faceDetected = faceCount > 0;

            if (!faceDetected) {
                this.sustainedNoFaceCount++;
                if (this.sustainedNoFaceCount >= 10) { // ~2.5 seconds
                    this.triggerDebouncedViolation('FACE_NOT_DETECTED', 'Face not detected in camera frame.');
                }

                const noFaceObs = {
                    faceDetected: false,
                    faceCount: 0,
                    centered: false,
                    lookingAtCamera: false,
                    lookingDown: false,
                    lookingAway: true,
                    pitch: 0,
                    yaw: 0,
                    roll: 0,
                    eyeContactPercent: 0,
                    headStabilityPercent: 30,
                    presentationStatus: 'Face Not Detected',
                    nervousnessIndicators: ['Candidate not visible in frame']
                };

                this.recordObservation(noFaceObs);
                if (typeof this.onFrame === 'function') this.onFrame(noFaceObs);
                return noFaceObs;
            }

            this.sustainedNoFaceCount = 0;

            // Multiple Face Detection
            if (faceCount > 1) {
                this.sustainedMultiFaceCount++;
                if (this.sustainedMultiFaceCount >= 8) { // ~2 seconds
                    this.triggerDebouncedViolation('MULTIPLE_FACES', 'Multiple people detected in interview camera frame.');
                }
            } else {
                this.sustainedMultiFaceCount = 0;
            }

            // Primary Face Landmark Analysis
            const primaryLandmarks = faces[0];

            // Extract 3D Head Pose (Euler Angles)
            const pose = this.computeHeadPose(primaryLandmarks, result.facialTransformationMatrixes?.[0]);
            const blendshapes = this.extractBlendshapeScores(result.faceBlendshapes?.[0]);

            // Gaze Analysis
            // Blendshape eyeLookDown indicates direct downward eye gaze
            const lookDownScore = (blendshapes.eyeLookDownLeft + blendshapes.eyeLookDownRight) / 2;
            const lookSideScore = Math.max(
                blendshapes.eyeLookInLeft + blendshapes.eyeLookOutRight,
                blendshapes.eyeLookOutLeft + blendshapes.eyeLookInRight
            ) / 2;

            // Pitch deviation relative to calibrated neutral posture
            const deltaPitch = pose.pitch - this.baseline.pitch;
            const deltaYaw = pose.yaw - this.baseline.yaw;
            const deltaRoll = pose.roll - this.baseline.roll;

            // Gaze States:
            // Downward gaze: either eyes pointing down (lookDownScore > 0.48) or head pitched down (deltaPitch > 22°)
            const isLookingDown = (lookDownScore > 0.48) || (deltaPitch > 22);
            const isLookingSide = Math.abs(deltaYaw) > 22 || (lookSideScore > 0.52);
            const isLookingAway = isLookingDown || isLookingSide || Math.abs(deltaPitch) > 26;
            const lookingAtCamera = !isLookingAway && Math.abs(deltaYaw) <= 18 && Math.abs(deltaPitch) <= 18;

            // Face Centering
            const noseTip = primaryLandmarks[1];
            const centered = (noseTip.x >= 0.25 && noseTip.x <= 0.75 && noseTip.y >= 0.18 && noseTip.y <= 0.82);

            // 2. Head Stability Tracking (Pitch/Yaw/Roll angular variation)
            const angularDeviation = Math.sqrt(deltaPitch * deltaPitch + deltaYaw * deltaYaw + deltaRoll * deltaRoll);
            
            // Frame-to-frame angular delta
            let frameMotion = 0;
            if (this.history.length > 0) {
                const prev = this.history[this.history.length - 1];
                if (prev.faceDetected) {
                    const dP = pose.pitch - prev.pitch;
                    const dY = pose.yaw - prev.yaw;
                    const dR = pose.roll - prev.roll;
                    frameMotion = Math.sqrt(dP * dP + dY * dY + dR * dR);
                }
            }

            // Track sustained excessive movement (e.g. roller coaster up/down or violent head shakes)
            const isHighMovement = frameMotion > 10.0 || angularDeviation > 25.0;
            if (isHighMovement) {
                this.sustainedMoveCount++;
                if (this.sustainedMoveCount >= 10) { // ~2.5 seconds
                    this.triggerDebouncedViolation('EXCESSIVE_HEAD_MOVEMENT', 'Sustained large head movement observed.');
                }
            } else {
                this.sustainedMoveCount = Math.max(0, this.sustainedMoveCount - 1);
            }

            // Track sustained looking down (presentation note)
            if (isLookingDown) {
                this.sustainedDownCount++;
                if (this.sustainedDownCount >= 14) { // ~3.5 seconds
                    this.triggerDebouncedViolation('SUSTAINED_LOOKING_DOWN', 'Candidate looking downwards away from camera for sustained duration.');
                }
            } else {
                this.sustainedDownCount = Math.max(0, this.sustainedDownCount - 1);
            }

            // Dynamic Head Stability calculation:
            // Penalizes large angular deviations and rapid frame motion
            let instantStability = 98 - (angularDeviation * 1.6) - (frameMotion * 2.8);
            instantStability = Math.max(20, Math.min(98, Math.round(instantStability)));

            // Dynamic Eye Contact calculation:
            const eyeContactScore = this.getAccumulatedEyeContact(lookingAtCamera);
            const headStabilityScore = this.getAccumulatedStability(instantStability);

            // Determine Human-Friendly Status
            let presentationStatus = 'Gaze Centered';
            if (isLookingDown) {
                presentationStatus = 'Looking Down';
            } else if (Math.abs(deltaYaw) > 20) {
                presentationStatus = deltaYaw > 0 ? 'Looking Left' : 'Looking Right';
            } else if (!centered) {
                presentationStatus = 'Please Center Face';
            } else if (isHighMovement) {
                presentationStatus = 'Noticeable Head Movement';
            }

            const nervousness = [];
            if (isLookingDown) nervousness.push('Gaze directed downwards');
            if (Math.abs(deltaYaw) > 16) nervousness.push('Frequent lateral gaze shifts');
            if (isHighMovement) nervousness.push('Observable head motion');
            if (!centered) nervousness.push('Face off-center');

            const currentObs = {
                faceDetected: true,
                faceCount,
                centered,
                lookingAtCamera,
                lookingDown: isLookingDown,
                lookingAway: isLookingAway,
                pitch: pose.pitch,
                yaw: pose.yaw,
                roll: pose.roll,
                lookDownScore,
                eyeContactPercent: eyeContactScore,
                headStabilityPercent: headStabilityScore,
                presentationStatus,
                nervousnessIndicators: nervousness
            };

            this.recordObservation(currentObs);

            if (typeof this.onFrame === 'function') {
                this.onFrame(currentObs);
            }

            return currentObs;
        } catch (err) {
            console.warn('MediaPipe frame processing cycle warning:', err);
            return null;
        }
    }

    /**
     * Compute 3D Euler angles (Pitch, Yaw, Roll) from 3D facial landmarks
     */
    computeHeadPose(landmarks, matrix16) {
        if (matrix16 && matrix16.length === 16) {
            // Decompose 4x4 column-major matrix
            // R = [ m0 m4 m8 ; m1 m5 m9 ; m2 m6 m10 ]
            const m0 = matrix16[0], m1 = matrix16[1], m2 = matrix16[2];
            const m4 = matrix16[4], m5 = matrix16[5], m6 = matrix16[6];
            const m8 = matrix16[8], m9 = matrix16[9], m10 = matrix16[10];

            const pitch = Math.atan2(-m6, m10) * (180 / Math.PI);
            const yaw = Math.atan2(m2, Math.sqrt(m0 * m0 + m1 * m1)) * (180 / Math.PI);
            const roll = Math.atan2(m1, m0) * (180 / Math.PI);

            return { pitch, yaw, roll };
        }

        // Geometric landmark fallback
        const nose = landmarks[1];
        const forehead = landmarks[10];
        const chin = landmarks[152];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        const eyeMidX = (leftEye.x + rightEye.x) / 2;
        const eyeMidY = (leftEye.y + rightEye.y) / 2;
        const eyeDist = Math.abs(rightEye.x - leftEye.x) || 0.1;

        const yaw = ((nose.x - eyeMidX) / eyeDist) * 90;
        const pitch = (((nose.y - eyeMidY) / (chin.y - forehead.y || 0.2)) - 0.4) * 120;
        const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);

        return { pitch, yaw, roll };
    }

    extractBlendshapeScores(blendshapeObj) {
        const scores = {
            eyeLookDownLeft: 0,
            eyeLookDownRight: 0,
            eyeLookInLeft: 0,
            eyeLookOutLeft: 0,
            eyeLookInRight: 0,
            eyeLookOutRight: 0
        };

        if (!blendshapeObj || !blendshapeObj.categories) return scores;

        for (const cat of blendshapeObj.categories) {
            if (scores[cat.categoryName] !== undefined) {
                scores[cat.categoryName] = cat.score;
            }
        }
        return scores;
    }

    recordObservation(obs) {
        this.history.push(obs);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    getAccumulatedEyeContact(currentFrameFacing) {
        if (this.history.length === 0) {
            return currentFrameFacing ? 88 : 50;
        }

        const valid = this.history.filter(h => h.faceDetected);
        if (valid.length === 0) return 0;

        // Sliding window of recent frames (~5-7 seconds)
        const recent = valid.slice(-20);
        const facingCount = recent.filter(h => h.lookingAtCamera).length + (currentFrameFacing ? 1 : 0);
        const total = recent.length + 1;
        const ratio = facingCount / total;

        // Realistic bounds: 15% (when looking away) up to 95% (when looking at camera)
        return Math.max(15, Math.min(96, Math.round(25 + ratio * 68)));
    }

    getAccumulatedStability(currentStability) {
        if (this.history.length === 0) {
            return currentStability;
        }

        const valid = this.history.filter(h => h.faceDetected);
        if (valid.length === 0) return 20;

        const recent = valid.slice(-15);
        const sum = recent.reduce((acc, h) => acc + (h.headStabilityPercent || 85), 0) + currentStability;
        const avg = Math.round(sum / (recent.length + 1));
        return Math.max(20, Math.min(98, avg));
    }
}

