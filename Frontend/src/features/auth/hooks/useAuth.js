import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, updateProfile, changePassword, resetPassword } from "../services/auth.api";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, identifier, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, identifier, password })
            setUser(data.user)
            return data
        } catch (err) {
            setUser(null)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return data
        } catch (err) {
            setUser(null)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async ({ username, gender, avatar }) => {
        const data = await updateProfile({ username, gender, avatar })
        if (data?.user) {
            setUser(data.user)
        }
        return data
    }

    const handleChangePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
        const data = await changePassword({ currentPassword, newPassword, confirmPassword })
        return data
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    const handleResetPassword = async ({ identifier, email, newPassword }) => {
        return await resetPassword({ identifier, email, newPassword })
    }

    return {
        user,
        setUser,
        loading,
        handleRegister,
        handleLogin,
        handleLogout,
        handleUpdateProfile,
        handleChangePassword,
        handleResetPassword
    }
}