import { useState } from 'react'
import { Search, FileText, TrendingUp, Target, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStudents } from '../../hooks/useStudents'
import { useStudentGrades, useStudentGradeStatistics } from '../../hooks/useGrades'
import { getGradeLabel, getGradeColor } from '../../utils/gradeHelpers'
import PerformanceChart from './PerformanceChart'

/**
 * StudentPerformance Component
 * Displays comprehensive student performance analytics
 */
const StudentPerformance = () => {
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch students
    const { data: studentsData, isLoading: loadingStudents } = useStudents()
    const students = studentsData || []

    // Fetch selected student's data
    const { data: grades, isLoading: loadingGrades } = useStudentGrades(selectedStudent?.id)
    const { data: stats, isLoading: loadingStats } = useStudentGradeStatistics(selectedStudent?.id)

    // Filter students
    const filteredStudents = students.filter(student =>
        student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Calculate overall grade
    const overallGrade = stats?.averagePercentage
        ? getGradeLabel(stats.averagePercentage)
        : 'غير متوفر'

    const gradeColors = stats?.averagePercentage
        ? getGradeColor(stats.averagePercentage)
        : { bg: 'bg-gray-100', text: 'text-gray-800' }

    return (
        <div className="space-y-6">
            {/* Student Selector */}
            {!selectedStudent ? (
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">اختر طالباً لعرض أدائه</h3>

                    <div className="relative mb-6">
                        <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن طالب..."
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {loadingStudents ? (
                        <div className="text-center py-8 text-gray-500">جاري التحميل...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredStudents.map((student, index) => (
                                <motion.button
                                    key={student.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedStudent(student)}
                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-right"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {student.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{student.fullName}</div>
                                            <div className="text-sm text-gray-500">{student.phoneNumber}</div>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                    {selectedStudent.fullName?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                                    <p className="text-blue-100">{selectedStudent.phoneNumber}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            >
                                تغيير الطالب
                            </button>
                        </div>
                    </div>

                    {loadingStats || loadingGrades ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">جاري تحميل البيانات...</p>
                        </div>
                    ) : stats && grades ? (
                        <>
                            {/* Performance Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Total Exams */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <FileText className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {stats.totalExams}
                                    </div>
                                    <div className="text-sm text-gray-600">عدد الامتحانات</div>
                                </motion.div>

                                {/* Average Score */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <TrendingUp className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {stats.averageScore?.toFixed(1)}
                                    </div>
                                    <div className="text-sm text-gray-600">متوسط الدرجات</div>
                                </motion.div>

                                {/* Average Percentage */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <Target className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {stats.averagePercentage?.toFixed(1)}%
                                    </div>
                                    <div className="text-sm text-gray-600">النسبة المئوية</div>
                                </motion.div>

                                {/* Overall Grade */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white rounded-xl shadow-md p-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="p-3 bg-yellow-100 rounded-lg">
                                            <Award className="w-6 h-6 text-yellow-600" />
                                        </div>
                                    </div>
                                    <div className={`text-2xl font-bold mb-1 ${gradeColors.text}`}>
                                        {overallGrade}
                                    </div>
                                    <div className="text-sm text-gray-600">التقدير العام</div>
                                </motion.div>
                            </div>

                            {/* Performance Charts */}
                            <PerformanceChart grades={grades} />

                            {/* Recent Grades Table */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">آخر 10 درجات</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">#</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الامتحان</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدرجة</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">النسبة</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">التقدير</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {grades.slice(0, 10).map((grade, index) => {
                                                const percentage = grade.percentage
                                                const label = getGradeLabel(percentage)
                                                const colors = getGradeColor(percentage)

                                                return (
                                                    <tr key={grade.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{grade.examName}</td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                            {grade.score} / {grade.maxScore}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-bold">
                                                            <span className={colors.text}>{percentage.toFixed(1)}%</span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                                                                {label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <p className="text-gray-500 text-lg">لا توجد درجات مسجلة لهذا الطالب</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default StudentPerformance
