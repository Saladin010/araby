import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            const currentUser = authService.getCurrentUser()
            const token = authService.getToken()

            if (currentUser && token) {
                setUser(currentUser)
                setIsAuthenticated(true)
            }
            setIsLoading(false)
        }

        checkAuth()
    }, [])

    // Login function
    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials)
            setUser({
                userId: data.userId,
                userName: data.userName,
                fullName: data.fullName,
                role: data.role,
            })
            setIsAuthenticated(true)

            // Show success toast
            toast.success('تم تسجيل الدخول بنجاح')

            // Redirect based on role
            setTimeout(() => {
                navigate('/dashboard')
            }, 500)

            return data
        } catch (error) {
            toast.error(error.message || 'اسم المستخدم أو كلمة المرور غير صحيحة')
            throw error
        }
    }

    // Logout function
    const logout = () => {
        authService.logout()
        setUser(null)
        setIsAuthenticated(false)
        toast.success('تم تسجيل الخروج بنجاح')
        navigate('/login')
    }

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
