import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import paymentService from '../services/paymentService'
import toast from 'react-hot-toast'

/**
 * Hook to fetch payments with filters
 */
export const usePayments = (filters = {}) => {
    return useQuery({
        queryKey: ['payments', filters],
        queryFn: () => paymentService.getPayments(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

/**
 * Hook to fetch payment by ID
 */
export const usePayment = (id) => {
    return useQuery({
        queryKey: ['payment', id],
        queryFn: () => paymentService.getPaymentById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    })
}

/**
 * Hook to fetch student payments
 */
export const useStudentPayments = (studentId) => {
    return useQuery({
        queryKey: ['payments', 'student', studentId],
        queryFn: () => paymentService.getStudentPayments(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 5,
    })
}

/**
 * Hook to create payment
 */
export const useCreatePayment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: paymentService.createPayment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            toast.success('تم تسجيل الدفعة بنجاح')
        },
        onError: (error) => {
            console.error('Create payment error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدفعة')
        },
    })
}

/**
 * Hook to update payment status
 */
export const useUpdatePaymentStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, status }) => paymentService.updatePaymentStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            toast.success('تم تحديث حالة الدفعة بنجاح')
        },
        onError: (error) => {
            console.error('Update payment status error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الدفعة')
        },
    })
}

/**
 * Hook to fetch pending payments
 */
export const usePendingPayments = () => {
    return useQuery({
        queryKey: ['payments', 'pending'],
        queryFn: paymentService.getPendingPayments,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}

/**
 * Hook to fetch overdue payments
 */
export const useOverduePayments = () => {
    return useQuery({
        queryKey: ['payments', 'overdue'],
        queryFn: paymentService.getOverduePayments,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}

/**
 * Hook to fetch payment statistics
 */
export const usePaymentStatistics = () => {
    return useQuery({
        queryKey: ['payments', 'statistics'],
        queryFn: paymentService.getPaymentStatistics,
        staleTime: 1000 * 60 * 10, // 10 minutes
    })
}

/**
 * Hook to assign fee to students
 */
export const useAssignFee = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: paymentService.assignFee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            toast.success('تم تعيين الرسوم بنجاح')
        },
        onError: (error) => {
            console.error('Assign fee error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تعيين الرسوم')
        },
    })
}

/**
 * Hook to record payment against fee
 */
export const useRecordPaymentAgainstFee = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ paymentId, amountPaid }) =>
            paymentService.recordPaymentAgainstFee(paymentId, amountPaid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] })
            toast.success('تم تسجيل الدفعة بنجاح')
        },
        onError: (error) => {
            console.error('Record payment error:', error)
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدفعة')
        },
    })
}
