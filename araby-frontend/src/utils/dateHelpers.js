import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subMonths,
    subDays,
    format,
    isWithinInterval
} from 'date-fns'
import { ar } from 'date-fns/locale'

/**
 * Date Helper Functions
 * Utilities for date range calculations and formatting
 */

/**
 * Date range presets
 */
export const datePresets = {
    THIS_WEEK: 'thisWeek',
    THIS_MONTH: 'thisMonth',
    LAST_3_MONTHS: 'last3Months',
    LAST_6_MONTHS: 'last6Months',
    THIS_YEAR: 'thisYear',
    CUSTOM: 'custom'
}

/**
 * Get preset labels in Arabic
 */
export const getPresetLabel = (preset) => {
    const labels = {
        [datePresets.THIS_WEEK]: 'هذا الأسبوع',
        [datePresets.THIS_MONTH]: 'هذا الشهر',
        [datePresets.LAST_3_MONTHS]: 'آخر 3 أشهر',
        [datePresets.LAST_6_MONTHS]: 'آخر 6 أشهر',
        [datePresets.THIS_YEAR]: 'هذا العام',
        [datePresets.CUSTOM]: 'مخصص'
    }
    return labels[preset] || preset
}

/**
 * Calculate date range from preset
 */
export const calculateDateRange = (preset) => {
    const today = new Date()

    switch (preset) {
        case datePresets.THIS_WEEK:
            return {
                from: startOfWeek(today, { weekStartsOn: 6 }), // Saturday
                to: endOfWeek(today, { weekStartsOn: 6 })
            }

        case datePresets.THIS_MONTH:
            return {
                from: startOfMonth(today),
                to: endOfMonth(today)
            }

        case datePresets.LAST_3_MONTHS:
            return {
                from: subMonths(today, 3),
                to: today
            }

        case datePresets.LAST_6_MONTHS:
            return {
                from: subMonths(today, 6),
                to: today
            }

        case datePresets.THIS_YEAR:
            return {
                from: new Date(today.getFullYear(), 0, 1),
                to: new Date(today.getFullYear(), 11, 31)
            }

        default:
            return {
                from: today,
                to: today
            }
    }
}

/**
 * Format date range for display
 */
export const formatDateRange = (from, to) => {
    if (!from || !to) return ''

    const fromStr = format(new Date(from), 'd MMMM yyyy', { locale: ar })
    const toStr = format(new Date(to), 'd MMMM yyyy', { locale: ar })

    return `من ${fromStr} إلى ${toStr}`
}

/**
 * Format date for API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date) => {
    if (!date) return null
    return format(new Date(date), 'yyyy-MM-dd')
}

/**
 * Check if date is within range
 */
export const isDateInRange = (date, from, to) => {
    if (!date || !from || !to) return false

    return isWithinInterval(new Date(date), {
        start: new Date(from),
        end: new Date(to)
    })
}

/**
 * Get month name in Arabic
 */
export const getMonthName = (monthNumber) => {
    const months = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ]
    return months[monthNumber - 1] || ''
}

/**
 * Get current month and year
 */
export const getCurrentMonthYear = () => {
    const today = new Date()
    return {
        month: today.getMonth() + 1,
        year: today.getFullYear()
    }
}

/**
 * Get last N days
 */
export const getLastNDays = (n) => {
    const today = new Date()
    return {
        from: subDays(today, n),
        to: today
    }
}

/**
 * Format relative time (e.g., "منذ 3 أيام")
 */
export const formatRelativeTime = (date) => {
    if (!date) return ''

    const now = new Date()
    const past = new Date(date)
    const diffInDays = Math.floor((now - past) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'اليوم'
    if (diffInDays === 1) return 'أمس'
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`
    if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`
    if (diffInDays < 365) return `منذ ${Math.floor(diffInDays / 30)} أشهر`
    return `منذ ${Math.floor(diffInDays / 365)} سنوات`
}

export default {
    datePresets,
    getPresetLabel,
    calculateDateRange,
    formatDateRange,
    formatDateForAPI,
    isDateInRange,
    getMonthName,
    getCurrentMonthYear,
    getLastNDays,
    formatRelativeTime
}
