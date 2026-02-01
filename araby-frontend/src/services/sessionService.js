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
        console.log('Session data received:', sessionData)

        // Extract studentIds if present
        const { studentIds, ...sessionDto } = sessionData

        console.log('Session DTO (without studentIds):', sessionDto)
        console.log('Student IDs:', studentIds)

        // Create the session
        console.log('Sending POST request to /sessions')
        const { data } = await api.post('/sessions', sessionDto)
        console.log('Session created successfully:', data)

        // If studentIds provided, add them to the session
        if (studentIds && studentIds.length > 0 && data.id) {
            console.log('Adding students to session:', data.id)
            try {
                await api.post(`/sessions/${data.id}/students`, studentIds)
                console.log('Students added successfully')
            } catch (error) {
                console.error('Failed to add students to session:', error)
                // Session created but students not added
            }
        }

        return data
    },

    /**
     * Update session
     */
    updateSession: async (id, sessionData) => {
        console.log('=== updateSession service called ===')
        console.log('Session ID:', id)
        console.log('Update data:', sessionData)

        console.log('Sending PUT request to /sessions/' + id)
        const { data } = await api.put(`/sessions/${id}`, sessionData)
        console.log('Session updated successfully:', data)

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
}

export default sessionService
