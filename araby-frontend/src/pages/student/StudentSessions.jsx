import { Calendar, Clock, User as UserIcon, MapPin, Filter } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import authService from '../../services/authService'
import { DashboardLayout } from '../../components/layout'
import { formatDate, formatTime } from '../../utils/dateUtils'

/**
 * Student Sessions Page
 * Displays all sessions for the logged-in student
 */
const StudentSessions = () => {
    const user = authService.getCurrentUser()
    const [filter, setFilter] = useState('all') // all, upcoming, completed

    // Fetch student sessions
    const { data: sessions, isLoading, error } = useQuery({
        queryKey: ['studentSessions', user?.userId],
        queryFn: async () => {
            const response = await api.get(`/sessions/student/${user?.userId}`)
            return response.data || []
        },
        enabled: !!user?.userId,
    })

    // Filter sessions
    const filteredSessions = sessions?.filter(session => {
        const sessionDate = new Date(session.startTime)
        const now = new Date()

        if (filter === 'upcoming') return sessionDate > now
        if (filter === 'completed') return sessionDate <= now
        return true
    }) || []

    if (error) {
        return (
            <DashboardLayout>
                <div className="card bg-error/10 border-error">
                    <p className="text-error">حدث خطأ أثناء تحميل الحصص</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">حصصي</h1>
                <p className="text-text-muted">جميع الحصص المسجلة</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-background text-text-muted hover:bg-background-hover'
                        }`}
                >
                    <Filter className="w-4 h-4 inline-block mr-2" />
                    الكل ({sessions?.length || 0})
                </button>
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'upcoming'
                            ? 'bg-primary text-white'
                            : 'bg-background text-text-muted hover:bg-background-hover'
                        }`}
                >
                    القادمة ({sessions?.filter(s => new Date(s.startTime) > new Date()).length || 0})
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'completed'
                            ? 'bg-primary text-white'
                            : 'bg-background text-text-muted hover:bg-background-hover'
                        }`}
                >
                    المكتملة ({sessions?.filter(s => new Date(s.startTime) <= new Date()).length || 0})
                </button>
            </div>

            {/* Sessions List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-20 bg-background rounded" />
                        </div>
                    ))}
                </div>
            ) : filteredSessions.length === 0 ? (
                <div className="card text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-text-muted" />
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                        لا توجد حصص
                    </h3>
                    <p className="text-text-muted">
                        {filter === 'upcoming' ? 'لا توجد حصص قادمة' :
                            filter === 'completed' ? 'لا توجد حصص مكتملة' :
                                'لم يتم تسجيلك في أي حصص بعد'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSessions.map((session, index) => {
                        const isUpcoming = new Date(session.startTime) > new Date()
                        return (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="card hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isUpcoming ? 'bg-primary/10' : 'bg-background'
                                                }`}>
                                                <Calendar className={`w-6 h-6 ${isUpcoming ? 'text-primary' : 'text-text-muted'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-text-primary">
                                                    {session.subject || 'حصة دراسية'}
                                                </h3>
                                                <p className="text-sm text-text-muted">
                                                    {session.description || 'لا يوجد وصف'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDate(session.startTime)} - {formatTime(session.startTime)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <UserIcon className="w-4 h-4" />
                                                <span>المدة: {session.duration || 60} دقيقة</span>
                                            </div>
                                            {session.location && (
                                                <div className="flex items-center gap-2 text-text-muted">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{session.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isUpcoming
                                                ? 'bg-info/10 text-info'
                                                : 'bg-success/10 text-success'
                                            }`}>
                                            {isUpcoming ? 'قادمة' : 'مكتملة'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </DashboardLayout>
    )
}

export default StudentSessions
