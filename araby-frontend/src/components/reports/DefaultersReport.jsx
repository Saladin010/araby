import { DollarSign, Clock, AlertCircle, TrendingUp, Phone } from 'lucide-react'
import PropTypes from 'prop-types'
import { useDefaultersReport } from '../../hooks/useReports'
import { SummaryCard, ReportChart, ReportTable, ExportButton } from './'
import { formatCurrency, daysBetween, formatDate } from '../../utils/reportHelpers'
import { chartColors, getPieChartConfig, getBarChartConfig } from '../../utils/chartHelpers'

/**
 * DefaultersReport Component
 * Report for students with overdue payments
 */
const DefaultersReport = () => {
    const { data: defaulters = [], isLoading } = useDefaultersReport()

    // Calculate summary stats
    const totalDefaulters = defaulters.length
    const totalOverdueAmount = defaulters.reduce((sum, d) => sum + d.overdueAmount, 0)

    // Calculate days overdue for each defaulter
    const defaultersWithDays = defaulters.map(d => ({
        ...d,
        daysOverdue: d.lastPaymentDate ? daysBetween(d.lastPaymentDate, new Date()) : 0
    }))

    const longestOverdue = defaultersWithDays.length > 0
        ? Math.max(...defaultersWithDays.map(d => d.daysOverdue))
        : 0

    const averageOverdue = totalDefaulters > 0
        ? totalOverdueAmount / totalDefaulters
        : 0

    // Overdue period distribution
    const periodDistribution = {
        '1-7': 0,
        '8-15': 0,
        '16-30': 0,
        '31-60': 0,
        '60+': 0
    }

    defaultersWithDays.forEach(d => {
        const days = d.daysOverdue
        if (days <= 7) periodDistribution['1-7']++
        else if (days <= 15) periodDistribution['8-15']++
        else if (days <= 30) periodDistribution['16-30']++
        else if (days <= 60) periodDistribution['31-60']++
        else periodDistribution['60+']++
    })

    // Chart data - Overdue period distribution
    const periodChartData = {
        labels: ['1-7 أيام', '8-15 يوم', '16-30 يوم', '31-60 يوم', 'أكثر من 60 يوم'],
        datasets: [{
            label: 'عدد الطلاب',
            data: Object.values(periodDistribution),
            backgroundColor: [
                chartColors.successAlpha,
                chartColors.infoAlpha,
                chartColors.warningAlpha,
                chartColors.dangerAlpha,
                'rgba(139, 0, 0, 0.1)'
            ],
            borderColor: [
                chartColors.success,
                chartColors.info,
                chartColors.warning,
                chartColors.danger,
                'rgb(139, 0, 0)'
            ],
            borderWidth: 2
        }]
    }

    // Table columns
    const columns = [
        {
            key: 'index',
            label: '#',
            render: (_, __, index) => index + 1
        },
        {
            key: 'studentName',
            label: 'الطالب',
            sortable: true
        },
        {
            key: 'totalOverdue',
            label: 'عدد المتأخرات',
            sortable: true,
            render: (value) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {value}
                </span>
            )
        },
        {
            key: 'overdueAmount',
            label: 'المبلغ المتأخر',
            sortable: true,
            render: (value) => (
                <span className="font-bold text-red-600">
                    {formatCurrency(value)}
                </span>
            )
        },
        {
            key: 'daysOverdue',
            label: 'أيام التأخير',
            sortable: true,
            render: (value) => {
                let colorClass = 'text-gray-600'
                if (value > 60) colorClass = 'text-red-600 font-bold'
                else if (value > 30) colorClass = 'text-orange-600 font-medium'
                else if (value > 15) colorClass = 'text-yellow-600'

                return (
                    <span className={colorClass}>
                        {value} يوم
                    </span>
                )
            }
        },
        {
            key: 'lastPaymentDate',
            label: 'آخر دفعة',
            sortable: true,
            render: (value) => formatDate(value)
        }
    ]

    // Sort by amount (highest first)
    const sortedDefaulters = [...defaultersWithDays].sort((a, b) => b.overdueAmount - a.overdueAmount)

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
                    icon={AlertCircle}
                    title="عدد المتأخرين"
                    value={totalDefaulters}
                    color="orange"
                    format="number"
                />
                <SummaryCard
                    icon={DollarSign}
                    title="إجمالي المتأخرات"
                    value={totalOverdueAmount}
                    color="orange"
                    format="currency"
                />
                <SummaryCard
                    icon={Clock}
                    title="أطول فترة تأخير"
                    value={`${longestOverdue} يوم`}
                    color="orange"
                    format="text"
                />
                <SummaryCard
                    icon={TrendingUp}
                    title="متوسط المبلغ المتأخر"
                    value={averageOverdue}
                    color="orange"
                    format="currency"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReportChart
                    type="bar"
                    title="توزيع فترات التأخير"
                    data={periodChartData}
                    options={getBarChartConfig(periodChartData).options}
                    height={300}
                    isEmpty={totalDefaulters === 0}
                />

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">أكثر المتأخرين</h3>
                    <div className="space-y-3">
                        {sortedDefaulters.slice(0, 5).map((defaulter, index) => (
                            <div key={defaulter.studentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{defaulter.studentName}</p>
                                        <p className="text-xs text-gray-500">{defaulter.daysOverdue} يوم تأخير</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-red-600">{formatCurrency(defaulter.overdueAmount)}</p>
                                    <p className="text-xs text-gray-500">{defaulter.totalOverdue} متأخرات</p>
                                </div>
                            </div>
                        ))}
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

            {/* Detailed Table */}
            <ReportTable
                columns={columns}
                data={sortedDefaulters}
                pageSize={10}
            />

            {/* Empty State */}
            {totalDefaulters === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-green-900 mb-2">رائع! لا توجد متأخرات</h3>
                    <p className="text-green-700">جميع الطلاب ملتزمون بالدفع في المواعيد المحددة</p>
                </div>
            )}
        </div>
    )
}

DefaultersReport.propTypes = {}

export default DefaultersReport
