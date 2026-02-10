/**
 * Group Helper Utilities
 * Functions for managing student groups
 */

// Color palette for groups
export const GROUP_COLORS = [
    { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', accent: '#3B82F6', ring: 'ring-blue-500' },
    { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', accent: '#A855F7', ring: 'ring-purple-500' },
    { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', accent: '#10B981', ring: 'ring-green-500' },
    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', accent: '#F97316', ring: 'ring-orange-500' },
    { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300', accent: '#EC4899', ring: 'ring-pink-500' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', accent: '#6366F1', ring: 'ring-indigo-500' },
    { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300', accent: '#14B8A6', ring: 'ring-teal-500' },
    { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', accent: '#EF4444', ring: 'ring-red-500' },
]

/**
 * Get color for a group based on index
 */
export const getGroupColor = (index) => {
    return GROUP_COLORS[index % GROUP_COLORS.length]
}

/**
 * Format group data with color
 */
export const formatGroupData = (group, index) => {
    const colors = getGroupColor(index)

    return {
        ...group,
        colors,
        displayName: group.groupName || 'مجموعة بدون اسم',
        memberCount: group.membersCount || 0,
        hasDescription: !!group.description,
        shortDescription: group.description?.substring(0, 100) || '',
        formattedDate: new Date(group.createdAt).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}

/**
 * Filter students that are not in the group
 */
export const filterAvailableStudents = (allStudents, groupMembers) => {
    if (!allStudents || !Array.isArray(allStudents)) return []
    if (!groupMembers || !Array.isArray(groupMembers)) return allStudents

    const memberIds = new Set(groupMembers.map(member => member.studentId || member.id))
    return allStudents.filter(student => !memberIds.has(student.id))
}

/**
 * Calculate group statistics
 */
export const calculateGroupStats = (group, students = [], grades = [], attendance = [], payments = []) => {
    if (!group || !group.members || group.members.length === 0) {
        return {
            totalStudents: 0,
            averageAttendance: 0,
            averageGrade: 0,
            totalPaid: 0,
            pendingPayments: 0
        }
    }

    const memberIds = new Set(group.members.map(m => m.studentId))

    // Calculate attendance
    const groupAttendance = attendance.filter(a => memberIds.has(a.studentId))
    const averageAttendance = groupAttendance.length > 0
        ? (groupAttendance.filter(a => a.status === 'Present').length / groupAttendance.length) * 100
        : 0

    // Calculate grades
    const groupGrades = grades.filter(g => memberIds.has(g.studentId))
    const averageGrade = groupGrades.length > 0
        ? groupGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / groupGrades.length
        : 0

    // Calculate payments
    const groupPayments = payments.filter(p => memberIds.has(p.studentId))
    const totalPaid = groupPayments
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + (p.amount || 0), 0)
    const pendingPayments = groupPayments.filter(p => p.status === 'Pending').length

    return {
        totalStudents: group.members.length,
        averageAttendance: Math.round(averageAttendance),
        averageGrade: Math.round(averageGrade),
        totalPaid,
        pendingPayments
    }
}

/**
 * Sort groups by different criteria
 */
export const sortGroups = (groups, sortBy, order = 'asc') => {
    const sorted = [...groups].sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
            case 'name':
                comparison = (a.groupName || '').localeCompare(b.groupName || '', 'ar')
                break
            case 'students':
                comparison = (a.membersCount || 0) - (b.membersCount || 0)
                break
            case 'date':
                comparison = new Date(a.createdAt) - new Date(b.createdAt)
                break
            default:
                comparison = 0
        }

        return order === 'asc' ? comparison : -comparison
    })

    return sorted
}

/**
 * Filter groups by criteria
 */
export const filterGroups = (groups, filters) => {
    let filtered = [...groups]

    // Filter by search term
    if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(group =>
            group.groupName?.toLowerCase().includes(searchLower) ||
            group.description?.toLowerCase().includes(searchLower) ||
            // Search in members
            (group.members && group.members.some(m =>
                m.studentName?.toLowerCase().includes(searchLower) ||
                (m.studentNumber && m.studentNumber.toString().includes(searchLower))
            ))
        )
    }

    // Filter by student count range
    if (filters.studentRange) {
        filtered = filtered.filter(group => {
            const count = group.membersCount || 0
            switch (filters.studentRange) {
                case '0-10':
                    return count >= 0 && count <= 10
                case '11-25':
                    return count >= 11 && count <= 25
                case '26-50':
                    return count >= 26 && count <= 50
                case '50+':
                    return count > 50
                default:
                    return true
            }
        })
    }

    return filtered
}

/**
 * Get student count range label
 */
export const getStudentRangeLabel = (count) => {
    if (count === 0) return 'لا يوجد طلاب'
    if (count === 1) return 'طالب واحد'
    if (count === 2) return 'طالبان'
    if (count >= 3 && count <= 10) return `${count} طلاب`
    return `${count} طالب`
}
