import api from './api'

/**
 * Report Service
 * API calls for all report types
 */
const reportService = {
    /**
     * Get monthly financial report
     */
    getFinancialReport: async (year, month) => {
        const { data } = await api.get('/reports/financial/monthly', {
            params: { year, month }
        })
        return data
    },

    /**
     * Get attendance summary report
     */
    getAttendanceSummary: async () => {
        const { data } = await api.get('/reports/attendance/summary')
        return data
    },

    /**
     * Get student performance report
     */
    getPerformanceReport: async () => {
        const { data } = await api.get('/reports/students/performance')
        return data
    },

    /**
     * Get payment defaulters report
     */
    getDefaulters: async () => {
        const { data } = await api.get('/reports/payments/defaulters')
        return data
    }
}

export default reportService
