import { useState } from 'react'
import { Search, Filter, Calendar, User, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useAllAttendance } from '../../hooks/useAttendance'
import { useSessions } from '../../hooks/useSessions'
import { useStudents } from '../../hooks/useStudents'

/**
 * AttendanceHistory Component
 * View and manage attendance history with filters
 */
const AttendanceHistory = () => {
    const [filters, setFilters] = useState({
        sessionId: null,
        studentId: null,
        status: null,
        startDate: null,
        endDate: null,
    })

    // Fetch all data
    const { data: allAttendance = [], isLoading } = useAllAttendance()
    const { data: sessions = [] } = useSessions({})
    const { data: studentsData } = useStudents({})
    const students = Array.isArray(studentsData) ? studentsData : []

    // Apply filters
    let attendanceRecords = allAttendance

    if (filters.sessionId) {
        attendanceRecords = attendanceRecords.filter(r => r.sessionId === filters.sessionId)
    }
    if (filters.studentId) {
        attendanceRecords = attendanceRecords.filter(r => r.studentId === filters.studentId)
    }
    if (filters.status) {
        attendanceRecords = attendanceRecords.filter(r => r.status === filters.status)
    }
    if (filters.startDate) {
        const startDate = new Date(filters.startDate)
        startDate.setHours(0, 0, 0, 0)
        attendanceRecords = attendanceRecords.filter(r => {
            const recordDate = new Date(r.recordedAt)
            recordDate.setHours(0, 0, 0, 0)
            return recordDate >= startDate
        })
    }
    if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        attendanceRecords = attendanceRecords.filter(r => {
            const recordDate = new Date(r.recordedAt)
            return recordDate <= endDate
        })
    }

    // Status options
    const statusOptions = [
        { value: null, label: 'الكل' },
        { value: 1, label: 'حاضر', color: 'success' },
        { value: 2, label: 'غائب', color: 'error' },
        { value: 3, label: 'متأخر', color: 'warning' },
        { value: 4, label: 'معذور', color: 'info' },
    ]

    const getStatusBadge = (status) => {
        const option = statusOptions.find(s => s.value === status)
        return (
            <span className={`badge badge-${option?.color || 'secondary'}`}>
                {option?.label || 'غير محدد'}
            </span>
        )
    }

    const handleReset = () => {
        setFilters({
            sessionId: null,
            studentId: null,
            status: null,
            startDate: null,
            endDate: null,
        })
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="card">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    الفلاتر
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Session Filter */}
                    <div>
                        <label className="label">
                            <Calendar className="w-4 h-4" />
                            <span className="mr-2">الحصة</span>
                        </label>
                        <select
                            value={filters.sessionId || ''}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                sessionId: e.target.value ? Number(e.target.value) : null
                            }))}
                            className="input w-full"
                        >
                            <option value="">جميع الحصص</option>
                            {sessions.map(session => (
                                <option key={session.id} value={session.id}>
                                    {session.title} - {format(new Date(session.startTime), 'd MMM', { locale: ar })}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Student Filter */}
                    <div>
                        <label className="label">
                            <User className="w-4 h-4" />
                            <span className="mr-2">الطالب</span>
                        </label>
                        <select
                            value={filters.studentId || ''}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                studentId: e.target.value || null
                            }))}
                            className="input w-full"
                        >
                            <option value="">جميع الطلاب</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="label">الحالة</label>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                status: e.target.value ? Number(e.target.value) : null
                            }))}
                            className="input w-full"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value || ''}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="label">من تاريخ</label>
                        <input
                            type="date"
                            value={filters.startDate || ''}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                startDate: e.target.value
                            }))}
                            className="input w-full"
                        />
                    </div>

                    <div>
                        <label className="label">إلى تاريخ</label>
                        <input
                            type="date"
                            value={filters.endDate || ''}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                endDate: e.target.value
                            }))}
                            className="input w-full"
                        />
                    </div>

                    {/* Reset Button */}
                    <div className="flex items-end">
                        <button
                            onClick={handleReset}
                            className="btn btn-outline w-full"
                        >
                            إعادة تعيين
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        سجلات الحضور ({attendanceRecords.length})
                    </h3>
                </div>

                {attendanceRecords.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto text-text-muted mb-4" />
                        <p className="text-text-muted">لا توجد سجلات حضور</p>
                        <p className="text-sm text-text-muted mt-2">
                            اختر حصة أو طالب من الفلاتر أعلاه
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-right p-3 font-semibold text-text-primary">التاريخ</th>
                                    <th className="text-right p-3 font-semibold text-text-primary">الحصة</th>
                                    <th className="text-right p-3 font-semibold text-text-primary">الطالب</th>
                                    <th className="text-right p-3 font-semibold text-text-primary">الحالة</th>
                                    <th className="text-right p-3 font-semibold text-text-primary">الملاحظات</th>
                                    <th className="text-right p-3 font-semibold text-text-primary">تم التسجيل بواسطة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecords.map((record, index) => (
                                    <motion.tr
                                        key={record.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-border hover:bg-background transition-colors"
                                    >
                                        <td className="p-3 text-text-muted">
                                            {format(new Date(record.recordedAt), 'd MMM yyyy', { locale: ar })}
                                        </td>
                                        <td className="p-3 text-text-primary font-medium">
                                            {record.sessionTitle}
                                        </td>
                                        <td className="p-3 text-text-primary">
                                            {record.studentName}
                                        </td>
                                        <td className="p-3">
                                            {getStatusBadge(record.status)}
                                        </td>
                                        <td className="p-3 text-text-muted text-sm">
                                            {record.notes || '-'}
                                        </td>
                                        <td className="p-3 text-text-muted text-sm">
                                            {record.recordedByName}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AttendanceHistory
