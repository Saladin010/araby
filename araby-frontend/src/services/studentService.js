import api from './api'

/**
 * Student Service - API calls for student management
 */
const studentService = {
    /**
     * Get all students with filters and pagination
     */
    getStudents: async (params = {}) => {
        const { data } = await api.get('/usermanagement/students', { params })
        return data
    },

    /**
     * Get all assistants with filters and pagination
     */
    getAssistants: async (params = {}) => {
        const { data } = await api.get('/usermanagement/assistants', { params })
        return data
    },

    /**
     * Get student by ID
     */
    getStudentById: async (id) => {
        const { data } = await api.get(`/usermanagement/${id}`)
        return data
    },

    /**
     * Create new student
     */
    createStudent: async (studentData) => {
        const { data } = await api.post('/usermanagement/student', studentData)
        return data
    },

    /**
     * Create new assistant
     */
    createAssistant: async (assistantData) => {
        const { data } = await api.post('/usermanagement/assistant', assistantData)
        return data
    },

    /**
     * Update student
     */
    updateStudent: async (id, studentData) => {
        const { data } = await api.put(`/usermanagement/${id}`, studentData)
        return data
    },

    /**
     * Delete student
     */
    deleteStudent: async (id) => {
        const { data } = await api.delete(`/usermanagement/${id}`)
        return data
    },

    /**
     * Toggle student active status
     */
    toggleStudentStatus: async (id) => {
        const { data } = await api.put(`/usermanagement/${id}/toggle-active`)
        return data
    },

    /**
     * Get user credentials (password) - works for both students and assistants
     */
    getStudentCredentials: async (id) => {
        const { data } = await api.get(`/usermanagement/${id}/credentials`)
        return data
    },

    /**
     * Reset student password
     */
    resetPassword: async (id, newPassword) => {
        const { data } = await api.post(`/usermanagement/${id}/reset-password`, { newPassword })
        return data
    },

    /**
     * Get student sessions
     */
    getStudentSessions: async (id) => {
        const { data } = await api.get(`/students/${id}/sessions`)
        return data
    },

    /**
     * Get student attendance
     */
    getStudentAttendance: async (id) => {
        const { data } = await api.get(`/students/${id}/attendance`)
        return data
    },

    /**
     * Get student grades
     */
    getStudentGrades: async (id) => {
        const { data } = await api.get(`/students/${id}/grades`)
        return data
    },

    /**
     * Get student payments
     */
    getStudentPayments: async (id) => {
        const { data } = await api.get(`/students/${id}/payments`)
        return data
    },
}

export default studentService
