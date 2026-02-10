import api from './api'

/**
 * Attendance Service - API calls for attendance management
 */
const attendanceService = {
    /**
     * Record attendance for multiple students in a session
     */
    recordAttendance: async (sessionId, attendanceRecords, sessionDate) => {
        const results = []

        for (const record of attendanceRecords) {
            const { data } = await api.post('/attendance', {
                sessionId,
                studentId: record.studentId,
                status: record.status,
                notes: record.notes || '',
                sessionDate: sessionDate // Add sessionDate here
            })
            results.push(data)
        }

        return results
    },

    /**
     * Get attendance records for a specific session and optional date
     */
    getAttendanceBySession: async (sessionId, date = null) => {
        let url = `/attendance/session/${sessionId}`
        if (date) {
            url += `?date=${date}`
        }
        const { data } = await api.get(url)
        return data
    },

    /**
     * Get attendance records for a specific student
     */
    getAttendanceByStudent: async (studentId) => {
        const { data } = await api.get(`/attendance/student/${studentId}`)
        return data
    },

    /**
     * Get all attendance records
     */
    getAllAttendance: async () => {
        const { data } = await api.get('/attendance')
        return data
    },

    /**
     * Update an attendance record
     */
    updateAttendance: async (id, updateData) => {
        const { data } = await api.put(`/attendance/${id}`, {
            status: updateData.status,
            notes: updateData.notes || ''
        })
        return data
    },

    /**
     * Get attendance statistics for a specific student
     */
    getStudentStatistics: async (studentId) => {
        const { data } = await api.get(`/attendance/statistics/student/${studentId}`)
        return data
    },

    /**
     * Get overall attendance statistics
     */
    getOverallStatistics: async () => {
        const { data } = await api.get('/attendance/statistics/overall')
        return data
    }
}

export default attendanceService
