import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns'
import { ar } from 'date-fns/locale'
import { motion } from 'framer-motion'
import SessionCard from './SessionCard'
import { Calendar } from 'lucide-react'

/**
 * ListView Component
 * Displays sessions grouped by date
 */
const ListView = ({
    sessions = [],
    loading = false,
    onView,
    onEdit,
    onDelete,
    onTakeAttendance
}) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="h-6 w-1/3 bg-background rounded mb-4" />
                        <div className="h-4 w-full bg-background rounded mb-2" />
                        <div className="h-4 w-2/3 bg-background rounded" />
                    </div>
                ))}
            </div>
        )
    }

    if (!sessions || sessions.length === 0) {
        return (
            <div className="card text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-text-muted mb-4" />
                <h3 className="text-xl font-bold text-text-primary mb-2">
                    لا توجد حصص
                </h3>
                <p className="text-text-muted">
                    لم يتم العثور على أي حصص. ابدأ بإضافة حصة جديدة
                </p>
            </div>
        )
    }

    // Group sessions by date category
    const groupedSessions = {
        today: [],
        tomorrow: [],
        thisWeek: [],
        upcoming: [],
        past: [],
    }

    sessions.forEach((session) => {
        const sessionDate = new Date(session.startTime)

        if (isPast(sessionDate) && !isToday(sessionDate)) {
            groupedSessions.past.push(session)
        } else if (isToday(sessionDate)) {
            groupedSessions.today.push(session)
        } else if (isTomorrow(sessionDate)) {
            groupedSessions.tomorrow.push(session)
        } else if (isThisWeek(sessionDate, { weekStartsOn: 6 })) {
            groupedSessions.thisWeek.push(session)
        } else {
            groupedSessions.upcoming.push(session)
        }
    })

    // Sort each group by start time
    Object.keys(groupedSessions).forEach((key) => {
        groupedSessions[key].sort((a, b) =>
            new Date(a.startTime) - new Date(b.startTime)
        )
    })

    const renderGroup = (title, sessions, icon) => {
        if (sessions.length === 0) return null

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <h2 className="text-xl font-bold text-text-primary">
                        {title}
                        <span className="text-text-muted text-base font-normal mr-2">
                            ({sessions.length})
                        </span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session, index) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onView={onView}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onTakeAttendance={onTakeAttendance}
                            index={index}
                        />
                    ))}
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-8">
            {renderGroup(
                'اليوم',
                groupedSessions.today,
                <div className="w-2 h-8 bg-primary rounded" />
            )}

            {renderGroup(
                'غداً',
                groupedSessions.tomorrow,
                <div className="w-2 h-8 bg-info rounded" />
            )}

            {renderGroup(
                'هذا الأسبوع',
                groupedSessions.thisWeek,
                <div className="w-2 h-8 bg-success rounded" />
            )}

            {renderGroup(
                'القادمة',
                groupedSessions.upcoming,
                <div className="w-2 h-8 bg-secondary rounded" />
            )}

            {renderGroup(
                'السابقة',
                groupedSessions.past,
                <div className="w-2 h-8 bg-text-muted rounded" />
            )}
        </div>
    )
}

export default ListView
