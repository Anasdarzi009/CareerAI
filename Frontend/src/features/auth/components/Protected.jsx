import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react';
import AppShell from "../../../components/layout/AppShell";

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                width: '100%',
                backgroundColor: 'var(--bg-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-sans)'
            }}>
                <span>Loading career platform...</span>
            </div>
        )
    }

    if (!user) {
        return <Navigate to={'/login'} />
    }
    
    return <AppShell>{children}</AppShell>
}

export default Protected