import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import gradeService from '../services/gradeService'
import toast from 'react-hot-toast'

/**
 * Hook to create a new grade
 */
export const useCreateGrade = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: gradeService.createGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grades'] })
            toast.success('تم حفظ الدرجة بنجاح!')
        },
        onError: (error) => {
            console.error('Create grade error:', error)
            const message = error.response?.data?.message || 'فشل حفظ الدرجة'
            toast.error(message)
        }
    })
}

/**
 * Hook to fetch grades for a specific student
 */
export const useStudentGrades = (studentId) => {
    return useQuery({
        queryKey: ['grades', 'student', studentId],
        queryFn: () => gradeService.getGradesByStudent(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

/**
 * Hook to fetch all grades (for teachers/assistants)
 */
export const useAllGrades = () => {
    return useQuery({
        queryKey: ['grades', 'all'],
        queryFn: gradeService.getAllGrades,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}

/**
 * Hook to fetch a specific grade
 */
export const useGrade = (id) => {
    return useQuery({
        queryKey: ['grades', id],
        queryFn: () => gradeService.getGrade(id),
        enabled: !!id,
    })
}

/**
 * Hook to update a grade
 */
export const useUpdateGrade = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, gradeData }) => gradeService.updateGrade(id, gradeData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grades'] })
            toast.success('تم تحديث الدرجة بنجاح!')
        },
        onError: (error) => {
            console.error('Update grade error:', error)
            const message = error.response?.data?.message || 'فشل تحديث الدرجة'
            toast.error(message)
        }
    })
}

/**
 * Hook to delete a grade
 */
export const useDeleteGrade = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: gradeService.deleteGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['grades'] })
            toast.success('تم حذف الدرجة بنجاح!')
        },
        onError: (error) => {
            console.error('Delete grade error:', error)
            toast.error('فشل حذف الدرجة')
        }
    })
}

/**
 * Hook to fetch student grade statistics
 */
export const useStudentGradeStatistics = (studentId) => {
    return useQuery({
        queryKey: ['grades', 'student', studentId, 'statistics'],
        queryFn: () => gradeService.getStudentStatistics(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    })
}
