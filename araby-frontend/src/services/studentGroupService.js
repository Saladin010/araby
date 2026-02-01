import api from './api'

/**
 * Student Group Service - API calls for student group management
 */
const studentGroupService = {
    /**
     * Get all student groups
     */
    getStudentGroups: async (params = {}) => {
        const { data } = await api.get('/student-groups', { params })
        return data
    },

    /**
     * Get student group by ID
     */
    getStudentGroupById: async (id) => {
        const { data } = await api.get(`/student-groups/${id}`)
        return data
    },

    /**
     * Create new student group
     */
    createStudentGroup: async (groupData) => {
        const { data } = await api.post('/student-groups', groupData)
        return data
    },

    /**
     * Update student group
     */
    updateStudentGroup: async (id, groupData) => {
        const { data } = await api.put(`/student-groups/${id}`, groupData)
        return data
    },

    /**
     * Delete student group
     */
    deleteStudentGroup: async (id) => {
        const { data } = await api.delete(`/student-groups/${id}`)
        return data
    },

    /**
     * Add students to group
     */
    addStudentsToGroup: async (id, studentIds) => {
        const { data } = await api.post(`/student-groups/${id}/students`, studentIds)
        return data
    },

    /**
     * Remove student from group
     */
    removeStudentFromGroup: async (groupId, studentId) => {
        const { data } = await api.delete(`/student-groups/${groupId}/students/${studentId}`)
        return data
    },

    /**
     * Get group statistics
     */
    getGroupStatistics: async (groupId) => {
        const { data } = await api.get(`/student-groups/${groupId}/statistics`)
        return data
    }
}

export default studentGroupService
