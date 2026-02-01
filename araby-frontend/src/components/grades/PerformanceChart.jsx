import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { formatDate } from '../../utils/dateUtils'
import { getGradeLabel, getGradeColor } from '../../utils/gradeHelpers'

/**
 * PerformanceChart Component
 * Displays performance charts for student grades
 */
const PerformanceChart = ({ grades }) => {
    if (!grades || grades.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500">لا توجد بيانات كافية لعرض الرسوم البيانية</p>
            </div>
        )
    }

    // Prepare data for performance over time chart
    const performanceData = [...grades]
        .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
        .map(grade => ({
            name: grade.examName.length > 15 ? grade.examName.substring(0, 15) + '...' : grade.examName,
            fullName: grade.examName,
            percentage: parseFloat(grade.percentage?.toFixed(1) || 0),
            score: grade.score,
            maxScore: grade.maxScore,
            date: formatDate(grade.examDate)
        }))

    // Prepare data for grade distribution
    const gradeRanges = [
        { range: '0-50', label: 'ضعيف', count: 0, color: '#ef4444' },
        { range: '50-60', label: 'مقبول', count: 0, color: '#f97316' },
        { range: '60-75', label: 'جيد', count: 0, color: '#eab308' },
        { range: '75-90', label: 'جيد جداً', count: 0, color: '#3b82f6' },
        { range: '90-100', label: 'ممتاز', count: 0, color: '#10b981' }
    ]

    grades.forEach(grade => {
        const percentage = grade.percentage || 0
        if (percentage < 50) gradeRanges[0].count++
        else if (percentage < 60) gradeRanges[1].count++
        else if (percentage < 75) gradeRanges[2].count++
        else if (percentage < 90) gradeRanges[3].count++
        else gradeRanges[4].count++
    })

    // Find best and worst performances
    const sortedByPercentage = [...grades].sort((a, b) => b.percentage - a.percentage)
    const bestPerformances = sortedByPercentage.slice(0, 5)
    const worstPerformances = sortedByPercentage.slice(-5).reverse()

    // Custom tooltip for line chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-900 mb-1">{data.fullName}</p>
                    <p className="text-sm text-gray-600">التاريخ: {data.date}</p>
                    <p className="text-sm text-gray-600">الدرجة: {data.score} / {data.maxScore}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">{data.percentage}%</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-6">
            {/* Performance Over Time */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-4">تطور الأداء عبر الوقت</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                        <defs>
                            <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            domain={[0, 100]}
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="percentage"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 5 }}
                            activeDot={{ r: 7 }}
                            name="النسبة المئوية"
                            fill="url(#colorPercentage)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Grade Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-4">توزيع الدرجات</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gradeRanges}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="label"
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="count"
                            name="عدد الامتحانات"
                            radius={[8, 8, 0, 0]}
                        >
                            {gradeRanges.map((entry, index) => (
                                <Bar key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Best and Worst Performances */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Best Performances */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-green-700 mb-4">أفضل 5 أداءات</h3>
                    <div className="space-y-3">
                        {bestPerformances.map((grade, index) => {
                            const colors = getGradeColor(grade.percentage)
                            return (
                                <div
                                    key={grade.id}
                                    className={`p-3 rounded-lg border-2 ${colors.border} ${colors.bg}`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-900 text-sm">
                                            {index + 1}. {grade.examName}
                                        </span>
                                        <span className={`text-lg font-bold ${colors.text}`}>
                                            {grade.percentage?.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {grade.score} / {grade.maxScore} - {formatDate(grade.examDate)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Worst Performances */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-red-700 mb-4">أسوأ 5 أداءات</h3>
                    <div className="space-y-3">
                        {worstPerformances.map((grade, index) => {
                            const colors = getGradeColor(grade.percentage)
                            return (
                                <div
                                    key={grade.id}
                                    className={`p-3 rounded-lg border-2 ${colors.border} ${colors.bg}`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-900 text-sm">
                                            {index + 1}. {grade.examName}
                                        </span>
                                        <span className={`text-lg font-bold ${colors.text}`}>
                                            {grade.percentage?.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {grade.score} / {grade.maxScore} - {formatDate(grade.examDate)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default PerformanceChart
