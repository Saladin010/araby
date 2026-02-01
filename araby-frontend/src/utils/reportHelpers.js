/**
 * Report Helper Functions
 * Data formatters and calculators for reports
 */

/**
 * Format currency to Egyptian Pounds
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount || 0)
}

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
    return `${(value || 0).toFixed(decimals)}%`
}

/**
 * Format date to Arabic
 */
export const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Calculate trend (percentage change)
 */
export const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
}

/**
 * Group payments by fee type
 */
export const groupByFeeType = (payments) => {
    const grouped = {}

    payments.forEach(payment => {
        const feeTypeName = payment.feeTypeName || payment.feeType?.name || 'غير محدد'
        if (!grouped[feeTypeName]) {
            grouped[feeTypeName] = {
                name: feeTypeName,
                total: 0,
                count: 0
            }
        }
        grouped[feeTypeName].total += payment.amountPaid || 0
        grouped[feeTypeName].count++
    })

    return Object.values(grouped)
}

/**
 * Group data by day
 */
export const groupByDay = (data, dateField = 'date') => {
    const grouped = {}

    data.forEach(item => {
        const date = new Date(item[dateField])
        const dayKey = date.toISOString().split('T')[0]

        if (!grouped[dayKey]) {
            grouped[dayKey] = {
                date: dayKey,
                items: [],
                count: 0
            }
        }
        grouped[dayKey].items.push(item)
        grouped[dayKey].count++
    })

    return Object.values(grouped).sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    )
}

/**
 * Calculate grade distribution
 */
export const calculateGradeDistribution = (grades) => {
    const ranges = {
        '0-50': { min: 0, max: 50, count: 0, label: 'راسب (0-50)' },
        '50-60': { min: 50, max: 60, count: 0, label: 'مقبول (50-60)' },
        '60-75': { min: 60, max: 75, count: 0, label: 'جيد (60-75)' },
        '75-90': { min: 75, max: 90, count: 0, label: 'جيد جداً (75-90)' },
        '90-100': { min: 90, max: 100, count: 0, label: 'ممتاز (90-100)' }
    }

    grades.forEach(grade => {
        const percentage = (grade.score / grade.maxScore) * 100

        for (const key in ranges) {
            const range = ranges[key]
            if (percentage >= range.min && percentage < range.max) {
                range.count++
                break
            }
        }
    })

    return Object.values(ranges)
}

/**
 * Calculate days between dates
 */
export const daysBetween = (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2 - d1)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Get day of week in Arabic
 */
export const getDayOfWeek = (date) => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    return days[new Date(date).getDay()]
}

/**
 * Group attendance by day of week
 */
export const groupByDayOfWeek = (attendances) => {
    const days = {
        'السبت': { day: 'السبت', total: 0, present: 0 },
        'الأحد': { day: 'الأحد', total: 0, present: 0 },
        'الاثنين': { day: 'الاثنين', total: 0, present: 0 },
        'الثلاثاء': { day: 'الثلاثاء', total: 0, present: 0 },
        'الأربعاء': { day: 'الأربعاء', total: 0, present: 0 },
        'الخميس': { day: 'الخميس', total: 0, present: 0 },
        'الجمعة': { day: 'الجمعة', total: 0, present: 0 }
    }

    attendances.forEach(attendance => {
        const dayName = getDayOfWeek(attendance.sessionDate || attendance.date)
        if (days[dayName]) {
            days[dayName].total++
            if (attendance.status === 'Present' || attendance.status === 'حاضر') {
                days[dayName].present++
            }
        }
    })

    // Calculate percentages
    Object.values(days).forEach(day => {
        day.percentage = day.total > 0 ? (day.present / day.total) * 100 : 0
    })

    return Object.values(days)
}

/**
 * Calculate average
 */
export const calculateAverage = (numbers) => {
    if (!numbers || numbers.length === 0) return 0
    const sum = numbers.reduce((acc, num) => acc + num, 0)
    return sum / numbers.length
}

/**
 * Find max value in array of objects
 */
export const findMax = (array, key) => {
    if (!array || array.length === 0) return null
    return array.reduce((max, item) =>
        item[key] > max[key] ? item : max
    )
}

/**
 * Find min value in array of objects
 */
export const findMin = (array, key) => {
    if (!array || array.length === 0) return null
    return array.reduce((min, item) =>
        item[key] < min[key] ? item : min
    )
}

export default {
    formatCurrency,
    formatPercentage,
    formatDate,
    formatDateTime,
    calculateTrend,
    groupByFeeType,
    groupByDay,
    calculateGradeDistribution,
    daysBetween,
    getDayOfWeek,
    groupByDayOfWeek,
    calculateAverage,
    findMax,
    findMin
}
