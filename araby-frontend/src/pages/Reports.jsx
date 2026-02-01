import { useState } from 'react'
import { FileText, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '../components/layout'
import {
    ReportTypeSelector,
    ReportHeader,
    FinancialReport,
    AttendanceReport,
    PerformanceReport,
    DefaultersReport
} from '../components/reports'
import { formatDateRange, getCurrentMonthYear, getMonthName } from '../utils/dateHelpers'
import { useAuth } from '../hooks/useAuth'

/**
 * Reports Page
 * Main reports page with type selection and report display
 */
const Reports = () => {
    const { user } = useAuth()
    const [selectedReport, setSelectedReport] = useState(null)
    const { month, year } = getCurrentMonthYear()

    const reportComponents = {
        financial: FinancialReport,
        attendance: AttendanceReport,
        performance: PerformanceReport,
        defaulters: DefaultersReport
    }

    const reportTitles = {
        financial: 'التقرير المالي',
        attendance: 'تقرير الحضور',
        performance: 'تقرير الأداء الأكاديمي',
        defaulters: 'تقرير المتأخرات'
    }

    const handleSelectReport = (reportType) => {
        setSelectedReport(reportType)
    }

    const handleBackToSelection = () => {
        setSelectedReport(null)
    }

    const ReportComponent = selectedReport ? reportComponents[selectedReport] : null

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📊 التقارير والإحصائيات
                        </h1>
                        <p className="text-gray-600">
                            عرض وتحليل البيانات المالية والأكاديمية
                        </p>
                    </div>
                    {selectedReport && (
                        <button
                            onClick={handleBackToSelection}
                            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <ArrowRight className="w-5 h-5" />
                            <span>العودة للتقارير</span>
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!selectedReport ? (
                        /* Report Type Selection */
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <FileText className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        اختر نوع التقرير
                                    </h2>
                                </div>
                                <ReportTypeSelector
                                    onSelect={handleSelectReport}
                                    selectedType={selectedReport}
                                />
                            </div>

                            {/* Info Card */}
                            <div className="bg-gradient-to-l from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-blue-900 mb-2">
                                    💡 نصيحة
                                </h3>
                                <p className="text-blue-800">
                                    اختر نوع التقرير المناسب لعرض البيانات والإحصائيات التي تحتاجها.
                                    يمكنك تصدير أي تقرير بصيغة PDF أو Excel للحفظ أو المشاركة.
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        /* Selected Report Display */
                        <motion.div
                            key="report"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Report Header */}
                            <ReportHeader
                                title={reportTitles[selectedReport]}
                                dateRange={selectedReport === 'financial'
                                    ? `${getMonthName(month)} ${year}`
                                    : 'جميع البيانات'
                                }
                                generatedAt={new Date().toISOString()}
                                generatedBy={user?.fullName}
                            />

                            {/* Report Content */}
                            {ReportComponent && (
                                <ReportComponent
                                    year={year}
                                    month={month}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    )
}

export default Reports
