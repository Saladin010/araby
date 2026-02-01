import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import studentGroupService from '../services/studentGroupService'
import toast from 'react-hot-toast'

/**
 * Hook to fetch student groups list
 */
export const useStudentGroups = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: ['studentGroups', filters],
        queryFn: () => studentGroupService.getStudentGroups(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Hook to fetch single student group details
 */
export const useStudentGroup = (id, options = {}) => {
    return useQuery({
        queryKey: ['studentGroup', id],
        queryFn: () => studentGroupService.getStudentGroupById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        ...options,
    })
}

/**
 * Hook to create new student group
 */
export const useCreateStudentGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentGroupService.createStudentGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentGroups'] })
            toast.success('تم إنشاء المجموعة بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'فشل إنشاء المجموعة')
        },
    })
}

/**
 * Hook to update student group
 */
export const useUpdateStudentGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => studentGroupService.updateStudentGroup(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['studentGroups'] })
            queryClient.invalidateQueries({ queryKey: ['studentGroup', variables.id] })
            toast.success('تم تحديث المجموعة بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'فشل تحديث المجموعة')
        },
    })
}

/**
 * Hook to delete student group
 */
export const useDeleteStudentGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: studentGroupService.deleteStudentGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studentGroups'] })
            toast.success('تم حذف المجموعة بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'فشل حذف المجموعة')
        },
    })
}

/**
 * Hook to add students to group
 */
export const useAddStudentsToGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ groupId, studentIds }) =>
            studentGroupService.addStudentsToGroup(groupId, studentIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['studentGroups'] })
            queryClient.invalidateQueries({ queryKey: ['studentGroup', variables.groupId] })
            toast.success('تم إضافة الطلاب للمجموعة بنجاح')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'فشل إضافة الطلاب')
        },
    })
}

/**
 * Hook to remove student from group
 */
export const useRemoveStudentFromGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ groupId, studentId }) =>
            studentGroupService.removeStudentFromGroup(groupId, studentId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['studentGroups'] })
            queryClient.invalidateQueries({ queryKey: ['studentGroup', variables.groupId] })
            toast.success('تم إزالة الطالب من المجموعة')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'فشل إزالة الطالب')
        },
    })
}

/**
 * Hook to fetch group statistics
 */
export const useGroupStatistics = (groupId, options = {}) => {
    return useQuery({
        queryKey: ['groupStatistics', groupId],
        queryFn: () => studentGroupService.getGroupStatistics(groupId),
        enabled: !!groupId,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    })
}
