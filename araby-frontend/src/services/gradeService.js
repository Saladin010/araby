import api from './api'

/**
 * Grade Service
 * Handles all grade-related API calls
 */
const gradeService = {
    /**
     * Create a new grade
     */
    createGrade: async (gradeData) => {
        const { data } = await api.post('/grades', {
            studentId: gradeData.studentId,
            examName: gradeData.examName,
            score: gradeData.score,
            maxScore: gradeData.maxScore,
            examDate: gradeData.examDate,
            notes: gradeData.notes || ''
        })
        return data
    },

    /**
     * Get all grades for a specific student
     */
    getGradesByStudent: async (studentId) => {
        const { data } = await api.get(`/grades/student/${studentId}`)
        return data
    },

    /**
     * Get all grades (for teachers/assistants)
     * Note: This endpoint may not exist in backend yet
     * Fallback: fetch for each student manually
     */
    getAllGrades: async () => {
        try {
            const { data } = await api.get('/grades')
            return data
        } catch (error) {
            // If endpoint doesn't exist, return empty array
            console.warn('GET /grades endpoint not available, returning empty array')
            return []
        }
    },

    /**
     * Get a specific grade by ID
     */
    getGrade: async (id) => {
        const { data } = await api.get(`/grades/${id}`)
        return data
    },

    /**
     * Update an existing grade
     */
    updateGrade: async (id, gradeData) => {
        const { data } = await api.put(`/grades/${id}`, {
            examName: gradeData.examName,
            score: gradeData.score,
            maxScore: gradeData.maxScore,
            examDate: gradeData.examDate,
            notes: gradeData.notes || ''
        })
        return data
    },

    /**
     * Delete a grade
     */
    deleteGrade: async (id) => {
        const { data } = await api.delete(`/grades/${id}`)
        return data
    },

    /**
     * Get student grade statistics
     */
    getStudentStatistics: async (studentId) => {
        const { data } = await api.get(`/grades/student/${studentId}/statistics`)
        return data
    }
}

export default gradeService
