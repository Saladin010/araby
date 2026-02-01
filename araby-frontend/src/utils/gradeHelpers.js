/**
 * Grade Helper Utilities
 * Common functions for grade calculations and formatting
 */

/**
 * Calculate percentage from score and max score
 * @param {number} score - The achieved score
 * @param {number} maxScore - The maximum possible score
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (score, maxScore) => {
    if (!maxScore || maxScore === 0) return 0
    return (score / maxScore) * 100
}

/**
 * Get grade label based on percentage
 * @param {number} percentage - The percentage (0-100)
 * @returns {string} Grade label in Arabic
 */
export const getGradeLabel = (percentage) => {
    if (percentage >= 90) return 'ممتاز'
    if (percentage >= 75) return 'جيد جداً'
    if (percentage >= 60) return 'جيد'
    if (percentage >= 50) return 'مقبول'
    return 'ضعيف'
}

/**
 * Get color scheme for grade based on percentage
 * @param {number} percentage - The percentage (0-100)
 * @returns {object} Color configuration
 */
export const getGradeColor = (percentage) => {
    if (percentage >= 90) {
        return {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-300',
            progress: 'bg-green-600',
            ring: 'ring-green-500'
        }
    }
    if (percentage >= 75) {
        return {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-300',
            progress: 'bg-blue-600',
            ring: 'ring-blue-500'
        }
    }
    if (percentage >= 60) {
        return {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-300',
            progress: 'bg-yellow-600',
            ring: 'ring-yellow-500'
        }
    }
    if (percentage >= 50) {
        return {
            bg: 'bg-orange-100',
            text: 'text-orange-800',
            border: 'border-orange-300',
            progress: 'bg-orange-600',
            ring: 'ring-orange-500'
        }
    }
    return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
        progress: 'bg-red-600',
        ring: 'ring-red-500'
    }
}

/**
 * Format grade for display
 * @param {object} grade - Grade object
 * @returns {object} Formatted grade display data
 */
export const formatGradeDisplay = (grade) => {
    const percentage = grade.percentage || calculatePercentage(grade.score, grade.maxScore)
    const label = getGradeLabel(percentage)
    const colors = getGradeColor(percentage)

    return {
        ...grade,
        percentage: percentage.toFixed(2),
        label,
        colors,
        scoreDisplay: `${grade.score} / ${grade.maxScore}`,
        percentageDisplay: `${percentage.toFixed(1)}%`
    }
}

/**
 * Get grade range filter options
 * @returns {array} Filter options
 */
export const getGradeRangeFilters = () => [
    { value: 'all', label: 'الكل', min: 0, max: 100 },
    { value: 'excellent', label: 'ممتاز (90%+)', min: 90, max: 100 },
    { value: 'very-good', label: 'جيد جداً (75-89%)', min: 75, max: 89 },
    { value: 'good', label: 'جيد (60-74%)', min: 60, max: 74 },
    { value: 'pass', label: 'مقبول (50-59%)', min: 50, max: 59 },
    { value: 'fail', label: 'ضعيف (<50%)', min: 0, max: 49 }
]

/**
 * Filter grades by percentage range
 * @param {array} grades - Array of grades
 * @param {string} rangeFilter - Range filter value
 * @returns {array} Filtered grades
 */
export const filterGradesByRange = (grades, rangeFilter) => {
    if (!rangeFilter || rangeFilter === 'all') return grades

    const range = getGradeRangeFilters().find(r => r.value === rangeFilter)
    if (!range) return grades

    return grades.filter(grade => {
        const percentage = grade.percentage || calculatePercentage(grade.score, grade.maxScore)
        return percentage >= range.min && percentage <= range.max
    })
}

/**
 * Sort grades by different criteria
 * @param {array} grades - Array of grades
 * @param {string} sortBy - Sort criteria
 * @param {string} order - 'asc' or 'desc'
 * @returns {array} Sorted grades
 */
export const sortGrades = (grades, sortBy, order = 'desc') => {
    const sorted = [...grades].sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
            case 'date':
                comparison = new Date(a.examDate) - new Date(b.examDate)
                break
            case 'score':
                const percentageA = a.percentage || calculatePercentage(a.score, a.maxScore)
                const percentageB = b.percentage || calculatePercentage(b.score, b.maxScore)
                comparison = percentageA - percentageB
                break
            case 'student':
                comparison = (a.studentName || '').localeCompare(b.studentName || '')
                break
            case 'exam':
                comparison = (a.examName || '').localeCompare(b.examName || '')
                break
            default:
                comparison = 0
        }

        return order === 'asc' ? comparison : -comparison
    })

    return sorted
}

/**
 * Calculate statistics from grades array
 * @param {array} grades - Array of grades
 * @returns {object} Statistics
 */
export const calculateGradeStatistics = (grades) => {
    if (!grades || grades.length === 0) {
        return {
            totalExams: 0,
            averageScore: 0,
            averagePercentage: 0,
            highestScore: 0,
            lowestScore: 0
        }
    }

    const percentages = grades.map(g =>
        g.percentage || calculatePercentage(g.score, g.maxScore)
    )

    const scores = grades.map(g => g.score)

    return {
        totalExams: grades.length,
        averageScore: scores.reduce((a, b) => a + b, 0) / grades.length,
        averagePercentage: percentages.reduce((a, b) => a + b, 0) / grades.length,
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores)
    }
}
