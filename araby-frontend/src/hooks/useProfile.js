import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import profileService from '../services/profileService'
import { useAuth } from './useAuth'

/**
 * Custom hooks for profile management
 */

/**
 * Get current user profile
 */
export const useCurrentUser = (options = {}) => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: profileService.getCurrentUser,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options
    })
}

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (profileData) => profileService.updateProfile(user.id, profileData),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        }
    })
}

/**
 * Change password
 */
export const useChangePassword = () => {
    return useMutation({
        mutationFn: profileService.changePassword
    })
}

/**
 * Get user settings
 */
export const useSettings = (options = {}) => {
    const { user } = useAuth()

    return useQuery({
        queryKey: ['userSettings', user?.id],
        queryFn: () => profileService.getSettings(user.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options
    })
}

/**
 * Update user settings
 */
export const useUpdateSettings = () => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (settings) => profileService.updateSettings(user.id, settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSettings', user.id] })
        }
    })
}

/**
 * Get student statistics (students only)
 */
export const useStudentStatistics = (options = {}) => {
    const { user } = useAuth()
    const isStudent = user?.role === 3

    return useQuery({
        queryKey: ['studentStatistics', user?.id],
        queryFn: () => profileService.getStudentStatistics(user.id),
        enabled: isStudent && !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options
    })
}

/**
 * Upload profile picture
 */
export const useUploadProfilePicture = () => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: (file) => profileService.uploadProfilePicture(user.id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
            queryClient.invalidateQueries({ queryKey: ['profilePicture', user.id] })
        }
    })
}

/**
 * Get profile picture
 */
export const useProfilePicture = (options = {}) => {
    const { user } = useAuth()

    return useQuery({
        queryKey: ['profilePicture', user?.id],
        queryFn: () => profileService.getProfilePicture(user.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 30, // 30 minutes
        ...options
    })
}

/**
 * Delete profile picture
 */
export const useDeleteProfilePicture = () => {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: () => profileService.deleteProfilePicture(user.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
            queryClient.invalidateQueries({ queryKey: ['profilePicture', user.id] })
        }
    })
}

export default {
    useCurrentUser,
    useUpdateProfile,
    useChangePassword,
    useSettings,
    useUpdateSettings,
    useStudentStatistics,
    useUploadProfilePicture,
    useProfilePicture,
    useDeleteProfilePicture
}
