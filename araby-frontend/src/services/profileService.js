import api from './api'

/**
 * Profile Service
 * Handles all profile-related API calls
 */

const profileService = {
    /**
     * Get current logged-in user
     */
    getCurrentUser: async () => {
        const { data } = await api.get('/auth/current-user')
        return data
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId, profileData) => {
        const { data } = await api.put(`/usermanagement/${userId}`, profileData)
        return data
    },

    /**
     * Change password
     */
    changePassword: async (passwordData) => {
        const { data } = await api.post('/auth/change-password', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        })
        return data
    },

    /**
     * Get user settings (localStorage fallback)
     */
    getSettings: async (userId) => {
        // TODO: Implement when backend endpoint is ready
        // const { data } = await api.get(`/users/${userId}/settings`)
        // return data

        // Temporary: Use localStorage
        const settings = localStorage.getItem(`user_settings_${userId}`)
        return settings ? JSON.parse(settings) : {
            theme: 'light',
            fontSize: 'medium',
            notifications: {
                upcomingSessions: true,
                paymentReminders: true,
                newGrades: true,
                attendanceAlerts: true,
                emailNotifications: false,
                soundNotifications: true,
                notificationTiming: '1hour'
            },
            language: 'ar',
            timezone: 'Africa/Cairo',
            privacy: {
                showProfileToOthers: true,
                allowWhatsAppNotifications: false,
                shareStatistics: true
            }
        }
    },

    /**
     * Update user settings (localStorage fallback)
     */
    updateSettings: async (userId, settings) => {
        // TODO: Implement when backend endpoint is ready
        // const { data } = await api.put(`/users/${userId}/settings`, settings)
        // return data

        // Temporary: Use localStorage
        localStorage.setItem(`user_settings_${userId}`, JSON.stringify(settings))
        return { message: 'تم حفظ الإعدادات بنجاح', settings }
    },

    /**
     * Get student statistics
     */
    getStudentStatistics: async (userId) => {
        try {
            // Fetch data from student-specific endpoints
            const [sessions, attendance, grades, payments] = await Promise.all([
                api.get(`/sessions/student/${userId}`).catch(() => ({ data: [] })),
                api.get(`/attendance/student/${userId}`).catch(() => ({ data: [] })),
                api.get(`/grades/student/${userId}`).catch(() => ({ data: [] })),
                api.get(`/payments/student/${userId}`).catch(() => ({ data: [] }))
            ])

            const allSessions = sessions.data || []
            const allAttendance = attendance.data || []
            const allGrades = grades.data || []
            const allPayments = payments.data || []

            // Calculate upcoming sessions
            const now = new Date()
            const upcomingSessions = allSessions.filter(s =>
                new Date(s.startTime) > now
            ).length

            // Calculate attendance percentage
            const presentCount = allAttendance.filter(a => a.status === 1).length // 1 = Present
            const attendancePercentage = allAttendance.length > 0
                ? Math.round((presentCount / allAttendance.length) * 100)
                : 0

            // Calculate average grade
            const averageGrade = allGrades.length > 0
                ? Math.round(allGrades.reduce((sum, g) => sum + g.percentage, 0) / allGrades.length)
                : 0

            // Calculate payment status
            const totalPaid = allPayments
                .filter(p => p.status === 'Paid')
                .reduce((sum, p) => sum + (p.amountPaid || 0), 0)
            const totalPending = allPayments
                .filter(p => p.status === 'Pending' || p.status === 'Overdue')
                .reduce((sum, p) => sum + (p.amountDue || 0), 0)

            return {
                totalSessions: allSessions.length,
                upcomingSessions,
                attendancePercentage,
                averageGrade,
                totalExams: allGrades.length,
                paymentStatus: {
                    totalPaid,
                    totalPending,
                }
            }
        } catch (error) {
            console.error('Error fetching student statistics:', error)
            return {
                totalSessions: 0,
                upcomingSessions: 0,
                attendancePercentage: 0,
                averageGrade: 0,
                totalExams: 0,
                paymentStatus: {
                    totalPaid: 0,
                    totalPending: 0,
                }
            }
        }
    },

    /**
     * Upload profile picture (localStorage fallback)
     */
    uploadProfilePicture: async (userId, file) => {
        // TODO: Implement when backend endpoint is ready
        // const formData = new FormData()
        // formData.append('file', file)
        // const { data } = await api.post(`/users/${userId}/profile-picture`, formData)
        // return data

        // Temporary: Convert to base64 and store in localStorage
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const base64 = e.target.result
                localStorage.setItem(`profile_picture_${userId}`, base64)
                resolve({
                    message: 'تم رفع الصورة بنجاح',
                    profilePictureUrl: base64
                })
            }
            reader.onerror = () => reject(new Error('فشل رفع الصورة'))
            reader.readAsDataURL(file)
        })
    },

    /**
     * Get profile picture (localStorage fallback)
     */
    getProfilePicture: async (userId) => {
        // Temporary: Get from localStorage
        const picture = localStorage.getItem(`profile_picture_${userId}`)
        return picture || null
    },

    /**
     * Delete profile picture (localStorage fallback)
     */
    deleteProfilePicture: async (userId) => {
        // TODO: Implement when backend endpoint is ready
        // const { data } = await api.delete(`/users/${userId}/profile-picture`)
        // return data

        // Temporary: Remove from localStorage
        localStorage.removeItem(`profile_picture_${userId}`)
        return { message: 'تم حذف الصورة بنجاح' }
    }
}

export default profileService
