import { Award, TrendingUp, Calendar, Filter } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import authService from '../../services/authService'
import { DashboardLayout } from '../../components/layout'
import { formatDate, formatPercentage } from '../../utils/dateUtils'

/**
 * Student Grades Page
 * Displays all grades for the logged-in student
 */
const StudentGrades = () => {
    const user = authService.getCurrentUser()
    const [sortBy, setSortBy] = useState('date') // date, percentage

    // Fetch student grades
    const { data: grades, isLoading, error } = useQuery({
        queryKey: ['studentGrades', user?.userId],
        queryFn: async () => {
            const response = await api.get(`/grades/student/${user?.userId}`)
            return response.data || []
        },
        enabled: !!user?.userId,
    })

    // Calculate statistics
    const totalGrades = grades?.length || 0
    const averageGrade = totalGrades > 0
        ? Math.round(grades.reduce((sum, g) => sum + g.percentage, 0) / totalGrades)
        : 0
    const highestGrade = totalGrades > 0
        ? Math.max(...grades.map(g => g.percentage))
        : 0
    const lowestGrade = totalGrades > 0
        ? Math.min(...grades.map(g => g.percentage))
        : 0

    // Sort grades
    const sortedGrades = grades?.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.date) - new Date(a.date)
        }
        return b.percentage - a.percentage
    }) || []

    const getGradeColor = (percentage) => {
        if (percentage >= 90) return 'text-success'
        if (percentage >= 75) return 'text-info'
        if (percentage >= 60) return 'text-warning'
        return 'text-error'
    }

    const getGradeBg = (percentage) => {
        if (percentage >= 90) return 'bg-success/10'
        if (percentage >= 75) return 'bg-info/10'
        if (percentage >= 60) return 'bg-warning/10'
        return 'bg-error/10'
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="card bg-error/10 border-error">
                    <p className="text-error">حدث خطأ أثناء تحميل الدرجات</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">درجاتي</h1>
                <p className="text-text-muted">جميع الدرجات والامتحانات</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-gradient-to-br from-primary/10 to-primary/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">عدد الامتحانات</p>
                            <p className="text-2xl font-bold text-primary">{totalGrades}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card bg-gradient-to-br from-info/10 to-info/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-info/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-info" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">المتوسط</p>
                            <p className="text-2xl font-bold text-info">{averageGrade}%</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card bg-gradient-to-br from-success/10 to-success/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                            <Award className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">أعلى درجة</p>
                            <p className="text-2xl font-bold text-success">{highestGrade}%</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card bg-gradient-to-br from-warning/10 to-warning/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                            <Award className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">أقل درجة</p>
                            <p className="text-2xl font-bold text-warning">{lowestGrade}%</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Sort Buttons */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setSortBy('date')}
                    className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'date'
                            ? 'bg-primary text-white'
                            : 'bg-background text-text-muted hover:bg-background-hover'
                        }`}
                >
                    <Calendar className="w-4 h-4 inline-block mr-2" />
                    ترتيب حسب التاريخ
                </button>
                <button
                    onClick={() => setSortBy('percentage')}
                    className={`px-4 py-2 rounded-lg transition-colors ${sortBy === 'percentage'
                            ? 'bg-primary text-white'
                            : 'bg-background text-text-muted hover:bg-background-hover'
                        }`}
                >
                    <TrendingUp className="w-4 h-4 inline-block mr-2" />
                    ترتيب حسب الدرجة
                </button>
            </div>

            {/* Grades Table */}
            {isLoading ? (
                <div className="card">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-background rounded" />
                        ))}
                    </div>
                </div>
            ) : sortedGrades.length === 0 ? (
                <div className="card text-center py-12">
                    <Award className="w-16 h-16 mx-auto mb-4 text-text-muted" />
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                        لا توجد درجات
                    </h3>
                    <p className="text-text-muted">لم يتم تسجيل أي درجات بعد</p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-background/50">
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                        الامتحان
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary">
                                        الدرجة
                                    </th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary">
                                        النسبة
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                        التاريخ
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                        ملاحظات
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedGrades.map((grade, index) => (
                                    <motion.tr
                                        key={grade.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-border hover:bg-background/30 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-text-primary font-medium">
                                            {grade.examName}
                                        </td>
                                        <td className="py-3 px-4 text-center font-semibold text-primary">
                                            {grade.score} / {grade.maxScore}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeBg(grade.percentage)} ${getGradeColor(grade.percentage)}`}>
                                                {formatPercentage(grade.percentage)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text-muted">
                                            {formatDate(grade.date)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-text-muted">
                                            {grade.notes || '-'}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default StudentGrades
