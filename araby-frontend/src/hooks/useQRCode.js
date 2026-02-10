import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as qrCodeService from '../services/qrCodeService'
import toast from 'react-hot-toast'

/**
 * Hook to get student QR code data
 * @param {string} studentId - Student user ID
 */
export const useStudentQRData = (studentId) => {
    return useQuery({
        queryKey: ['qr-code', studentId],
        queryFn: () => qrCodeService.getStudentQRData(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

/**
 * Hook to scan QR code and record attendance
 */
export const useScanQRCode = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: qrCodeService.scanQRCode,
        onSuccess: (result) => {
            if (result.success) {
                // Play success sound
                try {
                    const audio = new Audio('/sounds/success.mp3')
                    audio.volume = 0.5
                    audio.play().catch(() => { })
                } catch (err) {
                    // Sound not available
                }

                // Vibrate if supported
                if ('vibrate' in navigator) {
                    navigator.vibrate(200)
                }

                // Invalidate attendance queries to refresh data
                queryClient.invalidateQueries({ queryKey: ['attendance'] })
                queryClient.invalidateQueries({ queryKey: ['scan-history'] })

                toast.success(result.message || 'تم تسجيل الحضور بنجاح')
            } else {
                // Play error sound
                try {
                    const audio = new Audio('/sounds/error.mp3')
                    audio.volume = 0.5
                    audio.play().catch(() => { })
                } catch (err) {
                    // Sound not available
                }

                toast.error(result.message || 'فشل تسجيل الحضور')
            }
        },
        onError: (error) => {
            console.error('Scan error:', error)
            toast.error(error.response?.data?.message || 'فشل تسجيل الحضور')

            // Play error sound
            try {
                const audio = new Audio('/sounds/error.mp3')
                audio.volume = 0.5
                audio.play().catch(() => { })
            } catch (err) {
                // Sound not available
            }
        },
    })
}
