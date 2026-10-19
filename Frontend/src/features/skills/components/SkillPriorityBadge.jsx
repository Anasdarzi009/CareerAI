import React from 'react'

export const SkillPriorityBadge = ({ priority }) => {
    if (!priority) return null

    const p = priority.toUpperCase()

    switch (p) {
        case 'HIGH':
            return (
                <span className="priority-badge priority-badge--high">
                    <span className="priority-dot" />
                    <span>HIGH PRIORITY</span>
                </span>
            )
        case 'MEDIUM':
            return (
                <span className="priority-badge priority-badge--medium">
                    <span className="priority-dot" />
                    <span>MEDIUM PRIORITY</span>
                </span>
            )
        case 'LOW':
            return (
                <span className="priority-badge priority-badge--low">
                    <span className="priority-dot" />
                    <span>LOW PRIORITY</span>
                </span>
            )
        default:
            return <span className="priority-badge">{priority}</span>
    }
}

export default SkillPriorityBadge
