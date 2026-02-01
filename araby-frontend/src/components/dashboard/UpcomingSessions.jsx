import { motion } from 'framer-motion'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatTime, formatDate } from '../../utils/dateUtils'
import EmptyState from './EmptyState'

/**
 * UpcomingSession Component - Displays upcoming session card
 */
const UpcomingSession = ({ session, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card card-hover border-r-4 border-primary"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="font-bold text-text-primary mb-1">{session.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(session.startTime)}</span>
                    </div>
                </div>
                <span className="badge badge-info">{session.type === 'Group' ? 'جماعي' : 'فردي'}</span>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </span>
                </div>

                {session.location && (
                    <div className="flex items-center gap-2 text-text-muted">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                    </div>
                )}

                {session.studentsCount !== undefined && (
                    <div className="flex items-center gap-2 text-text-muted">
                        <Users className="w-4 h-4" />
                        <span>
                            {session.studentsCount} طالب
                            {session.maxStudents && ` / ${session.maxStudents}`}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

/**
 * UpcomingSessions Component - List of upcoming sessions
 */
const UpcomingSessions = ({ sessions, loading = false }) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card">
                        <div className="h-6 w-3/4 bg-background rounded mb-3 animate-pulse" />
                        <div className="h-4 w-1/2 bg-background rounded mb-2 animate-pulse" />
                        <div className="h-4 w-2/3 bg-background rounded animate-pulse" />
                    </div>
                ))}
            </div>
        )
    }

    if (!sessions || sessions.length === 0) {
        return (
            <EmptyState
                icon={Calendar}
                title="لا توجد حصص قادمة"
                description="لم يتم جدولة أي حصص في الوقت الحالي"
                action={
                    <Link to="/sessions/add" className="btn btn-primary btn-sm">
                        جدولة حصة جديدة
                    </Link>
                }
            />
        )
    }

    return (
        <div className="space-y-4">
            {sessions.map((session, index) => (
                <UpcomingSession key={session.id} session={session} index={index} />
            ))}
        </div>
    )
}

export default UpcomingSessions
