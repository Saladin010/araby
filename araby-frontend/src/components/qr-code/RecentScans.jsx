import { Clock, CheckCircle, AlertCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { Avatar } from '../common'

/**
 * Recent Scans Component
 * Shows recent attendance scans
 */
const RecentScans = ({ scans = [] }) => {
    if (scans.length === 0) {
        return (
            <div className="card text-center py-8">
                <p className="text-text-secondary">لا توجد عمليات مسح حديثة</p>
            </div>
        )
    }

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4">عمليات المسح الأخيرة</h3>
            <div className="space-y-3">
                {scans.map((scan, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-background/80 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar name={scan.studentName} size="sm" />
                            <div>
                                <p className="font-medium text-text-primary">{scan.studentName}</p>
                                <p className="text-sm text-text-secondary">
                                    #{scan.studentNumber} • {scan.sessionTitle}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-left">
                                <p className="text-sm text-text-muted flex items-center gap-1">
                                    <Clock size={14} />
                                    {new Date(scan.scanTime).toLocaleTimeString('ar-EG', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <span
                                className={`badge ${scan.status === 0
                                    ? 'badge-success'
                                    : scan.status === 1
                                        ? 'badge-warning'
                                        : 'badge-error'
                                    }`}
                            >
                                {scan.status === 0 ? (
                                    <>
                                        <CheckCircle size={14} className="ml-1" />
                                        حاضر
                                    </>
                                ) : scan.status === 1 ? (
                                    <>
                                        <AlertCircle size={14} className="ml-1" />
                                        متأخر
                                    </>
                                ) : (
                                    'غائب'
                                )}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

RecentScans.propTypes = {
    scans: PropTypes.arrayOf(
        PropTypes.shape({
            studentName: PropTypes.string.isRequired,
            studentNumber: PropTypes.number.isRequired,
            sessionTitle: PropTypes.string.isRequired,
            scanTime: PropTypes.string.isRequired,
            status: PropTypes.number.isRequired,
        })
    ),
}

export default RecentScans
