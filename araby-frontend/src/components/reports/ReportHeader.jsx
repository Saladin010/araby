import PropTypes from 'prop-types'
import { formatDateTime } from '../../utils/reportHelpers'

/**
 * ReportHeader Component
 * Header for reports with title, date range, and metadata
 */
const ReportHeader = ({ title, dateRange, generatedAt, generatedBy }) => {
    return (
        <div className="bg-gradient-to-l from-primary to-primary-dark text-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    {dateRange && (
                        <p className="text-white/90 text-sm">
                            📅 {dateRange}
                        </p>
                    )}
                </div>

                <div className="text-left text-sm text-white/80">
                    {generatedAt && (
                        <p className="mb-1">
                            <span className="font-medium">تاريخ الإنشاء:</span> {formatDateTime(generatedAt)}
                        </p>
                    )}
                    {generatedBy && (
                        <p>
                            <span className="font-medium">بواسطة:</span> {generatedBy}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

ReportHeader.propTypes = {
    title: PropTypes.string.isRequired,
    dateRange: PropTypes.string,
    generatedAt: PropTypes.string,
    generatedBy: PropTypes.string
}

export default ReportHeader
