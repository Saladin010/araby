import { TrendingUp, Award, Users, Target } from 'lucide-react'
import PropTypes from 'prop-types'
import { usePerformanceReport } from '../../hooks/useReports'
import { SummaryCard, ReportChart, ReportTable, ExportButton } from './'
import { formatPercentage, calculateAverage } from '../../utils/reportHelpers'
import { chartColors, getBarChartConfig, getHorizontalBarChartConfig } from '../../utils/chartHelpers'

/**
 * PerformanceReport Component
 * Academic performance report with grades and statistics
 */
const PerformanceReport = () => {
    const { data: students = [], isLoading } = usePerformanceReport()

    // Calculate summary stats
    const totalStudents = students.length
    const totalExams = students.reduce((sum, s) => sum + s.totalExams, 0)
    const classAverage = totalStudents > 0
        ? calculateAverage(students.map(s => s.averagePercentage))
        : 0

    const topStudent = students.length > 0
        ? students.reduce((max, s) => s.averagePercentage > max.averagePercentage ? s : max)
        : null

    // Student performance chart (top 10)
    const sortedStudents = [...students].sort((a, b) => b.averagePercentage - a.averagePercentage)
    const top10 = sortedStudents.slice(0, 10)

    const performanceChartData = {
        labels: top10.map(s => s.studentName),
        datasets: [{
            label: 'متوسط الدرجات (%)',
            data: top10.map(s => s.averagePercentage),
            backgroundColor: top10.map((_, i) => {
                if (i === 0) return chartColors.successAlpha
                if (i < 3) return chartColors.infoAlpha
                return chartColors.primaryAlpha
            }),
            borderColor: top10.map((_, i) => {
                if (i === 0) return chartColors.success
                if (i < 3) return chartColors.info
                return chartColors.primary
            }),
            borderWidth: 2
        }]
    }

    // Table columns
    const columns = [
        {
            key: 'rank',
            label: '#',
            render: (_, __, index) => (
                <span className="font-bold text-gray-700">{index + 1}</span>
            )
        },
        {
            key: 'studentName',
            label: 'الطالب',
            sortable: true
        },
        {
            key: 'totalExams',
            label: 'عدد الامتحانات',
            sortable: true
        },
        {
            key: 'averageGrade',
            label: 'متوسط الدرجات',
            sortable: true,
            render: (value) => value.toFixed(2)
        },
        {
            key: 'averagePercentage',
            label: 'النسبة المئوية',
            sortable: true,
            render: (value) => {
                let colorClass = 'text-gray-600'
                if (value >= 90) colorClass = 'text-green-600 font-bold'
                else if (value >= 75) colorClass = 'text-blue-600 font-medium'
                else if (value >= 60) colorClass = 'text-yellow-600'
                else if (value >= 50) colorClass = 'text-orange-600'
                else colorClass = 'text-red-600 font-bold'

                return (
                    <span className={colorClass}>
                        {formatPercentage(value)}
                    </span>
                )
            }
        },
        {
            key: 'attendancePercentage',
            label: 'نسبة الحضور',
            sortable: true,
            render: (value) => formatPercentage(value)
        }
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    icon={Users}
                    title="عدد الطلاب"
                    value={totalStudents}
                    color="blue"
                    format="number"
                />
                <SummaryCard
                    icon={Target}
                    title="متوسط الفصل"
                    value={`${classAverage.toFixed(1)}%`}
                    color="purple"
                    format="text"
                />
                <SummaryCard
                    icon={Award}
                    title="أعلى درجة"
                    value={topStudent ? `${topStudent.averagePercentage.toFixed(1)}%` : '0%'}
                    color="green"
                    format="text"
                />
                <SummaryCard
                    icon={TrendingUp}
                    title="إجمالي الامتحانات"
                    value={totalExams}
                    color="indigo"
                    format="number"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
                <ReportChart
                    type="bar"
                    title="أفضل 10 طلاب"
                    data={performanceChartData}
                    options={getHorizontalBarChartConfig(performanceChartData).options}
                    height={400}
                    isEmpty={students.length === 0}
                />
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
                <ExportButton
                    onExportPDF={() => console.log('Export PDF')}
                    onExportExcel={() => console.log('Export Excel')}
                    onPrint={() => window.print()}
                />
            </div>

            {/* Detailed Table */}
            <ReportTable
                columns={columns}
                data={sortedStudents}
                pageSize={10}
            />

            {/* Empty State */}
            {students.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد بيانات أداء</h3>
                    <p className="text-gray-600">لم يتم تسجيل أي درجات بعد</p>
                </div>
            )}
        </div>
    )
}

PerformanceReport.propTypes = {}

export default PerformanceReport
