import React from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../../interview/hooks/useInterview'
import DashboardHeader from '../components/DashboardHeader'
import MetricsGrid from '../components/MetricsGrid'
import ContinuePrepCard from '../components/ContinuePrepCard'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'
import ModuleJourneyGrid from '../components/ModuleJourneyGrid'
import ProgressPipeline from '../components/ProgressPipeline'
import RecommendedJobsSection from '../components/RecommendedJobsSection'
import '../style/dashboard.scss'

export const Dashboard = () => {
    const { user } = useAuth()
    const { reports = [] } = useInterview()

    const username = user?.username || user?.email?.split('@')[0] || 'Candidate'
    const hasPlans = reports && reports.length > 0
    const recentPlan = hasPlans ? reports[0] : null

    // Calculate overall readiness average if reports exist
    const overallReadiness = hasPlans
        ? Math.round(reports.reduce((acc, r) => acc + (Number(r.matchScore) || 0), 0) / reports.length)
        : null

    return (
        <div className="dashboard-page">
            {/* ── 1. Top Dashboard Header with Real Username & Readiness Card ── */}
            <DashboardHeader
                username={username}
                overallReadiness={overallReadiness}
                hasPlans={hasPlans}
            />

            {/* ── 2. Key Metrics Grid (Real data where available / Not assessed yet) ── */}
            <MetricsGrid reports={reports} />

            {/* ── 3. Split Main Content: Continue Prep + Quick Actions / Activity ── */}
            <div className="dashboard-main-split">
                {/* Left Column: Continue Preparation */}
                <div className="dashboard-main-col">
                    <ContinuePrepCard recentPlan={recentPlan} />
                </div>

                {/* Right Column: Quick Actions & Recent Activity Stack */}
                <div className="dashboard-side-stack">
                    <QuickActions />
                    <RecentActivity reports={reports} />
                </div>
            </div>

            {/* ── 4. Recommended Opportunities Section ── */}
            <RecommendedJobsSection />

            {/* ── 5. Preparation Progress Visual Pipeline ── */}
            <ProgressPipeline user={user} reports={reports} />

            {/* ── 6. Career Journey Platform Modules ── */}
            <ModuleJourneyGrid />
        </div>
    )
}

export default Dashboard
