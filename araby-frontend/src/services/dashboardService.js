import api from './api'

/**
 * Dashboard Service - API calls for dashboard data
 * Uses existing endpoints to gather dashboard statistics
 */
const dashboardService = {
    /**
     * Get teacher dashboard data
     */
    getTeacherDashboard: async () => {
        try {
            // Fetch data from multiple endpoints
            const [students, sessions, payments, grades] = await Promise.all([
                api.get('/usermanagement/students'),
                api.get('/sessions'),
                api.get('/payments'),
                api.get('/grades').catch(() => ({ data: [] })),
            ])

            // Calculate statistics
            const totalStudents = students.data?.length || 0
            const allSessions = sessions.data || []

            // Today's sessions
            const today = new Date()
            const todaySessions = allSessions.filter(s => {
                const sessionDate = new Date(s.startTime)
                return sessionDate.toDateString() === today.toDateString()
            }).length

            // Upcoming sessions
            const upcomingSessions = allSessions
                .filter(s => new Date(s.startTime) > today)
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

            // Payment calculations
            const allPayments = payments.data || []
            const pendingPayments = allPayments.filter(p =>
                p.status === 'Pending' || p.status === 'Overdue'
            )
            const pendingPaymentsAmount = pendingPayments.reduce((sum, p) =>
                sum + (p.amountDue || 0), 0
            )

            // Monthly revenue (current month)
            const currentMonth = today.getMonth()
            const currentYear = today.getFullYear()
            const monthlyRevenue = allPayments
                .filter(p => {
                    if (p.status !== 'Paid') return false
                    const paymentDate = new Date(p.paymentDate)
                    return paymentDate.getMonth() === currentMonth &&
                        paymentDate.getFullYear() === currentYear
                })
                .reduce((sum, p) => sum + (p.amountPaid || 0), 0)

            // Recent payments
            const recentPayments = allPayments
                .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                .slice(0, 5)

            // Total grades
            const totalGrades = grades.data?.length || 0

            return {
                stats: {
                    totalStudents,
                    todaySessions,
                    totalGrades,
                    pendingPayments: pendingPayments.length,
                    pendingPaymentsAmount,
                    monthlyRevenue,
                },
                upcomingSessions: upcomingSessions.slice(0, 5),
                recentPayments,
            }
        } catch (error) {
            console.error('Error fetching teacher dashboard:', error)
            throw error
        }
    },

    /**
     * Get assistant dashboard data
     */
    getAssistantDashboard: async () => {
        try {
            const [students, sessions, payments] = await Promise.all([
                api.get('/usermanagement/students'),
                api.get('/sessions'),
                api.get('/payments'),
            ])

            const totalStudents = students.data?.length || 0
            const allSessions = sessions.data || []

            // Today's sessions
            const today = new Date()
            const todaySessions = allSessions.filter(s => {
                const sessionDate = new Date(s.startTime)
                return sessionDate.toDateString() === today.toDateString()
            }).length

            // Upcoming sessions
            const upcomingSessions = allSessions
                .filter(s => new Date(s.startTime) > today)
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

            // Payment calculations
            const allPayments = payments.data || []
            const pendingPayments = allPayments.filter(p =>
                p.status === 'Pending' || p.status === 'Overdue'
            )
            const pendingPaymentsAmount = pendingPayments.reduce((sum, p) =>
                sum + (p.amountDue || 0), 0
            )

            return {
                stats: {
                    totalStudents,
                    todaySessions,
                    pendingPayments: pendingPayments.length,
                    pendingPaymentsAmount,
                },
                upcomingSessions: upcomingSessions.slice(0, 5),
            }
        } catch (error) {
            console.error('Error fetching assistant dashboard:', error)
            throw error
        }
    },

    /**
     * Get student dashboard data
     */
    getStudentDashboard: async (studentId) => {
        try {
            const [sessions, attendance, grades, payments] = await Promise.all([
                api.get(`/sessions/student/${studentId}`),
                api.get(`/attendance/student/${studentId}`),
                api.get(`/grades/student/${studentId}`),
                api.get(`/payments/student/${studentId}`),
            ])

            const allSessions = sessions.data || []
            const upcomingSessions = allSessions.filter(s => new Date(s.startTime) > new Date())
            const attendanceRecords = attendance.data || []
            const gradeRecords = grades.data || []
            const paymentRecords = payments.data || []

            // Calculate attendance rate
            const totalAttendance = attendanceRecords.length
            const presentCount = attendanceRecords.filter(a => a.status === 1).length
            const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0

            // Calculate average grade
            const totalGrades = gradeRecords.length
            const averageGrade = totalGrades > 0
                ? Math.round(gradeRecords.reduce((sum, g) => sum + g.percentage, 0) / totalGrades)
                : 0

            // Check payment status
            const pendingPayment = paymentRecords.find(p => p.status === 'Pending' || p.status === 'Overdue')
            const paymentStatus = pendingPayment ? 'Pending' : 'Paid'
            const paymentAmount = pendingPayment?.amountDue || 0

            return {
                stats: {
                    upcomingSessions: upcomingSessions.length,
                    attendanceRate,
                    totalSessionsAttended: presentCount,
                    averageGrade,
                    paymentStatus,
                    paymentAmount,
                },
                upcomingSessions: upcomingSessions.slice(0, 5),
                recentGrades: gradeRecords.slice(0, 5),
                attendanceData: {
                    present: presentCount,
                    absent: attendanceRecords.filter(a => a.status === 2).length,
                    late: attendanceRecords.filter(a => a.status === 3).length,
                    excused: attendanceRecords.filter(a => a.status === 4).length,
                },
            }
        } catch (error) {
            console.error('Error fetching student dashboard:', error)
            throw error
        }
    },
}

export default dashboardService
