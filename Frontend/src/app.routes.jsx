import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import Account from "./features/auth/pages/Account";
import Dashboard from "./features/dashboard/pages/Dashboard";
import ResumeProfile from "./features/profile/pages/ResumeProfile";
import JobsList from "./features/jobs/pages/JobsList";
import JobDetails from "./features/jobs/pages/JobDetails";
import Applications from "./features/jobs/pages/Applications";
import SkillGapMatrix from "./features/skills/pages/SkillGapMatrix";
import CareerRoadmap from "./features/roadmap/pages/CareerRoadmap";
import PlacementReadiness from "./features/placement/pages/PlacementReadiness";
import CodingRound from "./features/coding/pages/CodingRound";
import CodingPractice from "./features/coding/pages/CodingPractice";
import CodingAssessment from "./features/coding/pages/CodingAssessment";
import PlacementDrivesHub from "./features/drives/pages/PlacementDrivesHub";
import DriveRunner from "./features/drives/pages/DriveRunner";
import PlacementAnalytics from "./features/analytics/pages/PlacementAnalytics";
import AptitudeRound from "./features/aptitude/pages/AptitudeRound";
import AptitudePractice from "./features/aptitude/pages/AptitudePractice";
import AptitudeAssessment from "./features/aptitude/pages/AptitudeAssessment";
import InterviewRoundHub from "./features/interview/pages/InterviewRoundHub";
import InterviewRoundRunner from "./features/interview/pages/InterviewRoundRunner";
import InterviewResult from "./features/interview/pages/InterviewResult";


export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Dashboard /></Protected>
    },
    {
        path: "/dashboard",
        element: <Protected><Dashboard /></Protected>
    },
    {
        path: "/jobs",
        element: <Protected><JobsList /></Protected>
    },
    {
        path: "/jobs/applications",
        element: <Protected><Applications /></Protected>
    },
    {
        path: "/jobs/:jobId",
        element: <Protected><JobDetails /></Protected>
    },
    {
        path: "/skill-gap",
        element: <Protected><SkillGapMatrix /></Protected>
    },
    {
        path: "/skills",
        element: <Protected><SkillGapMatrix /></Protected>
    },
    {
        path: "/career-roadmap",
        element: <Protected><CareerRoadmap /></Protected>
    },
    {
        path: "/roadmap",
        element: <Protected><CareerRoadmap /></Protected>
    },
    {
        path: "/placement-readiness",
        element: <Protected><PlacementReadiness /></Protected>
    },
    {
        path: "/placement",
        element: <Protected><PlacementReadiness /></Protected>
    },
    {
        path: "/aptitude",
        element: <Protected><AptitudeRound /></Protected>
    },
    {
        path: "/aptitude-round",
        element: <Protected><AptitudeRound /></Protected>
    },
    {
        path: "/aptitude/practice/:id",
        element: <Protected><AptitudePractice /></Protected>
    },
    {
        path: "/aptitude/assessment/:id",
        element: <Protected><AptitudeAssessment /></Protected>
    },
    {
        path: "/coding",
        element: <Protected><CodingRound /></Protected>
    },
    {
        path: "/coding-round",
        element: <Protected><CodingRound /></Protected>
    },
    {
        path: "/coding/practice/:id",
        element: <Protected><CodingPractice /></Protected>
    },
    {
        path: "/coding/assessment/:id",
        element: <Protected><CodingAssessment /></Protected>
    },
    {
        path: "/placement-drives",
        element: <Protected><PlacementDrivesHub /></Protected>
    },
    {
        path: "/mock-drive",
        element: <Protected><PlacementDrivesHub /></Protected>
    },
    {
        path: "/placement-drives/runner/:id",
        element: <Protected><DriveRunner /></Protected>
    },
    {
        path: "/placement-analytics",
        element: <Protected><PlacementAnalytics /></Protected>
    },
    {
        path: "/offer-predictor",
        element: <Protected><PlacementAnalytics /></Protected>
    },
    {
        path: "/resume-profile",
        element: <Protected><ResumeProfile /></Protected>
    },
    {
        path: "/profile",
        element: <Protected><ResumeProfile /></Protected>
    },
    {
        path: "/interview-round",
        element: <Protected><InterviewRoundHub /></Protected>
    },
    {
        path: "/interview-round/runner/:id",
        element: <Protected><InterviewRoundRunner /></Protected>
    },
    {
        path: "/interview-round/result/:id",
        element: <Protected><InterviewResult /></Protected>
    },
    {
        path: "/mock-interview",
        element: <Protected><InterviewRoundHub /></Protected>
    },
    {
        path: "/interview-prep",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/account",
        element: <Protected><Account /></Protected>
    }
])