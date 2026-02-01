import { useRef, useEffect } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

// Register Chart.js components
ChartJS.register(...registerables)

/**
 * ReportChart Component
 * Reusable chart wrapper with loading and empty states
 */
const ReportChart = ({ type, data, options, title, height = 300, isLoading, isEmpty }) => {
    const chartRef = useRef(null)

    // Chart components map
    const chartComponents = {
        line: Line,
        bar: Bar,
        pie: Pie,
        doughnut: Doughnut
    }

    const ChartComponent = chartComponents[type] || Line

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {title && (
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
                )}
                <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (isEmpty || !data) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {title && (
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
                )}
                <div className="flex flex-col items-center justify-center text-gray-400" style={{ height: `${height}px` }}>
                    <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-sm">لا توجد بيانات لعرضها</p>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
        >
            {title && (
                <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
            )}
            <div style={{ height: `${height}px` }}>
                <ChartComponent
                    ref={chartRef}
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        ...options
                    }}
                />
            </div>
        </motion.div>
    )
}

ReportChart.propTypes = {
    type: PropTypes.oneOf(['line', 'bar', 'pie', 'doughnut']).isRequired,
    data: PropTypes.object,
    options: PropTypes.object,
    title: PropTypes.string,
    height: PropTypes.number,
    isLoading: PropTypes.bool,
    isEmpty: PropTypes.bool
}

export default ReportChart
