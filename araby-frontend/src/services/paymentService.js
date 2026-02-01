import api from './api'

/**
 * Payment Service - API calls for payment management
 */
const paymentService = {
    /**
     * Get all payments with optional filters
     */
    getPayments: async (filters = {}) => {
        const params = new URLSearchParams()

        if (filters.studentId) params.append('studentId', filters.studentId)
        if (filters.feeTypeId) params.append('feeTypeId', filters.feeTypeId)
        if (filters.status) params.append('status', filters.status)
        if (filters.startDate) params.append('startDate', filters.startDate)
        if (filters.endDate) params.append('endDate', filters.endDate)

        const { data } = await api.get(`/payments?${params.toString()}`)
        return data
    },

    /**
     * Get payment by ID
     */
    getPaymentById: async (id) => {
        const { data } = await api.get(`/payments/${id}`)
        return data
    },

    /**
     * Get payments for a specific student
     */
    getStudentPayments: async (studentId) => {
        const { data } = await api.get(`/payments/student/${studentId}`)
        return data
    },

    /**
     * Create new payment
     */
    createPayment: async (paymentData) => {
        const { data } = await api.post('/payments', {
            studentId: paymentData.studentId, // String - match backend DTO
            feeTypeId: paymentData.feeTypeId, // Integer
            amountPaid: paymentData.amount, // Backend expects 'amountPaid' not 'amount'
            paymentDate: paymentData.paymentDate,
            periodStart: paymentData.periodStart || paymentData.paymentDate, // Required by backend
            periodEnd: paymentData.periodEnd || paymentData.paymentDate, // Required by backend
            notes: paymentData.notes || ''
        })
        return data
    },

    /**
     * Update payment status
     */
    updatePaymentStatus: async (id, status) => {
        const { data } = await api.put(`/payments/${id}/status`, { status })
        return data
    },

    /**
     * Get pending payments
     */
    getPendingPayments: async () => {
        const { data } = await api.get('/payments/pending')
        return data
    },

    /**
     * Get overdue payments
     */
    getOverduePayments: async () => {
        const { data } = await api.get('/payments/overdue')
        return data
    },

    /**
     * Get payment statistics
     */
    getPaymentStatistics: async () => {
        const { data } = await api.get('/payments/statistics')
        return data
    },

    /**
     * Assign fee to students
     */
    assignFee: async (feeData) => {
        const { data } = await api.post('/payments/assign', feeData)
        return data
    },

    /**
     * Record payment against assigned fee
     */
    recordPaymentAgainstFee: async (paymentId, amountPaid) => {
        const { data } = await api.post(`/payments/${paymentId}/pay`, { amountPaid })
        return data
    }
}

export default paymentService
