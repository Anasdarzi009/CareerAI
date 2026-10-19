import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

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

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const cleanUsername = username.trim()
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanUsername || !cleanEmail || !password) {
            setError("Please fill in all required fields.")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }
        try {
            await handleRegister({ username: cleanUsername, email: cleanEmail, password })
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed")
        }
    }

    if (loading) {
        return (
            <main className="auth-page">
                <div style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                    Creating account...
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
                        Candidate Registration
                    </div>

                    <h2 className="auth-brand-headline">
                        Start Your Career Preparation &amp; Placement Journey
                    </h2>
                    <p className="auth-brand-sub">
                        Create your candidate profile to access AI-driven interview strategies, job-role compatibility checks, academic eligibility verification, and structured roadmaps.
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

            {/* Right — Clean Registration Form */}
            <div className="auth-form-panel">
                <div className="auth-mobile-header">
                    <div className="mobile-wordmark">
                        <span className="brand-accent">CareerAI</span>
                    </div>
                    <span className="mobile-sub">Placement Readiness Platform</span>
                </div>

                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <h1>Create Candidate Account</h1>
                        <p>Set up your credentials to begin interview preparation</p>
                    </div>

                    {error && (
                        <div className="auth-error-banner">
                            <AlertIcon />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Candidate Username / Full Name</label>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                type="text" id="username" name="username"
                                placeholder="e.g. anas_khan" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email" id="email" name="email"
                                placeholder="candidate@university.edu" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password" id="password" name="password"
                                placeholder="••••••••" required />
                        </div>

                        <button className="button primary-button auth-submit-btn">
                            Create Account &amp; Continue
                        </button>
                    </form>

                    <p className="auth-form-footer">
                        Already registered? <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Register