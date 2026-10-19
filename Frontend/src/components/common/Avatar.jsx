import React from 'react'

/**
 * Built-in 10 distinct professional candidate avatars.
 * Zero external dependencies, pure scalable SVG vectors.
 * Balanced representation: 5 masculine-presenting & 5 feminine-presenting career profiles.
 */

export const AVATARS_LIST = [
    {
        id: 'avatar-1',
        title: 'Software Engineer',
        gender: 'Masculine',
        accent: '#3b82f6',
        bg: ['#1e3a8a', '#172554']
    },
    {
        id: 'avatar-2',
        title: 'Full Stack Developer',
        gender: 'Feminine',
        accent: '#06b6d4',
        bg: ['#115e59', '#042f2e']
    },
    {
        id: 'avatar-3',
        title: 'Systems Architect',
        gender: 'Masculine',
        accent: '#8b5cf6',
        bg: ['#4c1d95', '#2e1065']
    },
    {
        id: 'avatar-4',
        title: 'AI / ML Specialist',
        gender: 'Feminine',
        accent: '#ec4899',
        bg: ['#831843', '#500724']
    },
    {
        id: 'avatar-5',
        title: 'DevOps & Cloud Engineer',
        gender: 'Masculine',
        accent: '#10b981',
        bg: ['#065f46', '#022c22']
    },
    {
        id: 'avatar-6',
        title: 'Data & Analytics Lead',
        gender: 'Feminine',
        accent: '#f59e0b',
        bg: ['#78350f', '#451a03']
    },
    {
        id: 'avatar-7',
        title: 'Cybersecurity Analyst',
        gender: 'Masculine',
        accent: '#6366f1',
        bg: ['#312e81', '#1e1b4b']
    },
    {
        id: 'avatar-8',
        title: 'Product & Tech Consultant',
        gender: 'Feminine',
        accent: '#14b8a6',
        bg: ['#0f766e', '#134e4a']
    },
    {
        id: 'avatar-9',
        title: 'Frontend & UI Specialist',
        gender: 'Masculine',
        accent: '#f43f5e',
        bg: ['#881337', '#4c0519']
    },
    {
        id: 'avatar-10',
        title: 'Engineering Manager',
        gender: 'Feminine',
        accent: '#a855f7',
        bg: ['#581c87', '#3b0764']
    }
]

export const Avatar = ({ avatarId = 'avatar-1', size = 40, className = '', alt = 'User avatar' }) => {
    const id = avatarId || 'avatar-1'

    const sizePx = typeof size === 'number' ? `${size}px` : size

    const renderAvatarGraphic = () => {
        switch (id) {
            case 'avatar-1':
                // Tech Candidate 1: Male presenting, dark tapered hair, blue hoodie/t-shirt
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1e3a8a" />
                                <stop offset="100%" stopColor="#0f172a" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg1)" />
                        {/* Shoulders / Shirt */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#2563eb" />
                        <path d="M42 68 L50 80 L58 68 Z" fill="#1d4ed8" />
                        {/* Neck */}
                        <rect x="44" y="52" width="12" height="18" rx="4" fill="#fbcfe8" />
                        {/* Head / Face */}
                        <ellipse cx="50" cy="42" rx="18" ry="20" fill="#fed7aa" />
                        {/* Eyes */}
                        <circle cx="43" cy="41" r="2.2" fill="#1e293b" />
                        <circle cx="57" cy="41" r="2.2" fill="#1e293b" />
                        {/* Eyebrows */}
                        <path d="M39 36 Q43 34 47 36" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        <path d="M53 36 Q57 34 61 36" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        {/* Smile */}
                        <path d="M45 51 Q50 55 55 51" stroke="#ea580c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        {/* Short textured hair */}
                        <path d="M30 38 C30 22, 42 16, 52 16 C64 16, 70 24, 70 38 C65 30, 57 26, 48 26 C38 26, 33 32, 30 38 Z" fill="#1e293b" />
                    </svg>
                )

            case 'avatar-2':
                // Tech Candidate 2: Female presenting, sleek bob hair, teal blazer
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#115e59" />
                                <stop offset="100%" stopColor="#042f2e" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg2)" />
                        {/* Shoulders & Blazer */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#0d9488" />
                        <path d="M40 70 L50 96 L60 70 Z" fill="#f8fafc" />
                        {/* Neck */}
                        <rect x="45" y="52" width="10" height="18" rx="3" fill="#fed7aa" />
                        {/* Head */}
                        <ellipse cx="50" cy="43" rx="17" ry="19" fill="#fde047" opacity="0.3" />
                        <ellipse cx="50" cy="43" rx="17" ry="19" fill="#ffedd5" />
                        {/* Eyes */}
                        <circle cx="43" cy="42" r="2.2" fill="#0f172a" />
                        <circle cx="57" cy="42" r="2.2" fill="#0f172a" />
                        {/* Eyebrows */}
                        <path d="M39 37 Q43 35 47 37" stroke="#334155" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        <path d="M53 37 Q57 35 61 37" stroke="#334155" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        {/* Smile */}
                        <path d="M46 52 Q50 56 54 52" stroke="#e11d48" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        {/* Sleek bob hair */}
                        <path d="M28 46 C28 23, 40 16, 50 16 C60 16, 72 23, 72 46 C72 56, 68 58, 68 52 C68 33, 62 25, 50 25 C38 25, 32 33, 32 52 C32 58, 28 56, 28 46 Z" fill="#334155" />
                        {/* Earrings */}
                        <circle cx="31" cy="48" r="1.8" fill="#5eead4" />
                        <circle cx="69" cy="48" r="1.8" fill="#5eead4" />
                    </svg>
                )

            case 'avatar-3':
                // Tech Candidate 3: Male presenting, spectacles, purple accent collar
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4c1d95" />
                                <stop offset="100%" stopColor="#1e1b4b" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg3)" />
                        {/* Attire */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#7c3aed" />
                        <path d="M43 68 L50 82 L57 68 Z" fill="#5b21b6" />
                        {/* Neck */}
                        <rect x="44" y="52" width="12" height="18" rx="4" fill="#fcd34d" opacity="0.3" />
                        <rect x="44" y="52" width="12" height="18" rx="4" fill="#fed7aa" />
                        {/* Face */}
                        <ellipse cx="50" cy="42" rx="18" ry="19" fill="#fed7aa" />
                        {/* Glasses */}
                        <rect x="36" y="38" width="11" height="9" rx="3" fill="none" stroke="#e2e8f0" strokeWidth="1.8" />
                        <rect x="53" y="38" width="11" height="9" rx="3" fill="none" stroke="#e2e8f0" strokeWidth="1.8" />
                        <line x1="47" y1="42" x2="53" y2="42" stroke="#e2e8f0" strokeWidth="1.8" />
                        {/* Eyes behind lenses */}
                        <circle cx="41.5" cy="42.5" r="1.8" fill="#0f172a" />
                        <circle cx="58.5" cy="42.5" r="1.8" fill="#0f172a" />
                        {/* Smile */}
                        <path d="M45 52 Q50 56 55 52" stroke="#ea580c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        {/* Hair - side parted */}
                        <path d="M29 36 C30 20, 44 17, 56 17 C68 17, 71 25, 71 36 C66 26, 56 24, 48 24 C38 24, 33 28, 29 36 Z" fill="#0f172a" />
                    </svg>
                )

            case 'avatar-4':
                // Tech Candidate 4: Female presenting, ponytail, pink accent attire
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#831843" />
                                <stop offset="100%" stopColor="#4c0519" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg4)" />
                        {/* Ponytail behind head */}
                        <ellipse cx="68" cy="44" rx="8" ry="16" fill="#18181b" transform="rotate(15 68 44)" />
                        {/* Clothes */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#db2777" />
                        <circle cx="50" cy="74" r="5" fill="#f43f5e" />
                        {/* Neck */}
                        <rect x="45" y="52" width="10" height="18" rx="3" fill="#fbcfe8" />
                        {/* Face */}
                        <ellipse cx="50" cy="42" rx="17" ry="19" fill="#fce7f3" />
                        {/* Eyes */}
                        <circle cx="43" cy="41" r="2.2" fill="#09090b" />
                        <circle cx="57" cy="41" r="2.2" fill="#09090b" />
                        {/* Lashes */}
                        <path d="M40 37 L43 38" stroke="#09090b" strokeWidth="1.4" strokeLinecap="round" />
                        <path d="M60 37 L57 38" stroke="#09090b" strokeWidth="1.4" strokeLinecap="round" />
                        {/* Smile */}
                        <path d="M46 51 Q50 55 54 51" stroke="#be123c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        {/* Hair front */}
                        <path d="M30 38 C32 22, 45 18, 54 18 C64 18, 70 24, 70 36 C64 28, 54 26, 46 26 C36 26, 32 32, 30 38 Z" fill="#18181b" />
                    </svg>
                )

            case 'avatar-5':
                // Tech Candidate 5: Male presenting, emerald hoodie, curly hair
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#065f46" />
                                <stop offset="100%" stopColor="#022c22" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg5)" />
                        {/* Hoodie */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#059669" />
                        <path d="M38 68 C42 80, 58 80, 62 68 Z" fill="#047857" />
                        {/* Neck */}
                        <rect x="44" y="52" width="12" height="18" rx="4" fill="#fed7aa" />
                        {/* Face */}
                        <ellipse cx="50" cy="42" rx="18" ry="19" fill="#fcd34d" opacity="0.3" />
                        <ellipse cx="50" cy="42" rx="18" ry="19" fill="#fed7aa" />
                        {/* Eyes */}
                        <circle cx="43" cy="41" r="2.2" fill="#1f2937" />
                        <circle cx="57" cy="41" r="2.2" fill="#1f2937" />
                        {/* Smile with subtle beard line */}
                        <path d="M45 52 Q50 56 55 52" stroke="#ea580c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        <path d="M40 54 Q50 63 60 54" stroke="#4b5563" strokeWidth="1.2" strokeDasharray="1.5 1.5" fill="none" />
                        {/* Curly hair circles */}
                        <circle cx="34" cy="28" r="7" fill="#292524" />
                        <circle cx="44" cy="22" r="8" fill="#292524" />
                        <circle cx="56" cy="22" r="8" fill="#292524" />
                        <circle cx="66" cy="28" r="7" fill="#292524" />
                        <circle cx="50" cy="26" r="8" fill="#292524" />
                    </svg>
                )

            case 'avatar-6':
                // Tech Candidate 6: Female presenting, amber blazer, stylish glasses
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#78350f" />
                                <stop offset="100%" stopColor="#451a03" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg6)" />
                        {/* Professional attire */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#d97706" />
                        <path d="M43 68 L50 84 L57 68 Z" fill="#fef3c7" />
                        {/* Neck */}
                        <rect x="45" y="52" width="10" height="18" rx="3" fill="#fde68a" opacity="0.4" />
                        <rect x="45" y="52" width="10" height="18" rx="3" fill="#fed7aa" />
                        {/* Face */}
                        <ellipse cx="50" cy="43" rx="17" ry="19" fill="#fed7aa" />
                        {/* Stylish round glasses */}
                        <circle cx="42" cy="42" r="6.5" fill="none" stroke="#f59e0b" strokeWidth="1.6" />
                        <circle cx="58" cy="42" r="6.5" fill="none" stroke="#f59e0b" strokeWidth="1.6" />
                        <line x1="48.5" y1="42" x2="51.5" y2="42" stroke="#f59e0b" strokeWidth="1.6" />
                        {/* Eyes */}
                        <circle cx="42" cy="42" r="1.8" fill="#18181b" />
                        <circle cx="58" cy="42" r="1.8" fill="#18181b" />
                        {/* Smile */}
                        <path d="M46 53 Q50 57 54 53" stroke="#b45309" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        {/* Hair bun */}
                        <circle cx="50" cy="18" r="9" fill="#3f2e22" />
                        <path d="M30 42 C30 24, 40 22, 50 22 C60 22, 70 24, 70 42 C65 30, 56 28, 50 28 C44 28, 35 30, 30 42 Z" fill="#3f2e22" />
                    </svg>
                )

            case 'avatar-7':
                // Tech Candidate 7: Male presenting, indigo collar, neat beard, headphones
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg7" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#312e81" />
                                <stop offset="100%" stopColor="#1e1b4b" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg7)" />
                        {/* Attire */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#4f46e5" />
                        <path d="M42 68 L50 80 L58 68 Z" fill="#3730a3" />
                        {/* Neck */}
                        <rect x="44" y="52" width="12" height="18" rx="4" fill="#fed7aa" />
                        {/* Face */}
                        <ellipse cx="50" cy="42" rx="18" ry="19" fill="#fed7aa" />
                        {/* Trimmed beard */}
                        <path d="M37 44 C37 56, 44 60, 50 60 C56 60, 63 56, 63 44 C63 48, 59 56, 50 56 C41 56, 37 48, 37 44 Z" fill="#1e1b4b" />
                        {/* Eyes */}
                        <circle cx="43" cy="40" r="2.2" fill="#1e1b4b" />
                        <circle cx="57" cy="40" r="2.2" fill="#1e1b4b" />
                        {/* Smile */}
                        <path d="M46 49 Q50 52 54 49" stroke="#ea580c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        {/* Hair */}
                        <path d="M30 34 C32 20, 44 18, 50 18 C56 18, 68 20, 70 34 C64 26, 56 24, 50 24 C44 24, 36 26, 30 34 Z" fill="#1e1b4b" />
                        {/* Headset band & pads around neck */}
                        <path d="M26 38 C23 38, 23 46, 26 46 Z" fill="#818cf8" />
                        <path d="M74 38 C77 38, 77 46, 74 46 Z" fill="#818cf8" />
                    </svg>
                )

            case 'avatar-8':
                // Tech Candidate 8: Female presenting, teal attire, wavy long hair
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg8" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0f766e" />
                                <stop offset="100%" stopColor="#134e4a" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg8)" />
                        {/* Long hair back */}
                        <path d="M26 40 C26 68, 34 82, 34 82 L66 82 C66 82, 74 68, 74 40 Z" fill="#451a03" />
                        {/* Clothes */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#0d9488" />
                        <path d="M43 68 L50 82 L57 68 Z" fill="#99f6e4" />
                        {/* Neck */}
                        <rect x="45" y="52" width="10" height="18" rx="3" fill="#fed7aa" />
                        {/* Face */}
                        <ellipse cx="50" cy="42" rx="17" ry="19" fill="#ffedd5" />
                        {/* Eyes */}
                        <circle cx="43" cy="41" r="2.2" fill="#1c1917" />
                        <circle cx="57" cy="41" r="2.2" fill="#1c1917" />
                        {/* Smile */}
                        <path d="M46 51 Q50 55 54 51" stroke="#e11d48" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        {/* Front wavy hair */}
                        <path d="M30 40 C32 23, 44 19, 50 19 C56 19, 68 23, 70 40 C66 32, 57 28, 50 28 C43 28, 34 32, 30 40 Z" fill="#451a03" />
                    </svg>
                )

            case 'avatar-9':
                // Tech Candidate 9: Male presenting, rose accent hoodie, modern fade
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg9" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#881337" />
                                <stop offset="100%" stopColor="#4c0519" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg9)" />
                        {/* Hoodie */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#e11d48" />
                        <circle cx="50" cy="74" r="5" fill="#be123c" />
                        {/* Neck */}
                        <rect x="44" y="52" width="12" height="18" rx="4" fill="#fed7aa" />
                        {/* Face */}
                        <ellipse cx="50" cy="42" rx="18" ry="19" fill="#fde68a" opacity="0.3" />
                        <ellipse cx="50" cy="42" rx="18" ry="19" fill="#fed7aa" />
                        {/* Eyes */}
                        <circle cx="43" cy="41" r="2.2" fill="#111827" />
                        <circle cx="57" cy="41" r="2.2" fill="#111827" />
                        {/* Modern fade haircut */}
                        <path d="M31 36 C32 19, 44 16, 50 16 C56 16, 68 19, 69 36 C64 24, 55 22, 50 22 C45 22, 36 24, 31 36 Z" fill="#111827" />
                        {/* Smile */}
                        <path d="M45 51 Q50 55 55 51" stroke="#ea580c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </svg>
                )

            case 'avatar-10':
            default:
                // Tech Candidate 10: Female presenting, purple jacket, leadership look
                return (
                    <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="bg10" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#581c87" />
                                <stop offset="100%" stopColor="#3b0764" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#bg10)" />
                        {/* Jacket */}
                        <path d="M18 96 C18 76, 32 68, 50 68 C68 68, 82 76, 82 96 Z" fill="#9333ea" />
                        <path d="M40 68 L50 90 L60 68 Z" fill="#f5d0fe" />
                        {/* Neck */}
                        <rect x="45" y="52" width="10" height="18" rx="3" fill="#fed7aa" />
                        {/* Face */}
                        <ellipse cx="50" cy="42" rx="17" ry="19" fill="#ffedd5" />
                        {/* Eyes */}
                        <circle cx="43" cy="41" r="2.2" fill="#09090b" />
                        <circle cx="57" cy="41" r="2.2" fill="#09090b" />
                        {/* Smile */}
                        <path d="M46 51 Q50 55 54 51" stroke="#c026d3" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        {/* Short stylish coiffed hair */}
                        <path d="M30 38 C30 20, 44 16, 52 16 C63 16, 71 22, 71 36 C64 27, 56 25, 48 25 C39 25, 33 30, 30 38 Z" fill="#3b0764" />
                        <circle cx="31" cy="46" r="1.8" fill="#e879f9" />
                        <circle cx="69" cy="46" r="1.8" fill="#e879f9" />
                    </svg>
                )
        }
    }

    return (
        <div
            className={`career-avatar-badge ${className}`}
            style={{
                width: sizePx,
                height: sizePx,
                minWidth: sizePx,
                minHeight: sizePx,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}
            title={alt}
            aria-label={alt}
        >
            {renderAvatarGraphic()}
        </div>
    )
}

export default Avatar
