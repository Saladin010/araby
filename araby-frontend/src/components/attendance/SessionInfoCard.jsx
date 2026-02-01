import { Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

/**
 * SessionInfoCard Component
 * Displays session information when recording attendance
 */
const SessionInfoCard = ({ session, alreadyRecorded = false }) => {
    if (!session) return null

    const startTime = new Date(session.startTime)
    const endTime = new Date(session.endTime)

    // Calculate duration
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60))
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    const durationText = hours > 0
        ? `${hours} ساعة${minutes > 0 ? ` و ${minutes} دقيقة` : ''}`
        : `${minutes} دقيقة`

    const isPrivate = session.type === 1 || session.type === 'Individual'

    return (
        <div className="card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            {/* Warning if already recorded */}
            {alreadyRecorded && (
                <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <p className="text-warning font-semibold">
                        ⚠️ تم تسجيل الحضور مسبقاً لهذه الحصة
                    </p>
                </div>
            )}

            {/* Session Title */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {session.title}
                </h2>
                <div className="flex items-center gap-2">
                    <span className={`badge ${isPrivate ? 'badge-primary' : 'badge-success'}`}>
                        {isPrivate ? 'فردي' : 'جماعي'}
                    </span>
                </div>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                        <p className="font-semibold text-text-primary">التاريخ والوقت</p>
                        <p className="text-text-muted text-sm">
                            {format(startTime, 'EEEE، d MMMM yyyy', { locale: ar })}
                        </p>
                        <p className="text-text-muted text-sm">
                            {format(startTime, 'h:mm a', { locale: ar })} - {format(endTime, 'h:mm a', { locale: ar })}
                            <span className="text-xs mr-2">({durationText})</span>
                        </p>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                        <p className="font-semibold text-text-primary">المكان</p>
                        <p className="text-text-muted text-sm">{session.location}</p>
                        {session.locationUrl && (
                            <a
                                href={session.locationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm"
                            >
                                رابط الحصة
                            </a>
                        )}
                    </div>
                </div>

                {/* Students Count */}
                <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-1" />
                    <div>
                        <p className="font-semibold text-text-primary">عدد الطلاب</p>
                        <p className="text-text-muted text-sm">
                            {isPrivate
                                ? 'حصة فردية'
                                : `${session.enrolledStudentsCount || 0} طالب`
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SessionInfoCard
