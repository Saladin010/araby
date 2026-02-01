// Utility functions for date/time formatting in Egypt timezone

/**
 * Get current date/time in Egypt timezone
 */
export const getEgyptTime = () => {
    return new Date().toLocaleString('ar-EG', {
        timeZone: 'Africa/Cairo',
    })
}

/**
 * Format date in Arabic
 */
export const formatDate = (date, options = {}) => {
    const defaultOptions = {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    }

    return new Date(date).toLocaleDateString('ar-EG', defaultOptions)
}

/**
 * Format time in Arabic
 */
export const formatTime = (date, options = {}) => {
    const defaultOptions = {
        timeZone: 'Africa/Cairo',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
    }

    return new Date(date).toLocaleTimeString('ar-EG', defaultOptions)
}

/**
 * Format date and time together
 */
export const formatDateTime = (date) => {
    return `${formatDate(date)} - ${formatTime(date)}`
}

/**
 * Get greeting based on time of day
 */
export const getGreeting = () => {
    const hour = new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Cairo',
        hour: 'numeric',
        hour12: false,
    })

    const hourNum = parseInt(hour)

    if (hourNum >= 5 && hourNum < 12) return 'صباح الخير'
    if (hourNum >= 12 && hourNum < 17) return 'مساء الخير'
    if (hourNum >= 17 && hourNum < 21) return 'مساء الخير'
    return 'مساء الخير'
}

/**
 * Get day name in Arabic
 */
export const getDayName = (date = new Date()) => {
    return new Date(date).toLocaleDateString('ar-EG', {
        timeZone: 'Africa/Cairo',
        weekday: 'long',
    })
}

/**
 * Get relative time (e.g., "منذ ساعتين")
 */
export const getRelativeTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`
    if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`
    if (minutes > 0) return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
    return 'الآن'
}

/**
 * Format currency in Egyptian Pounds
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
}

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
    return `${value.toFixed(decimals)}٪`
}
