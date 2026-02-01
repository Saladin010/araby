import { useQuery } from '@tanstack/react-query'
import reportService from '../services/reportService'

/**
 * Hook to fetch financial report
 */
export const useFinancialReport = (year, month, options = {}) => {
    return useQuery({
        queryKey: ['financialReport', year, month],
        queryFn: () => reportService.getFinancialReport(year, month),
        enabled: !!year && !!month,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    })
}

/**
 * Hook to fetch attendance summary
 */
export const useAttendanceReport = (options = {}) => {
    return useQuery({
        queryKey: ['attendanceReport'],
        queryFn: reportService.getAttendanceSummary,
        staleTime: 1000 * 60 * 5,
        ...options,
    })
}

/**
 * Hook to fetch performance report
 */
export const usePerformanceReport = (options = {}) => {
    return useQuery({
        queryKey: ['performanceReport'],
        queryFn: reportService.getPerformanceReport,
        staleTime: 1000 * 60 * 5,
        ...options,
    })
}

/**
 * Hook to fetch defaulters report
 */
export const useDefaultersReport = (options = {}) => {
    return useQuery({
        queryKey: ['defaultersReport'],
        queryFn: reportService.getDefaulters,
        staleTime: 1000 * 60 * 5,
        ...options,
    })
}
