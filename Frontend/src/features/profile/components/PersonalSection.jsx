import React, { useState, useEffect } from 'react'

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say']

export const PersonalSection = ({ personal = {}, userMeta = {}, onSave, saving }) => {
    const [fullName, setFullName] = useState(personal.fullName || '')
    const [phoneNumber, setPhoneNumber] = useState(personal.phoneNumber || '')
    const [location, setLocation] = useState(personal.location || '')
    const [headline, setHeadline] = useState(personal.headline || '')

    useEffect(() => {
        setFullName(personal.fullName || userMeta.username || '')
        setPhoneNumber(personal.phoneNumber || '')
        setLocation(personal.location || '')
        setHeadline(personal.headline || '')
    }, [personal, userMeta])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({
            personal: {
                fullName: fullName.trim(),
                phoneNumber: phoneNumber.trim(),
                location: location.trim(),
                headline: headline.trim()
            }
        })
    }

    return (
        <form className="profile-section-card" id="section-personal" onSubmit={handleSubmit}>
            <div className="section-card-header">
                <div className="card-title-group">
                    <span className="card-step-num">02</span>
                    <div>
                        <h3>Personal Information</h3>
                        <p className="card-subtitle">
                            Candidate contact details and headline presented across institutional placement systems.
                        </p>
                    </div>
                </div>
            </div>

            <div className="section-card-body">
                <div className="form-grid-2col">
                    {/* Full Name */}
                    <div className="form-group">
                        <label htmlFor="p-fullname">Full Name</label>
                        <input
                            id="p-fullname"
                            type="text"
                            className="profile-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Anas Khan"
                            required
                        />
                    </div>

                    {/* Email (Read-Only) */}
                    <div className="form-group">
                        <label htmlFor="p-email">
                            <span>Email Address</span>
                            <span className="field-locked-pill">
                                <LockIcon />
                                <span>Account Credential</span>
                            </span>
                        </label>
                        <input
                            id="p-email"
                            type="email"
                            className="profile-input profile-input--locked"
                            value={userMeta.email || ''}
                            disabled
                        />
                        <span className="field-subtext">Managed via Account Settings.</span>
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                        <label htmlFor="p-phone">Phone Number</label>
                        <input
                            id="p-phone"
                            type="tel"
                            className="profile-input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    {/* Location */}
                    <div className="form-group">
                        <label htmlFor="p-location">Current Location</label>
                        <input
                            id="p-location"
                            type="text"
                            className="profile-input"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. Mumbai, India"
                        />
                    </div>

                    {/* Headline / Summary */}
                    <div className="form-group form-group--full">
                        <label htmlFor="p-headline">Professional Headline / Bio</label>
                        <input
                            id="p-headline"
                            type="text"
                            className="profile-input"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="e.g. Computer Science Student | Aspiring Cloud & DevOps Engineer"
                        />
                        <span className="field-subtext">Brief 1-line candidate summary for target recruiters.</span>
                    </div>
                </div>

                <div className="section-card-footer">
                    <button
                        type="submit"
                        className="button primary-button"
                        disabled={saving}
                    >
                        <span>{saving ? 'Saving...' : 'Save Personal Details'}</span>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default PersonalSection
