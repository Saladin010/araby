import { DollarSign, TrendingUp, Calendar, Award } from 'lucide-react'
import PropTypes from 'prop-types'
import { useFinancialReport } from '../../hooks/useReports'
import { SummaryCard, ReportChart, ReportTable, ExportButton } from './'
import { formatCurrency } from '../../utils/reportHelpers'
import { chartColors, getLineChartConfig, getPieChartConfig } from '../../utils/chartHelpers'
import { getCurrentMonthYear, getMonthName } from '../../utils/dateHelpers'

/**
 * FinancialReport Component
 * Financial report with revenue, payments, and charts
 */
const FinancialReport = ({ year, month }) => {
    const { month: currentMonth, year: currentYear } = getCurrentMonthYear()
    const reportYear = year || currentYear
    const reportMonth = month || currentMonth

    const { data: summary, isLoading } = useFinancialReport(reportYear, reportMonth)

    // Calculate average payment
    const averagePayment = summary?.totalPayments > 0
        ? summary.totalRevenue / summary.totalPayments
        : 0

    // Payment status distribution chart
    const statusChartData = {
        labels: ['مدفوع', 'معلق', 'متأخر'],
        datasets: [{
            data: [
                summary?.paidCount || 0,
                summary?.pendingCount || 0,
                summary?.overdueCount || 0
            ],
            backgroundColor: [
                chartColors.successAlpha,
                chartColors.warningAlpha,
                chartColors.dangerAlpha
            ],
            borderColor: [
                chartColors.success,
                chartColors.warning,
                chartColors.danger
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

    if (!summary) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد بيانات</h3>
                <p className="text-gray-600">لم يتم العثور على بيانات مالية لهذا الشهر</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    icon={DollarSign}
                    title="إجمالي الإيرادات"
                    value={summary.totalRevenue || 0}
                    color="green"
                    format="currency"
                />
                <SummaryCard
                    icon={TrendingUp}
                    title="عدد المدفوعات"
                    value={summary.totalPayments || 0}
                    color="blue"
                    format="number"
                />
                <SummaryCard
                    icon={Award}
                    title="متوسط الدفعة"
                    value={averagePayment}
                    color="purple"
                    format="currency"
                />
                <SummaryCard
                    icon={Calendar}
                    title="المدفوعات المكتملة"
                    value={summary.paidCount || 0}
                    color="green"
                    format="number"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Status Chart */}
                <ReportChart
                    type="doughnut"
                    title="حالة المدفوعات"
                    data={statusChartData}
                    options={getPieChartConfig(statusChartData).options}
                    height={300}
                    isEmpty={summary.totalPayments === 0}
                />

                {/* Summary Stats Panel */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص الشهر</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">مدفوع</span>
                            <span className="text-lg font-bold text-green-600">{summary.paidCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">معلق</span>
                            <span className="text-lg font-bold text-yellow-600">{summary.pendingCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">متأخر</span>
                            <span className="text-lg font-bold text-red-600">{summary.overdueCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-t-2 border-blue-200">
                            <span className="text-sm font-medium text-gray-700">الإجمالي</span>
                            <span className="text-lg font-bold text-blue-600">{summary.totalPayments || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Month Info */}
            <div className="bg-gradient-to-l from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {getMonthName(summary.month)} {summary.year}
                        </h3>
                        <p className="text-gray-600">
                            إجمالي الإيرادات: <span className="font-bold text-primary">{formatCurrency(summary.totalRevenue)}</span>
                        </p>
                    </div>
                    <ExportButton
                        onExportPDF={() => console.log('Export PDF')}
                        onExportExcel={() => console.log('Export Excel')}
                        onPrint={() => window.print()}
                    />
                </div>
            </div>

            {/* Empty State */}
            {summary.totalPayments === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد مدفوعات</h3>
                    <p className="text-gray-600">لم يتم تسجيل أي مدفوعات في هذا الشهر</p>
                </div>
            )}
        </div>
    )
}

FinancialReport.propTypes = {
    year: PropTypes.number,
    month: PropTypes.number
}

export default FinancialReport
