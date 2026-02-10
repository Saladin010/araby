import axios from 'axios'

const API_URL = 'https://sasa1221-001-site1.site4future.com/api'
// const API_URL = 'https://localhost:7239/api'

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth Service
const authService = {
    // Login
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials)
            const { token, userId, userName, fullName, role } = response.data

            // Store token and user info
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify({ userId, userName, fullName, role }))

            return response.data
        } catch (error) {
            throw error.response?.data || { message: 'حدث خطأ أثناء تسجيل الدخول' }
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token')
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('token')
    },
}

export default authService
export { api }
