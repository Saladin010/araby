import { Calendar, Users, TrendingUp, Award } from 'lucide-react'
import PropTypes from 'prop-types'
import { useAttendanceReport } from '../../hooks/useReports'
import { SummaryCard, ReportChart, ReportTable, ExportButton } from './'
import { formatPercentage } from '../../utils/reportHelpers'
import { chartColors, getLineChartConfig, getPieChartConfig } from '../../utils/chartHelpers'

/**
 * AttendanceReport Component
 * Attendance summary with charts and statistics
 */
const AttendanceReport = () => {
    const { data: summary, isLoading } = useAttendanceReport()

    // Status distribution chart
    const statusChartData = {
        labels: ['حاضر', 'غائب', 'متأخر', 'معذور'],
        datasets: [{
            data: [
                summary?.presentCount || 0,
                summary?.absentCount || 0,
                summary?.lateCount || 0,
                summary?.excusedCount || 0
            ],
            backgroundColor: [
                chartColors.successAlpha,
                chartColors.dangerAlpha,
                chartColors.warningAlpha,
                chartColors.infoAlpha
            ],
            borderColor: [
                chartColors.success,
                chartColors.danger,
                chartColors.warning,
                chartColors.info
            ],
            borderWidth: 2
        }]
    }

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
                    icon={Calendar}
                    title="إجمالي الحصص"
                    value={summary?.totalSessions || 0}
                    color="blue"
                    format="number"
                />
                <SummaryCard
                    icon={TrendingUp}
                    title="معدل الحضور"
                    value={`${summary?.overallAttendancePercentage || 0}%`}
                    color="green"
                    format="text"
                />
                <SummaryCard
                    icon={Users}
                    title="سجلات الحضور"
                    value={summary?.totalAttendanceRecords || 0}
                    color="purple"
                    format="number"
                />
                <SummaryCard
                    icon={Award}
                    title="الطلاب الحاضرون"
                    value={summary?.presentCount || 0}
                    color="green"
                    format="number"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReportChart
                    type="doughnut"
                    title="توزيع حالات الحضور"
                    data={statusChartData}
                    options={getPieChartConfig(statusChartData).options}
                    height={300}
                    isEmpty={!summary || summary.totalAttendanceRecords === 0}
                />

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">إحصائيات الحضور</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">حاضر</span>
                            <span className="text-lg font-bold text-green-600">{summary?.presentCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">غائب</span>
                            <span className="text-lg font-bold text-red-600">{summary?.absentCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">متأخر</span>
                            <span className="text-lg font-bold text-yellow-600">{summary?.lateCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">معذور</span>
                            <span className="text-lg font-bold text-blue-600">{summary?.excusedCount || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
                <ExportButton
                    onExportPDF={() => console.log('Export PDF')}
                    onExportExcel={() => console.log('Export Excel')}
                    onPrint={() => window.print()}
                />
            </div>

            {/* Empty State */}
            {(!summary || summary.totalAttendanceRecords === 0) && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد سجلات حضور</h3>
                    <p className="text-gray-600">لم يتم تسجيل أي حضور بعد</p>
                </div>
            )}
        </div>
    )
}

AttendanceReport.propTypes = {}

export default AttendanceReport
