import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const BrandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
)

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

const CAPABILITIES = [
    {
        num: '01',
        title: 'Targeted Interview Preparation',
        desc: 'Role & company-specific technical and behavioral questions matched to job requirements.'
    },
    {
        num: '02',
        title: 'Academic & Experience Eligibility Audit',
        desc: 'Evaluates 10th, 12th, CGPA, and degree requirements from Job Descriptions against your profile.'
    },
    {
        num: '03',
        title: 'Priority Skill-Gap Matrix & Roadmap',
        desc: 'Identifies missing competencies and generates a structured day-by-day remediation plan.'
    },
    {
        num: '04',
        title: 'Placement Readiness Intelligence',
        desc: 'Standardized assessment framework for campus drives and lateral hiring readiness.'
    }
]

const Login = () => {
    const { loading, handleLogin, handleResetPassword } = useAuth()
    const navigate = useNavigate()

    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const [showReset, setShowReset] = useState(false)
    const [resetIdentifier, setResetIdentifier] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [resetSuccess, setResetSuccess] = useState("")
    const [resetLoading, setResetLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const cleanIdentifier = identifier.trim()
        if (!cleanIdentifier || !password) {
            setError("Please enter your email or username and password")
            return
        }
        try {
            await handleLogin({ email: cleanIdentifier, identifier: cleanIdentifier, password })
            navigate('/')
        } catch (err) {
            if (!err.response && err.message === "Network Error") {
                setError("Unable to connect to backend server. Please verify the server is running.")
            } else {
                setError(err.response?.data?.message || "Invalid email or password")
            }
        }
    }

    const handleResetSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setResetSuccess("")
        const cleanId = (resetIdentifier || identifier).trim()
        if (!cleanId || !newPassword) {
            setError("Please provide your email/username and a new password.")
            return
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters long.")
            return
        }
        setResetLoading(true)
        try {
            const res = await handleResetPassword({ identifier: cleanId, newPassword })
            setResetSuccess(res?.message || "Password reset successfully! You may now sign in.")
            setIdentifier(cleanId)
            setShowReset(false)
        } catch (err) {
            setError(err.response?.data?.message || "Could not reset password. Please check your email/username.")
        } finally {
            setResetLoading(false)
        }
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                    Verifying session...
                </div>
            </main>
        )
    }

    return (
        <main className="auth-page">
            {/* Left — Platform Hero & Academic Overview */}
            <div className="auth-brand-panel">
                <div className="auth-brand-top">
                    <div className="auth-wordmark">
                        <div className="wordmark-icon">
                            <BrandIcon />
                        </div>
                        <span className="wordmark-text">Career<span className="brand-accent">AI</span></span>
                    </div>

                    <div className="auth-academic-tag">
                        Placement Readiness Platform
                    </div>

                    <h2 className="auth-brand-headline">
                        GenAI-Based Intelligent Career Preparation &amp; Placement Readiness
                    </h2>
                    <p className="auth-brand-sub">
                        A comprehensive career readiness system designed to evaluate candidate profiles against industry job descriptions, verify eligibility criteria, and generate actionable preparation roadmaps.
                    </p>

                    <div className="auth-capabilities">
                        {CAPABILITIES.map((cap) => (
                            <div key={cap.num} className="capability-row">
                                <span className="cap-num">{cap.num}</span>
                                <div className="cap-info">
                                    <h4>{cap.title}</h4>
                                    <p>{cap.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="auth-brand-bottom">
                    <span>CareerAI Platform</span>
                    <span>Enterprise Edition</span>
                </div>
            </div>

            {/* Right — Clean Authentication Form */}
            <div className="auth-form-panel">
                <div className="auth-mobile-header">
                    <div className="mobile-wordmark">
                        <span className="brand-accent">CareerAI</span>
                    </div>
                    <span className="mobile-sub">Placement Readiness Platform</span>
                </div>

                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <h1>{showReset ? "Reset Candidate Password" : "Candidate Sign In"}</h1>
                        <p>{showReset ? "Enter your email or username to update your password" : "Access your interview preparation workspace and plans"}</p>
                    </div>

                    {error && (
                        <div className="auth-error-banner">
                            <AlertIcon />
                            <span>{error}</span>
                        </div>
                    )}

                    {resetSuccess && (
                        <div className="auth-error-banner" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
                            <span>{resetSuccess}</span>
                        </div>
                    )}

                    {!showReset ? (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="identifier">Email Address or Username</label>
                                <input
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    value={identifier}
                                    type="text" id="identifier" name="identifier"
                                    autoComplete="username"
                                    placeholder="candidate@university.edu or username" required />
                            </div>

                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <label htmlFor="password" style={{ margin: 0 }}>Password</label>
                                    <button
                                        type="button"
                                        onClick={() => { setShowReset(true); setError(""); setResetSuccess(""); setResetIdentifier(identifier); }}
                                        style={{ background: 'none', border: 'none', color: 'var(--brand-primary, #6366f1)', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                                    >
                                        Forgot / Reset?
                                    </button>
                                </div>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    type="password" id="password" name="password"
                                    placeholder="••••••••" required />
                            </div>

                            <button className="button primary-button auth-submit-btn">
                                Sign In to Platform
                            </button>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleResetSubmit}>
                            <div className="form-group">
                                <label htmlFor="reset-identifier">Email Address or Username</label>
                                <input
                                    onChange={(e) => setResetIdentifier(e.target.value)}
                                    value={resetIdentifier}
                                    type="text" id="reset-identifier" name="resetIdentifier"
                                    placeholder="candidate@university.edu or username" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="new-password">New Password (min 6 characters)</label>
                                <input
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    type="password" id="new-password" name="newPassword"
                                    placeholder="••••••••" required />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowReset(false); setError(""); }}
                                    className="button secondary-button"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="button primary-button"
                                    style={{ flex: 2 }}
                                >
                                    {resetLoading ? "Saving..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="auth-form-footer">
                        New candidate? <Link to="/register">Create an Account</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Login