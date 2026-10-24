import React, { useState, useEffect } from 'react'

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

export const AcademicSection = ({ academics = {}, onSave, saving }) => {
    // 10th / SSC
    const [sscPercentage, setSscPercentage] = useState(academics.ssc?.percentage ?? '')
    const [sscYear, setSscYear] = useState(academics.ssc?.passingYear ?? '')
    const [sscBoard, setSscBoard] = useState(academics.ssc?.board ?? '')

    // 12th / HSC
    const [hscPercentage, setHscPercentage] = useState(academics.hsc?.percentage ?? '')
    const [hscYear, setHscYear] = useState(academics.hsc?.passingYear ?? '')
    const [hscStream, setHscStream] = useState(academics.hsc?.stream ?? '')
    const [hscBoard, setHscBoard] = useState(academics.hsc?.board ?? '')

    // Diploma (Optional)
    const [hasDiploma, setHasDiploma] = useState(!!academics.diploma?.percentageOrCgpa)
    const [diplomaScore, setDiplomaScore] = useState(academics.diploma?.percentageOrCgpa ?? '')
    const [diplomaYear, setDiplomaYear] = useState(academics.diploma?.passingYear ?? '')
    const [diplomaSpecialization, setDiplomaSpecialization] = useState(academics.diploma?.specialization ?? '')

    // Undergraduate Degree
    const [ugDegree, setUgDegree] = useState(academics.undergraduate?.degree ?? '')
    const [ugBranch, setUgBranch] = useState(academics.undergraduate?.branch ?? '')
    const [ugCollege, setUgCollege] = useState(academics.undergraduate?.college ?? '')
    const [ugScore, setUgScore] = useState(academics.undergraduate?.cgpaOrPercentage ?? '')
    const [ugYear, setUgYear] = useState(academics.undergraduate?.passingYear ?? '')

    // Postgraduate Degree (Optional)
    const [hasPg, setHasPg] = useState(!!academics.postgraduate?.degree)
    const [pgDegree, setPgDegree] = useState(academics.postgraduate?.degree ?? '')
    const [pgSpec, setPgSpec] = useState(academics.postgraduate?.specialization ?? '')
    const [pgCollege, setPgCollege] = useState(academics.postgraduate?.college ?? '')
    const [pgScore, setPgScore] = useState(academics.postgraduate?.cgpaOrPercentage ?? '')
    const [pgYear, setPgYear] = useState(academics.postgraduate?.passingYear ?? '')
    const [savedSuccess, setSavedSuccess] = useState(false)
    const [formError, setFormError] = useState('')

    useEffect(() => {
        setSscPercentage(academics?.ssc?.percentage ?? '')
        setSscYear(academics?.ssc?.passingYear ?? '')
        setSscBoard(academics?.ssc?.board ?? '')

        setHscPercentage(academics?.hsc?.percentage ?? '')
        setHscYear(academics?.hsc?.passingYear ?? '')
        setHscStream(academics?.hsc?.stream ?? '')
        setHscBoard(academics?.hsc?.board ?? '')

        if (academics?.diploma?.percentageOrCgpa) {
            setHasDiploma(true)
            setDiplomaScore(academics.diploma.percentageOrCgpa)
            setDiplomaYear(academics.diploma.passingYear ?? '')
            setDiplomaSpecialization(academics.diploma.specialization ?? '')
        }

        setUgDegree(academics?.undergraduate?.degree ?? '')
        setUgBranch(academics?.undergraduate?.branch ?? '')
        setUgCollege(academics?.undergraduate?.college ?? '')
        setUgScore(academics?.undergraduate?.cgpaOrPercentage ?? '')
        setUgYear(academics?.undergraduate?.passingYear ?? '')

        if (academics?.postgraduate?.degree) {
            setHasPg(true)
            setPgDegree(academics.postgraduate.degree)
            setPgSpec(academics.postgraduate.specialization ?? '')
            setPgCollege(academics.postgraduate.college ?? '')
            setPgScore(academics.postgraduate.cgpaOrPercentage ?? '')
            setPgYear(academics.postgraduate.passingYear ?? '')
        }
    }, [
        academics?.ssc?.percentage,
        academics?.ssc?.passingYear,
        academics?.ssc?.board,
        academics?.hsc?.percentage,
        academics?.hsc?.passingYear,
        academics?.hsc?.stream,
        academics?.hsc?.board,
        academics?.diploma?.percentageOrCgpa,
        academics?.diploma?.passingYear,
        academics?.diploma?.specialization,
        academics?.undergraduate?.degree,
        academics?.undergraduate?.branch,
        academics?.undergraduate?.college,
        academics?.undergraduate?.cgpaOrPercentage,
        academics?.undergraduate?.passingYear,
        academics?.postgraduate?.degree,
        academics?.postgraduate?.specialization,
        academics?.postgraduate?.college,
        academics?.postgraduate?.cgpaOrPercentage,
        academics?.postgraduate?.passingYear
    ])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError('')

        // Validate percentages
        if (sscPercentage !== '') {
            const ssc = Number(sscPercentage)
            if (isNaN(ssc) || ssc < 0 || ssc > 100) {
                setFormError('10th / SSC percentage must be between 0 and 100%')
                return
            }
        }

        if (hscPercentage !== '') {
            const hsc = Number(hscPercentage)
            if (isNaN(hsc) || hsc < 0 || hsc > 100) {
                setFormError('12th / HSC percentage must be between 0 and 100%')
                return
            }
        }

        if (ugScore !== '') {
            const ug = Number(ugScore)
            if (isNaN(ug) || ug < 0 || ug > 100) {
                setFormError('Undergraduate CGPA / Percentage must be a valid score (0-10 for CGPA or 0-100 for %)')
                return
            }
        }

        try {
            await onSave({
                academics: {
                    ssc: {
                        percentage: sscPercentage !== '' ? Number(sscPercentage) : null,
                        passingYear: sscYear !== '' ? Number(sscYear) : null,
                        board: sscBoard.trim()
                    },
                    hsc: {
                        percentage: hscPercentage !== '' ? Number(hscPercentage) : null,
                        passingYear: hscYear !== '' ? Number(hscYear) : null,
                        stream: hscStream.trim(),
                        board: hscBoard.trim()
                    },
                    diploma: hasDiploma ? {
                        percentageOrCgpa: diplomaScore !== '' ? Number(diplomaScore) : null,
                        passingYear: diplomaYear !== '' ? Number(diplomaYear) : null,
                        specialization: diplomaSpecialization.trim()
                    } : { percentageOrCgpa: null, passingYear: null, specialization: '' },
                    undergraduate: {
                        degree: ugDegree.trim(),
                        branch: ugBranch.trim(),
                        college: ugCollege.trim(),
                        cgpaOrPercentage: ugScore !== '' ? Number(ugScore) : null,
                        passingYear: ugYear !== '' ? Number(ugYear) : null
                    },
                    postgraduate: hasPg ? {
                        degree: pgDegree.trim(),
                        specialization: pgSpec.trim(),
                        college: pgCollege.trim(),
                        cgpaOrPercentage: pgScore !== '' ? Number(pgScore) : null,
                        passingYear: pgYear !== '' ? Number(pgYear) : null
                    } : { degree: '', specialization: '', college: '', cgpaOrPercentage: null, passingYear: null }
                }
            })
            setSavedSuccess(true)
            setTimeout(() => setSavedSuccess(false), 3500)
        } catch {
            // Error handled by parent hook, preserve entered values in state
        }
    }

    return (
        <form className="profile-section-card" id="section-academics" onSubmit={handleSubmit}>
            <div className="section-card-header">
                <div className="card-title-group">
                    <span className="card-step-num">03</span>
                    <div>
                        <h3>Academic Background</h3>
                        <p className="card-subtitle">
                            Structured education records used by CareerAI to verify campus placement eligibility criteria and company cutoffs.
                        </p>
                    </div>
                </div>
                <span className="section-pill section-pill--criteria">Eligibility Foundation</span>
            </div>

            <div className="section-card-body">
                {formError && (
                    <div className="form-error-banner">
                        <span>{formError}</span>
                    </div>
                )}

                <div className="academic-callout">
                    <InfoIcon />
                    <span>
                        Percentages and CGPAs are stored as discrete numeric values to verify criteria such as <em>"Min 70% in 10th/12th"</em> or <em>"Min 7.5 CGPA in B.Tech"</em>.
                    </span>
                </div>

                {/* ── Sub-block 1: 10th / SSC ── */}
                <div className="academic-subblock">
                    <h4 className="academic-subblock-title">Secondary Education (10th / SSC)</h4>
                    <div className="form-grid-3col">
                        <div className="form-group">
                            <label htmlFor="ssc-pct">Percentage (%)</label>
                            <input
                                id="ssc-pct"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                className="profile-input"
                                value={sscPercentage}
                                onChange={(e) => setSscPercentage(e.target.value)}
                                placeholder="e.g. 88.5"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ssc-yr">Passing Year</label>
                            <input
                                id="ssc-yr"
                                type="number"
                                min="1990"
                                max="2035"
                                className="profile-input"
                                value={sscYear}
                                onChange={(e) => setSscYear(e.target.value)}
                                placeholder="e.g. 2020"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ssc-brd">Board / Council</label>
                            <input
                                id="ssc-brd"
                                type="text"
                                className="profile-input"
                                value={sscBoard}
                                onChange={(e) => setSscBoard(e.target.value)}
                                placeholder="e.g. CBSE / ICSE / State Board"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Sub-block 2: 12th / HSC ── */}
                <div className="academic-subblock">
                    <h4 className="academic-subblock-title">Higher Secondary (12th / HSC)</h4>
                    <div className="form-grid-4col">
                        <div className="form-group">
                            <label htmlFor="hsc-pct">Percentage (%)</label>
                            <input
                                id="hsc-pct"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                className="profile-input"
                                value={hscPercentage}
                                onChange={(e) => setHscPercentage(e.target.value)}
                                placeholder="e.g. 84.2"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hsc-yr">Passing Year</label>
                            <input
                                id="hsc-yr"
                                type="number"
                                min="1990"
                                max="2035"
                                className="profile-input"
                                value={hscYear}
                                onChange={(e) => setHscYear(e.target.value)}
                                placeholder="e.g. 2022"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hsc-stm">Stream</label>
                            <input
                                id="hsc-stm"
                                type="text"
                                className="profile-input"
                                value={hscStream}
                                onChange={(e) => setHscStream(e.target.value)}
                                placeholder="e.g. Science (PCM) / Commerce"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hsc-brd">Board</label>
                            <input
                                id="hsc-brd"
                                type="text"
                                className="profile-input"
                                value={hscBoard}
                                onChange={(e) => setHscBoard(e.target.value)}
                                placeholder="e.g. CBSE / State Board"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Sub-block 3: Optional Diploma ── */}
                <div className="academic-subblock">
                    <div className="academic-toggle-row">
                        <h4 className="academic-subblock-title">Polytechnic / Diploma</h4>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={hasDiploma}
                                onChange={(e) => setHasDiploma(e.target.checked)}
                            />
                            <span>Include Diploma Details</span>
                        </label>
                    </div>

                    {hasDiploma && (
                        <div className="form-grid-3col">
                            <div className="form-group">
                                <label>Specialization / Branch</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={diplomaSpecialization}
                                    onChange={(e) => setDiplomaSpecialization(e.target.value)}
                                    placeholder="e.g. Mechanical Engineering"
                                />
                            </div>
                            <div className="form-group">
                                <label>Percentage / CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="profile-input"
                                    value={diplomaScore}
                                    onChange={(e) => setDiplomaScore(e.target.value)}
                                    placeholder="e.g. 82.5 or 8.2"
                                />
                            </div>
                            <div className="form-group">
                                <label>Passing Year</label>
                                <input
                                    type="number"
                                    className="profile-input"
                                    value={diplomaYear}
                                    onChange={(e) => setDiplomaYear(e.target.value)}
                                    placeholder="e.g. 2022"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sub-block 4: Undergraduate Degree ── */}
                <div className="academic-subblock">
                    <h4 className="academic-subblock-title">Undergraduate Degree (Current / Completed)</h4>
                    <div className="form-grid-3col">
                        <div className="form-group">
                            <label htmlFor="ug-deg">Degree</label>
                            <input
                                id="ug-deg"
                                type="text"
                                className="profile-input"
                                value={ugDegree}
                                onChange={(e) => setUgDegree(e.target.value)}
                                placeholder="e.g. B.Tech / B.E. / BCA / B.Sc"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ug-brn">Branch / Specialization</label>
                            <input
                                id="ug-brn"
                                type="text"
                                className="profile-input"
                                value={ugBranch}
                                onChange={(e) => setUgBranch(e.target.value)}
                                placeholder="e.g. Computer Science & Engineering"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ug-clg">College / University</label>
                            <input
                                id="ug-clg"
                                type="text"
                                className="profile-input"
                                value={ugCollege}
                                onChange={(e) => setUgCollege(e.target.value)}
                                placeholder="e.g. National Institute of Technology"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ug-scr">CGPA / Percentage</label>
                            <input
                                id="ug-scr"
                                type="number"
                                step="0.01"
                                min="0"
                                max="100"
                                className="profile-input"
                                value={ugScore}
                                onChange={(e) => setUgScore(e.target.value)}
                                placeholder="e.g. 8.42 or 84.2%"
                            />
                            <span className="field-subtext">Used to verify placement cutoff criteria.</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ug-yr">Passing / Graduation Year</label>
                            <input
                                id="ug-yr"
                                type="number"
                                min="1990"
                                max="2035"
                                className="profile-input"
                                value={ugYear}
                                onChange={(e) => setUgYear(e.target.value)}
                                placeholder="e.g. 2026"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Sub-block 5: Optional Postgraduate Degree ── */}
                <div className="academic-subblock">
                    <div className="academic-toggle-row">
                        <h4 className="academic-subblock-title">Postgraduate Degree</h4>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={hasPg}
                                onChange={(e) => setHasPg(e.target.checked)}
                            />
                            <span>Include Postgraduate Details</span>
                        </label>
                    </div>

                    {hasPg && (
                        <div className="form-grid-3col">
                            <div className="form-group">
                                <label>Degree</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={pgDegree}
                                    onChange={(e) => setPgDegree(e.target.value)}
                                    placeholder="e.g. M.Tech / MCA / MBA"
                                />
                            </div>
                            <div className="form-group">
                                <label>Specialization</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={pgSpec}
                                    onChange={(e) => setPgSpec(e.target.value)}
                                    placeholder="e.g. Artificial Intelligence"
                                />
                            </div>
                            <div className="form-group">
                                <label>College / University</label>
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={pgCollege}
                                    onChange={(e) => setPgCollege(e.target.value)}
                                    placeholder="e.g. Indian Institute of Technology"
                                />
                            </div>
                            <div className="form-group">
                                <label>CGPA / Percentage</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="profile-input"
                                    value={pgScore}
                                    onChange={(e) => setPgScore(e.target.value)}
                                    placeholder="e.g. 8.8"
                                />
                            </div>
                            <div className="form-group">
                                <label>Passing Year</label>
                                <input
                                    type="number"
                                    className="profile-input"
                                    value={pgYear}
                                    onChange={(e) => setPgYear(e.target.value)}
                                    placeholder="e.g. 2028"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="section-card-footer" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        type="submit"
                        id="save-academics-btn"
                        className="button primary-button"
                        disabled={saving}
                    >
                        <span>{saving ? 'Saving...' : 'Save Academic Details'}</span>
                    </button>
                    {savedSuccess && (
                        <span style={{ color: '#34d399', fontSize: 'var(--text-sm)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
                            <CheckIcon /> Academic details saved successfully
                        </span>
                    )}
                </div>
            </div>
        </form>
    )
}

export default AcademicSection
