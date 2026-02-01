import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import sessionService from '../services/sessionService'
import toast from 'react-hot-toast'

/**
 * Hook to fetch sessions with filters
 */
export const useSessions = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: ['sessions', filters],
        queryFn: () => sessionService.getSessions(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Hook to fetch upcoming sessions
 */
export const useUpcomingSessions = () => {
    return useQuery({
        queryKey: ['upcomingSessions'],
        queryFn: sessionService.getUpcomingSessions,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}

/**
 * Hook to fetch session details
 */
export const useSessionDetails = (id, options = {}) => {
    return useQuery({
        queryKey: ['session', id],
        queryFn: () => sessionService.getSessionById(id),
        enabled: !!id,
        ...options,
    })
}

/**
 * Hook to create new session
 */
export const useCreateSession = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: sessionService.createSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            queryClient.invalidateQueries({ queryKey: ['upcomingSessions'] })
            toast.success('تم إضافة الحصة بنجاح')
        },
        onError: (error) => {
            console.error('=== Create session error ===')
            console.error('Full error:', error)
            console.error('Error response:', error.response)
            console.error('Error response data:', error.response?.data)
            console.error('Error response status:', error.response?.status)
            console.error('Error response headers:', error.response?.headers)

            let errorMessage = 'حدث خطأ أثناء إضافة الحصة'

            if (error.response?.data) {
                const data = error.response.data
                console.error('Backend error data:', data)

                if (data.errors) {
                    console.error('Validation errors:', data.errors)
                    const errors = Object.values(data.errors).flat()
                    errorMessage = errors.join(', ')
                } else if (data.message) {
                    errorMessage = data.message
                } else if (typeof data === 'string') {
                    errorMessage = data
                }
            }

            toast.error(errorMessage)
        },
    })
}

/**
 * Hook to update session
 */
export const useUpdateSession = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => sessionService.updateSession(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            queryClient.invalidateQueries({ queryKey: ['session', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['upcomingSessions'] })
            toast.success('تم تحديث الحصة بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث الحصة')
        },
    })
}

/**
 * Hook to delete session
 */
export const useDeleteSession = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: sessionService.deleteSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            queryClient.invalidateQueries({ queryKey: ['upcomingSessions'] })
            toast.success('تم حذف الحصة بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف الحصة')
        },
    })
}

/**
 * Hook to manage session students
 */
export const useSessionStudents = (sessionId) => {
    const queryClient = useQueryClient()

    const addStudents = useMutation({
        mutationFn: (studentIds) => sessionService.addStudentsToSession(sessionId, studentIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            toast.success('تم إضافة الطلاب بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة الطلاب')
        },
    })

    const removeStudent = useMutation({
        mutationFn: (studentId) => sessionService.removeStudentFromSession(sessionId, studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            toast.success('تم إزالة الطالب بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء إزالة الطالب')
        },
    })

    return { addStudents, removeStudent }
}

/**
 * Hook to get student's sessions
 */
export const useStudentSessions = (studentId) => {
    return useQuery({
        queryKey: ['studentSessions', studentId],
        queryFn: () => sessionService.getStudentSessions(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 5,
    })
}
