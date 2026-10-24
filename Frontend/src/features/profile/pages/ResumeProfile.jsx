import React, { useState } from 'react'
import useCandidateProfile from '../hooks/useCandidateProfile'
import ProfileHeader from '../components/ProfileHeader'
import ProfileOverviewCard from '../components/ProfileOverviewCard'
import ResumeSection from '../components/ResumeSection'
import PersonalSection from '../components/PersonalSection'
import AcademicSection from '../components/AcademicSection'
import SkillsSection from '../components/SkillsSection'
import ExperienceSection from '../components/ExperienceSection'
import ProjectsSection from '../components/ProjectsSection'
import CertificationsAndLanguagesSection from '../components/CertificationsAndLanguagesSection'
import PreferencesSection from '../components/PreferencesSection'
import '../style/resume-profile.scss'

const TAB_CONFIG = [
    { id: 'all', label: 'All Sections' },
    { id: 'resume', label: 'Resume' },
    { id: 'personal', label: 'Personal Info' },
    { id: 'academics', label: 'Academics' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications & Languages' },
    { id: 'preferences', label: 'Preferences' }
]

export const ResumeProfile = () => {
    const {
        profile,
        userMeta,
        loading,
        saving,
        uploadingResume,
        error,
        successMessage,
        completeness,
        handleUpdate,
        handleUploadResume,
        handleDeleteResume
    } = useCandidateProfile()

    const [activeTab, setActiveTab] = useState('all')

    const handleNavigateTab = (tabId) => {
        if (tabId) {
            setActiveTab(tabId)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    if (loading) {
        return (
            <div className="resume-profile-page">
                <div className="profile-loading-skeleton" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <div className="skeleton-loader" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ height: '28px', width: '220px', backgroundColor: 'var(--bg-surface)', borderRadius: '6px' }} />
                        <div style={{ height: '14px', width: '380px', backgroundColor: 'var(--bg-surface)', borderRadius: '4px' }} />
                        <div style={{ height: '120px', width: '100%', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', marginTop: '1rem' }} />
                    </div>
                </div>
            </div>
        )
    }

    const skillsCount = profile?.skills?.length || 0
    const expCount = profile?.experience?.length || 0
    const projectsCount = profile?.projects?.length || 0
    const certsCount = (profile?.certifications?.length || 0) + (profile?.languages?.length || 0)

    const renderSection = (tabId) => {
        switch (tabId) {
            case 'resume':
                return (
                    <ResumeSection
                        key="sec-resume"
                        resume={profile?.resume}
                        onUpload={handleUploadResume}
                        onDelete={handleDeleteResume}
                        uploading={uploadingResume}
                    />
                )
            case 'personal':
                return (
                    <PersonalSection
                        key="sec-personal"
                        personal={profile?.personal}
                        userMeta={userMeta || profile?.user}
                        onSave={(personalData) => handleUpdate(personalData?.personal !== undefined ? personalData : { personal: personalData })}
                        saving={saving}
                    />
                )
            case 'academics':
                return (
                    <AcademicSection
                        key="sec-academics"
                        academics={profile?.academics}
                        onSave={(academicData) => handleUpdate(academicData?.academics !== undefined ? academicData : { academics: academicData })}
                        saving={saving}
                    />
                )
            case 'skills':
                return (
                    <SkillsSection
                        key="sec-skills"
                        skills={profile?.skills}
                        onSave={(skillsData) => handleUpdate(skillsData?.skills !== undefined ? skillsData : { skills: skillsData })}
                        saving={saving}
                    />
                )
            case 'experience':
                return (
                    <ExperienceSection
                        key="sec-experience"
                        experience={profile?.experience}
                        onSave={(expData) => handleUpdate(expData?.experience !== undefined ? expData : { experience: expData })}
                        saving={saving}
                    />
                )
            case 'projects':
                return (
                    <ProjectsSection
                        key="sec-projects"
                        projects={profile?.projects}
                        onSave={(projData) => handleUpdate(projData?.projects !== undefined ? projData : { projects: projData })}
                        saving={saving}
                    />
                )
            case 'certifications':
                return (
                    <CertificationsAndLanguagesSection
                        key="sec-certs"
                        certifications={profile?.certifications}
                        languages={profile?.languages}
                        onSave={(data) => handleUpdate(data)}
                        saving={saving}
                    />
                )
            case 'preferences':
                return (
                    <PreferencesSection
                        key="sec-preferences"
                        preferences={profile?.careerPreferences}
                        onSave={(prefData) => handleUpdate(prefData?.careerPreferences !== undefined ? prefData : { careerPreferences: prefData })}
                        saving={saving}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="resume-profile-page">
            {/* Global Alerts */}
            {error && (
                <div className="profile-global-alert profile-global-alert--error" style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '0.875rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                }}>
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="profile-global-alert profile-global-alert--success" style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    padding: '0.875rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)'
                }}>
                    ✓ {successMessage}
                </div>
            )}

            {/* Header with Title & Live Completeness */}
            <ProfileHeader
                completeness={completeness}
                onNavigateTab={handleNavigateTab}
            />

            {/* Identity & Overview Card */}
            <ProfileOverviewCard
                userMeta={userMeta}
                profile={profile}
                completeness={completeness}
                onNavigateTab={handleNavigateTab}
            />

            {/* Section Filter Tabs */}
            <div className="profile-tabs-nav" role="tablist">
                {TAB_CONFIG.map((tab) => {
                    const isActive = activeTab === tab.id
                    let badgeCount = null
                    if (tab.id === 'skills' && skillsCount > 0) badgeCount = skillsCount
                    if (tab.id === 'experience' && expCount > 0) badgeCount = expCount
                    if (tab.id === 'projects' && projectsCount > 0) badgeCount = projectsCount
                    if (tab.id === 'certifications' && certsCount > 0) badgeCount = certsCount

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            className={`tab-btn ${isActive ? 'tab-btn--active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span>{tab.label}</span>
                            {badgeCount !== null && (
                                <span className="tab-badge">{badgeCount}</span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Sections Container */}
            <div className="profile-content-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {activeTab === 'all' ? (
                    <>
                        {renderSection('resume')}
                        {renderSection('personal')}
                        {renderSection('academics')}
                        {renderSection('skills')}
                        {renderSection('experience')}
                        {renderSection('projects')}
                        {renderSection('certifications')}
                        {renderSection('preferences')}
                    </>
                ) : (
                    renderSection(activeTab)
                )}
            </div>
        </div>
    )
}

export default ResumeProfile
