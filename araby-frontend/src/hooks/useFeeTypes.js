import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import feeTypeService from '../services/feeTypeService'
import toast from 'react-hot-toast'

/**
 * Hook to fetch all fee types
 */
export const useFeeTypes = () => {
    return useQuery({
        queryKey: ['feeTypes'],
        queryFn: feeTypeService.getFeeTypes,
        staleTime: 1000 * 60 * 10, // 10 minutes
    })
}

/**
 * Hook to fetch fee type by ID
 */
export const useFeeType = (id) => {
    return useQuery({
        queryKey: ['feeType', id],
        queryFn: () => feeTypeService.getFeeTypeById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    })
}

/**
 * Hook to create fee type
 */
export const useCreateFeeType = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: feeTypeService.createFeeType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feeTypes'] })
            queryClient.invalidateQueries({ queryKey: ['studentGroups'] })
            queryClient.invalidateQueries({ queryKey: ['studentGroup'] }) // Invalidate all group details
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            toast.success('تم إضافة نوع المصروف بنجاح')
        },
        onError: (error) => {
            console.error('Create fee type error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء إضافة نوع المصروف')
        },
    })
}

/**
 * Hook to update fee type
 */
export const useUpdateFeeType = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => feeTypeService.updateFeeType(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['feeTypes'] })
            queryClient.invalidateQueries({ queryKey: ['feeType', variables.id] })
            toast.success('تم تحديث نوع المصروف بنجاح')
        },
        onError: (error) => {
            console.error('Update fee type error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث نوع المصروف')
        },
    })
}

/**
 * Hook to delete fee type
 */
export const useDeleteFeeType = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: feeTypeService.deleteFeeType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feeTypes'] })
            toast.success('تم حذف نوع المصروف بنجاح')
        },
        onError: (error) => {
            console.error('Delete fee type error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف نوع المصروف')
        },
    })
}

/**
 * Hook to assign groups to fee type
 */
export const useAssignGroups = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, groupIds, autoAssignToMembers }) =>
            feeTypeService.assignGroups(id, groupIds, autoAssignToMembers),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['feeTypes'] })
            queryClient.invalidateQueries({ queryKey: ['feeType', variables.id] })
            queryClient.invalidateQueries({ queryKey: ['studentGroups'] })
            queryClient.invalidateQueries({ queryKey: ['studentGroup'] }) // Invalidate all group details
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            toast.success('تم ربط المجموعات بنجاح')
        },
        onError: (error) => {
            console.error('Assign groups error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء ربط المجموعات')
        },
    })
}
