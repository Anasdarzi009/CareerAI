import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import Avatar, { AVATARS_LIST } from '../../../components/common/Avatar'
import './account.scss'

// ── Icons ──────────────────────────────────────────────────────────────────────
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
)

const ShieldLockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <rect x="9" y="11" width="6" height="4" rx="1" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const AlertCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
)

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say']

export const Account = () => {
    const { user, handleUpdateProfile, handleChangePassword } = useAuth()

    // Profile form state
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [username, setUsername] = useState(user?.username || '')
    const [gender, setGender] = useState(user?.gender || 'Prefer not to say')
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'avatar-1')

    // Profile feedback
    const [profileSuccess, setProfileSuccess] = useState('')
    const [profileError, setProfileError] = useState('')
    const [savingProfile, setSavingProfile] = useState(false)

    // Password form state
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Password feedback
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [savingPassword, setSavingPassword] = useState(false)

    // Sync state if user changes in context
    useEffect(() => {
        if (user) {
            setUsername(user.username || '')
            setGender(user.gender || 'Prefer not to say')
            setSelectedAvatar(user.avatar || 'avatar-1')
        }
    }, [user])

    // Cancel Profile Editing
    const handleCancelProfile = () => {
        setUsername(user?.username || '')
        setGender(user?.gender || 'Prefer not to say')
        setSelectedAvatar(user?.avatar || 'avatar-1')
        setIsEditingProfile(false)
        setProfileError('')
    }

    // Save Profile
    const handleSaveProfile = async (e) => {
        e?.preventDefault()
        setProfileError('')
        setProfileSuccess('')

        if (!username.trim() || username.trim().length < 3) {
            setProfileError('Username must be at least 3 characters long')
            return
        }

        setSavingProfile(true)
        try {
            await handleUpdateProfile({
                username: username.trim(),
                gender,
                avatar: selectedAvatar
            })
            setProfileSuccess('Profile updated successfully')
            setIsEditingProfile(false)
            setTimeout(() => setProfileSuccess(''), 4000)
        } catch (err) {
            setProfileError(err.response?.data?.message || 'Failed to update profile. Please try again.')
        } finally {
            setSavingProfile(false)
        }
    }

    // Direct Avatar Click: when not in full edit mode, user can also click an avatar to select and save it immediately
    const handleSelectAvatar = async (avatarId) => {
        setSelectedAvatar(avatarId)
        if (!isEditingProfile) {
            setProfileError('')
            setProfileSuccess('')
            try {
                await handleUpdateProfile({
                    username: user?.username,
                    gender: user?.gender || 'Prefer not to say',
                    avatar: avatarId
                })
                setProfileSuccess('Avatar updated successfully')
                setTimeout(() => setProfileSuccess(''), 4000)
            } catch (err) {
                setProfileError(err.response?.data?.message || 'Failed to update avatar.')
            }
        }
    }

    // Save Password
    const handleSavePassword = async (e) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess('')

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All password fields are required')
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirmation do not match')
            return
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long')
            return
        }

        if (currentPassword === newPassword) {
            setPasswordError('New password must be different from current password')
            return
        }

        setSavingPassword(true)
        try {
            await handleChangePassword({
                currentPassword,
                newPassword,
                confirmPassword
            })
            setPasswordSuccess('Password changed successfully')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setIsChangingPassword(false)
            setTimeout(() => setPasswordSuccess(''), 4000)
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password. Please verify current password.')
        } finally {
            setSavingPassword(false)
        }
    }

    const handleCancelPassword = () => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setIsChangingPassword(false)
        setPasswordError('')
    }

    const currentAvatarMeta = AVATARS_LIST.find(a => a.id === (isEditingProfile ? selectedAvatar : (user?.avatar || 'avatar-1'))) || AVATARS_LIST[0]

    return (
        <div className="account-page">
            {/* ── Page Header ─────────────────────────────────────────────────── */}
            <div className="account-header">
                <div className="account-header-info">
                    <span className="account-header-tag">Candidate Profile</span>
                    <h1>Account Management</h1>
                    <p>
                        Manage your CareerAI candidate credentials, personal information, professional avatar, and security settings.
                    </p>
                </div>

                <div className="account-header-badge">
                    <span className="account-badge-status">Active Account</span>
                    <span className="account-badge-role">Candidate</span>
                </div>
            </div>

            {/* Global Success / Error Banners */}
            {profileSuccess && (
                <div className="account-banner account-banner--success">
                    <CheckIcon />
                    <span>{profileSuccess}</span>
                </div>
            )}

            {profileError && (
                <div className="account-banner account-banner--error">
                    <AlertCircleIcon />
                    <span>{profileError}</span>
                </div>
            )}

            {passwordSuccess && (
                <div className="account-banner account-banner--success">
                    <CheckIcon />
                    <span>{passwordSuccess}</span>
                </div>
            )}

            {passwordError && (
                <div className="account-banner account-banner--error">
                    <AlertCircleIcon />
                    <span>{passwordError}</span>
                </div>
            )}

            {/* ── 1. Profile Overview Card ────────────────────────────────────── */}
            <div className="account-card profile-overview-card">
                <div className="overview-avatar-col">
                    <div className="overview-avatar-frame">
                        <Avatar
                            avatarId={isEditingProfile ? selectedAvatar : (user?.avatar || 'avatar-1')}
                            size={84}
                            alt="Profile Avatar"
                        />
                    </div>
                </div>

                <div className="overview-meta-col">
                    <div className="overview-name-row">
                        <h2 className="overview-username">{user?.username || 'Candidate'}</h2>
                        <span className="overview-role-pill">{currentAvatarMeta.title}</span>
                    </div>
                    <div className="overview-detail-row">
                        <span className="overview-email">
                            <MailIcon />
                            {user?.email}
                        </span>
                        <span className="overview-dot">•</span>
                        <span className="overview-gender">
                            Gender: <strong>{user?.gender || 'Prefer not to say'}</strong>
                        </span>
                    </div>
                </div>

                <div className="overview-action-col">
                    {!isEditingProfile ? (
                        <button
                            type="button"
                            className="button secondary-button"
                            onClick={() => {
                                setIsEditingProfile(true)
                                setProfileError('')
                                setProfileSuccess('')
                            }}
                        >
                            <EditIcon />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div className="overview-btn-group">
                            <button
                                type="button"
                                className="button tertiary-button"
                                onClick={handleCancelProfile}
                                disabled={savingProfile}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="button primary-button"
                                onClick={handleSaveProfile}
                                disabled={savingProfile}
                            >
                                {savingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── 2. Personal Information Section ─────────────────────────────── */}
            <div className="account-card">
                <div className="account-card-header">
                    <div className="card-title-group">
                        <span className="card-step-num">01</span>
                        <h3>Personal Information</h3>
                    </div>
                    {isEditingProfile ? (
                        <span className="account-pill account-pill--active">Editing Mode</span>
                    ) : (
                        <span className="account-pill">Verified</span>
                    )}
                </div>

                <div className="account-card-body">
                    <div className="account-form-grid">
                        {/* Username */}
                        <div className="form-group">
                            <label htmlFor="account-username">
                                <UserIcon />
                                <span>Username</span>
                            </label>
                            {isEditingProfile ? (
                                <input
                                    id="account-username"
                                    type="text"
                                    className="account-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your candidate username"
                                    minLength={3}
                                    maxLength={30}
                                    required
                                />
                            ) : (
                                <div className="account-readonly-field">
                                    <span>{user?.username}</span>
                                </div>
                            )}
                            <span className="field-hint">
                                Used across interview reports and candidate workspace.
                            </span>
                        </div>

                        {/* Email Address (Read-Only) */}
                        <div className="form-group">
                            <label htmlFor="account-email">
                                <MailIcon />
                                <span>Email Address</span>
                                <span className="locked-tag">
                                    <LockIcon />
                                    <span>Locked</span>
                                </span>
                            </label>
                            <div className="account-readonly-field account-readonly-field--locked">
                                <span>{user?.email}</span>
                            </div>
                            <span className="field-hint">
                                Primary authentication credential managed by system.
                            </span>
                        </div>

                        {/* Gender */}
                        <div className="form-group form-group--full">
                            <label>
                                <span>Gender</span>
                                <span className="optional-tag">Optional</span>
                            </label>
                            {isEditingProfile ? (
                                <div className="gender-radio-group">
                                    {GENDER_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            className={`gender-pill ${gender === option ? 'gender-pill--selected' : ''}`}
                                            onClick={() => setGender(option)}
                                        >
                                            <span className="gender-pill__indicator">
                                                {gender === option && <CheckIcon />}
                                            </span>
                                            <span className="gender-pill__label">{option}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="account-readonly-field">
                                    <span>{user?.gender || 'Prefer not to say'}</span>
                                </div>
                            )}
                            <span className="field-hint">
                                Helps customize tone and placement readiness analytics.
                            </span>
                        </div>
                    </div>

                    {isEditingProfile && (
                        <div className="account-card-footer">
                            <button
                                type="button"
                                className="button tertiary-button"
                                onClick={handleCancelProfile}
                                disabled={savingProfile}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="button primary-button"
                                onClick={handleSaveProfile}
                                disabled={savingProfile}
                            >
                                {savingProfile ? 'Saving Changes...' : 'Save Personal Information'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── 3. Profile Avatar Selector (Exactly 10 Choices) ─────────────── */}
            <div className="account-card">
                <div className="account-card-header">
                    <div className="card-title-group">
                        <span className="card-step-num">02</span>
                        <div>
                            <h3>Profile Avatar</h3>
                            <p className="card-subtitle">
                                Select from 10 distinct professional candidate avatars. Zero external tracking, instant SVG rendering.
                            </p>
                        </div>
                    </div>
                    <span className="account-pill account-pill--counter">
                        10 Available
                    </span>
                </div>

                <div className="account-card-body">
                    <div className="avatar-grid">
                        {AVATARS_LIST.map((av) => {
                            const isSelected = (isEditingProfile ? selectedAvatar : (user?.avatar || 'avatar-1')) === av.id
                            return (
                                <button
                                    key={av.id}
                                    type="button"
                                    className={`avatar-choice-card ${isSelected ? 'avatar-choice-card--selected' : ''}`}
                                    onClick={() => handleSelectAvatar(av.id)}
                                    aria-label={`Select ${av.title} avatar`}
                                >
                                    <div className="avatar-choice-preview">
                                        <Avatar avatarId={av.id} size={56} alt={av.title} />
                                        {isSelected && (
                                            <div className="avatar-choice-check">
                                                <CheckIcon />
                                            </div>
                                        )}
                                    </div>
                                    <div className="avatar-choice-meta">
                                        <span className="avatar-choice-title">{av.title}</span>
                                        <span className="avatar-choice-gender">{av.gender}</span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                    <div className="avatar-selection-note">
                        <span className="note-dot" />
                        <span>
                            Currently active: <strong>{currentAvatarMeta.title}</strong> ({currentAvatarMeta.gender})
                        </span>
                    </div>
                </div>
            </div>

            {/* ── 4. Security & Credentials Section ───────────────────────────── */}
            <div className="account-card">
                <div className="account-card-header">
                    <div className="card-title-group">
                        <span className="card-step-num">03</span>
                        <div>
                            <h3>Security &amp; Password</h3>
                            <p className="card-subtitle">
                                Manage your platform authentication credentials securely with industry-standard bcrypt encryption.
                            </p>
                        </div>
                    </div>
                    <span className="account-pill account-pill--secure">
                        <ShieldLockIcon />
                        <span>Protected</span>
                    </span>
                </div>

                <div className="account-card-body">
                    {!isChangingPassword ? (
                        <div className="password-display-row">
                            <div className="password-masked-info">
                                <span className="password-label">Account Password</span>
                                <div className="masked-dots">
                                    ••••••••••••••••
                                </div>
                                <span className="password-subtext">
                                    Last authenticated via secure encrypted session. Plaintext passwords are never exposed.
                                </span>
                            </div>

                            <button
                                type="button"
                                className="button secondary-button"
                                onClick={() => {
                                    setIsChangingPassword(true)
                                    setPasswordError('')
                                    setPasswordSuccess('')
                                }}
                            >
                                <LockIcon />
                                <span>Change Password</span>
                            </button>
                        </div>
                    ) : (
                        <form className="change-password-form" onSubmit={handleSavePassword}>
                            <div className="password-form-grid">
                                <div className="form-group">
                                    <label htmlFor="current-password">Current Password</label>
                                    <input
                                        id="current-password"
                                        type="password"
                                        className="account-input"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <span className="field-hint">Enter your existing account password</span>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="new-password">New Password</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        className="account-input"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                    />
                                    <span className="field-hint">Minimum 6 characters</span>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirm-password">Confirm New Password</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        className="account-input"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                    />
                                    <span className="field-hint">Retype new password to confirm</span>
                                </div>
                            </div>

                            <div className="account-card-footer">
                                <button
                                    type="button"
                                    className="button tertiary-button"
                                    onClick={handleCancelPassword}
                                    disabled={savingPassword}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="button primary-button"
                                    disabled={savingPassword}
                                >
                                    {savingPassword ? 'Updating Password...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Account
