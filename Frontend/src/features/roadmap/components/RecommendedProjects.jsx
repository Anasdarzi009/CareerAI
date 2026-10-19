import React from 'react';

const RecommendedProjects = ({ projects = [] }) => {
    if (!projects || projects.length === 0) return null;

    return (
        <div className="recommended-projects">
            <div className="recommended-projects__header">
                <div className="recommended-projects__title-group">
                    <span className="recommended-projects__badge">GAP BRIDGING PROJECTS</span>
                    <h4 className="recommended-projects__title">Role-Aligned Portfolio Recommendations</h4>
                </div>
                <p className="recommended-projects__description">
                    These projects are dynamically formulated to simultaneously satisfy multiple identified skill deficiencies from your Skill Gap Matrix.
                </p>
            </div>

            <div className="recommended-projects__list">
                {projects.map((proj, idx) => (
                    <div key={idx} className="project-card">
                        <div className="project-card__header">
                            <div className="project-card__title-box">
                                <h5 className="project-card__title">{proj.title}</h5>
                                {proj.tagline && <span className="project-card__tagline">{proj.tagline}</span>}
                            </div>
                            <span className="project-card__effort">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                {proj.estimatedEffort || '2-3 weeks'}
                            </span>
                        </div>

                        <p className="project-card__desc">{proj.description}</p>

                        {proj.targetedSkills && proj.targetedSkills.length > 0 && (
                            <div className="project-card__skills">
                                <span className="project-card__skills-label">Targeted Skill Gaps:</span>
                                <div className="project-card__skills-chips">
                                    {proj.targetedSkills.map((sk, sIdx) => (
                                        <span key={sIdx} className="project-card__skill-tag">{sk}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {proj.deliverables && proj.deliverables.length > 0 && (
                            <div className="project-card__deliverables">
                                <span className="project-card__deliverables-label">Key Deliverables & Verification:</span>
                                <ul className="project-card__deliverables-list">
                                    {proj.deliverables.map((del, dIdx) => (
                                        <li key={dIdx} className="project-card__deliverable-item">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                            <span>{del}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedProjects;
