import api from './api'

/**
 * Session Service - API calls for session management
 */
const sessionService = {
    /**
     * Get all sessions with filters and pagination
     */
    getSessions: async (params = {}) => {
        const { data } = await api.get('/sessions', { params })
        return data
    },

    /**
     * Get upcoming sessions
     */
    getUpcomingSessions: async () => {
        const { data } = await api.get('/sessions/upcoming')
        return data
    },

    /**
     * Get today's active sessions
     */
    getTodayActiveSessions: async () => {
        const { data } = await api.get('/sessions/today')
        return data
    },

    /**
     * Get session by ID
     */
    getSessionById: async (id) => {
        const { data } = await api.get(`/sessions/${id}`)
        return data
    },

    /**
     * Create new session
     */
    createSession: async (sessionData) => {
        console.log('=== createSession service called ===')

        // Extract studentIds and groupIds
        const { studentIds, groupIds, ...sessionDto } = sessionData

        // Create the session
        const { data } = await api.post('/sessions', sessionDto)

        // Add students if provided
        if (studentIds && studentIds.length > 0 && data.id) {
            try {
                // Send array directly, not wrapped in object
                // Controller expects [FromBody] List<string> studentIds
                await api.post(`/sessions/${data.id}/students`, studentIds)
            } catch (error) {
                console.error('Failed to add students to session:', error)
            }
        }

        // Add groups if provided
        if (groupIds && groupIds.length > 0 && data.id) {
            try {
                // Add each group sequentially
                for (const groupId of groupIds) {
                    await api.post(`/sessions/${data.id}/groups/${groupId}`)
                }
            } catch (error) {
                console.error('Failed to add groups to session:', error)
            }
        }

        return data
    },

    /**
     * Update session
     */
    updateSession: async (id, sessionData) => {
        console.log('=== updateSession service called ===')

        // Extract groupIds if present (students are usually handled via separate endpoints for add/remove in edit mode, 
        // but if we want to sync groups we need logic here)
        const { groupIds, ...sessionDto } = sessionData

        const { data } = await api.put(`/sessions/${id}`, sessionDto)

        // If groupIds provided, sync groups (this requires knowing current groups or just trying to add/remove)
        // Since we don't have a "SyncGroups" endpoint, we'll need to do it client-side or here.
        // For simplicity in this iteration, we will assume the caller might handle it OR we implement a basic sync here if we can fetch current groups.
        // But fetching current groups here might be expensive. 
        // Let's rely on the Modal to pass the diff or just Handle add/remove in the modal? 
        // NO, the service should handle "saving the form state".

        if (groupIds) {
            try {
                // Fetch current session details to get assigned groups
                // Note: We need to ensure getSessionById returns assignedGroups (we just added it to DTO)
                const currentSessionResponse = await api.get(`/sessions/${id}`)
                const currentGroups = currentSessionResponse.data.assignedGroups || []
                const currentGroupIds = currentGroups.map(g => g.id)

                // Calculate changes
                const groupsToAdd = groupIds.filter(gid => !currentGroupIds.includes(gid))
                const groupsToRemove = currentGroupIds.filter(gid => !groupIds.includes(gid))

                // Execute changes
                for (const gid of groupsToAdd) {
                    await api.post(`/sessions/${id}/groups/${gid}`)
                }
                for (const gid of groupsToRemove) {
                    await api.delete(`/sessions/${id}/groups/${gid}`)
                }
            } catch (error) {
                console.error('Failed to sync groups:', error)
            }
        }

        return data
    },

    /**
     * Delete session
     */
    deleteSession: async (id) => {
        const { data } = await api.delete(`/sessions/${id}`)
        return data
    },

    /**
     * Add students to session
     */
    addStudentsToSession: async (sessionId, studentIds) => {
        const { data } = await api.post(`/sessions/${sessionId}/students`, { studentIds })
        return data
    },

    /**
     * Remove student from session
     */
    removeStudentFromSession: async (sessionId, studentId) => {
        const { data } = await api.delete(`/sessions/${sessionId}/students/${studentId}`)
        return data
    },

    /**
     * Get student's sessions
     */
    getStudentSessions: async (studentId) => {
        const { data } = await api.get(`/sessions/student/${studentId}`)
        return data
    },

    /**
     * Add group to session
     */
    addGroupToSession: async (sessionId, groupId) => {
        const { data } = await api.post(`/sessions/${sessionId}/groups/${groupId}`)
        return data
    },

    /**
     * Remove group from session
     */
    removeGroupFromSession: async (sessionId, groupId) => {
        const { data } = await api.delete(`/sessions/${sessionId}/groups/${groupId}`)
        return data
    },
}

export default sessionService
