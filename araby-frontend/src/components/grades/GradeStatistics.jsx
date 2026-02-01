import { FileText, Users, Award, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useStudents } from '../../hooks/useStudents'
import { useStudentGrades } from '../../hooks/useGrades'
import { getGradeLabel, calculateGradeStatistics } from '../../utils/gradeHelpers'

/**
 * GradeStatistics Component
 * Displays overall grade statistics for all students (Teacher/Assistant only)
 */
const GradeStatistics = () => {
    const { data: studentsData } = useStudents()
    const students = studentsData || []

    // Fetch all students' grades
    const studentGradesQueries = students.map(student =>
        useStudentGrades(student.id)
    )

    // Combine all grades
    const allGrades = studentGradesQueries
        .flatMap(query => query.data || [])
        .filter(grade => grade !== null && grade !== undefined)

    // Calculate overall statistics
    const stats = calculateGradeStatistics(allGrades)

    // Find highest and lowest grades
    const highestGrade = allGrades.length > 0
        ? allGrades.reduce((max, grade) => grade.percentage > max.percentage ? grade : max, allGrades[0])
        : null

    const lowestGrade = allGrades.length > 0
        ? allGrades.reduce((min, grade) => grade.percentage < min.percentage ? grade : min, allGrades[0])
        : null

    // Grade distribution for pie chart
    const gradeDistribution = [
        { name: 'ممتاز (90%+)', value: 0, color: '#10b981' },
        { name: 'جيد جداً (75-89%)', value: 0, color: '#3b82f6' },
        { name: 'جيد (60-74%)', value: 0, color: '#eab308' },
        { name: 'مقبول (50-59%)', value: 0, color: '#f97316' },
        { name: 'ضعيف (<50%)', value: 0, color: '#ef4444' }
    ]

    allGrades.forEach(grade => {
        const percentage = grade.percentage || 0
        if (percentage >= 90) gradeDistribution[0].value++
        else if (percentage >= 75) gradeDistribution[1].value++
        else if (percentage >= 60) gradeDistribution[2].value++
        else if (percentage >= 50) gradeDistribution[3].value++
        else gradeDistribution[4].value++
    })

    // Filter out zero values for pie chart
    const pieData = gradeDistribution.filter(item => item.value > 0)

    if (allGrades.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg font-medium">لا توجد درجات مسجلة</p>
                <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة درجات للطلاب</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Grades */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalExams}</div>
                    <div className="text-blue-100">إجمالي الدرجات المسجلة</div>
                </motion.div>

                {/* Class Average */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {stats.averagePercentage?.toFixed(1)}%
                    </div>
                    <div className="text-green-100">متوسط درجات الفصل</div>
                </motion.div>

                {/* Highest Score */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Award className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {highestGrade?.percentage?.toFixed(1)}%
                    </div>
                    <div className="text-yellow-100 text-sm truncate">
                        {highestGrade?.studentName}
                    </div>
                </motion.div>

                {/* Lowest Score */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">
                        {lowestGrade?.percentage?.toFixed(1)}%
                    </div>
                    <div className="text-red-100 text-sm truncate">
                        {lowestGrade?.studentName}
                    </div>
                </motion.div>
            </div>

            {/* Grade Distribution Pie Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-md p-6"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-4">توزيع التقديرات</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Detailed Statistics Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-md p-6"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-4">إحصائيات تفصيلية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gradeDistribution.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="font-medium text-gray-900">{item.name}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                <div className="text-sm text-gray-500">
                                    {((item.value / stats.totalExams) * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Insights */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-md p-6 border border-purple-200"
            >
                <h3 className="text-xl font-bold text-purple-900 mb-4">رؤى تحليلية</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                        <p className="text-gray-700">
                            <span className="font-semibold">متوسط الأداء:</span> التقدير العام للفصل هو{' '}
                            <span className="font-bold text-purple-700">
                                {getGradeLabel(stats.averagePercentage)}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                        <p className="text-gray-700">
                            <span className="font-semibold">الطلاب المتفوقون:</span>{' '}
                            {gradeDistribution[0].value} طالب حصلوا على تقدير ممتاز
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                        <p className="text-gray-700">
                            <span className="font-semibold">يحتاجون دعم:</span>{' '}
                            {gradeDistribution[4].value + gradeDistribution[3].value} طالب يحتاجون دعم إضافي
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default GradeStatistics
