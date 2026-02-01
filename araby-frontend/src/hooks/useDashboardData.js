import { useQuery } from '@tanstack/react-query'
import dashboardService from '../services/dashboardService'
import authService from '../services/authService'

/**
 * Hook for fetching teacher dashboard data
 */
export const useTeacherDashboard = () => {
    return useQuery({
        queryKey: ['teacherDashboard'],
        queryFn: dashboardService.getTeacherDashboard,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

/**
 * Hook for fetching assistant dashboard data
 */
export const useAssistantDashboard = () => {
    return useQuery({
        queryKey: ['assistantDashboard'],
        queryFn: dashboardService.getAssistantDashboard,
        staleTime: 1000 * 60 * 5,
    })
}

/**
 * Hook for fetching student dashboard data
 */
export const useStudentDashboard = () => {
    const user = authService.getCurrentUser()

    return useQuery({
        queryKey: ['studentDashboard', user?.userId],
        queryFn: () => dashboardService.getStudentDashboard(user?.userId),
        enabled: !!user?.userId,
        staleTime: 1000 * 60 * 5,
    })
}
