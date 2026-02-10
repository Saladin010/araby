import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import attendanceService from '../services/attendanceService'
import toast from 'react-hot-toast'

/**
 * Hook to record attendance for a session
 */
export const useRecordAttendance = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ sessionId, records, sessionDate }) =>
            attendanceService.recordAttendance(sessionId, records, sessionDate),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] })
            queryClient.invalidateQueries({ queryKey: ['attendance', 'session', variables.sessionId] })
            toast.success('تم تسجيل الحضور بنجاح')
        },
        onError: (error) => {
            console.error('Record attendance error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الحضور')
        },
    })
}

/**
 * Hook to fetch attendance records for a session
 */
export const useAttendanceBySession = (sessionId, date = null, options = {}) => {
    return useQuery({
        queryKey: ['attendance', 'session', sessionId, date], // Add date to queryKey
        queryFn: () => attendanceService.getAttendanceBySession(sessionId, date),
        enabled: !!sessionId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Hook to fetch attendance records for a student
 */
export const useAttendanceByStudent = (studentId, options = {}) => {
    return useQuery({
        queryKey: ['attendance', 'student', studentId],
        queryFn: () => attendanceService.getAttendanceByStudent(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Hook to fetch all attendance records
 */
export const useAllAttendance = (options = {}) => {
    return useQuery({
        queryKey: ['attendance', 'all'],
        queryFn: () => attendanceService.getAllAttendance(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Hook to update an attendance record
 */
export const useUpdateAttendance = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => attendanceService.updateAttendance(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] })
            toast.success('تم تحديث سجل الحضور بنجاح')
        },
        onError: (error) => {
            console.error('Update attendance error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث الحضور')
        },
    })
}

/**
 * Hook to fetch student attendance statistics
 */
export const useStudentStatistics = (studentId) => {
    return useQuery({
        queryKey: ['attendance', 'statistics', 'student', studentId],
        queryFn: () => attendanceService.getStudentStatistics(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    })
}

/**
 * Hook to fetch overall attendance statistics
 */
export const useOverallStatistics = () => {
    return useQuery({
        queryKey: ['attendance', 'statistics', 'overall'],
        queryFn: attendanceService.getOverallStatistics,
        staleTime: 1000 * 60 * 10, // 10 minutes
    })
}
