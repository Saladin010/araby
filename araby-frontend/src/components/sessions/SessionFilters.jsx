import { useState } from 'react'
import { Calendar, Filter, X } from 'lucide-react'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

/**
 * SessionFilters Component
 * Filters for sessions (date range, type, student)
 */
const SessionFilters = ({ onFilterChange, students = [] }) => {
    const [dateRange, setDateRange] = useState('all')
    const [sessionType, setSessionType] = useState('all')
    const [selectedStudent, setSelectedStudent] = useState('all')
    const [customStartDate, setCustomStartDate] = useState('')
    const [customEndDate, setCustomEndDate] = useState('')

    const handleDateRangeChange = (range) => {
        setDateRange(range)

        let startDate = null
        let endDate = null
        const now = new Date()

        switch (range) {
            case 'today':
                startDate = startOfDay(now)
                endDate = endOfDay(now)
                break
            case 'week':
                startDate = startOfWeek(now, { weekStartsOn: 6 }) // Saturday
                endDate = endOfWeek(now, { weekStartsOn: 6 })
                break
            case 'month':
                startDate = startOfMonth(now)
                endDate = endOfMonth(now)
                break
            case 'custom':
                // Will be handled separately
                return
            case 'all':
            default:
                startDate = null
                endDate = null
        }

        onFilterChange({
            startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
            endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null,
            type: sessionType !== 'all' ? sessionType : null,
            studentId: selectedStudent !== 'all' ? selectedStudent : null,
        })
    }

    const handleSessionTypeChange = (type) => {
        setSessionType(type)
        updateFilters({ type })
    }

    const handleStudentChange = (studentId) => {
        setSelectedStudent(studentId)
        updateFilters({ studentId })
    }

    const handleCustomDateChange = () => {
        if (customStartDate && customEndDate) {
            onFilterChange({
                startDate: customStartDate,
                endDate: customEndDate,
                type: sessionType !== 'all' ? sessionType : null,
                studentId: selectedStudent !== 'all' ? selectedStudent : null,
            })
        }
    }

    const updateFilters = (updates) => {
        const filters = {
            startDate: dateRange === 'custom' && customStartDate ? customStartDate : null,
            endDate: dateRange === 'custom' && customEndDate ? customEndDate : null,
            type: sessionType !== 'all' ? sessionType : null,
            studentId: selectedStudent !== 'all' ? selectedStudent : null,
            ...updates,
        }

        // Recalculate date range if needed
        if (dateRange !== 'all' && dateRange !== 'custom') {
            handleDateRangeChange(dateRange)
            return
        }

        onFilterChange(filters)
    }

    const clearFilters = () => {
        setDateRange('all')
        setSessionType('all')
        setSelectedStudent('all')
        setCustomStartDate('')
        setCustomEndDate('')
        onFilterChange({
            startDate: null,
            endDate: null,
            type: null,
            studentId: null,
        })
    }

    const hasActiveFilters = dateRange !== 'all' || sessionType !== 'all' || selectedStudent !== 'all'

    return (
        <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-text-muted" />
                    <h3 className="font-semibold text-text-primary">الفلاتر</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="btn btn-ghost btn-sm text-error"
                    >
                        <X className="w-4 h-4" />
                        مسح الفلاتر
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Range Filter */}
                <div>
                    <label className="label">
                        <Calendar className="w-4 h-4" />
                        <span className="mr-2">التاريخ</span>
                    </label>
                    <select
                        value={dateRange}
                        onChange={(e) => handleDateRangeChange(e.target.value)}
                        className="input"
                    >
                        <option value="all">كل الحصص</option>
                        <option value="today">اليوم</option>
                        <option value="week">هذا الأسبوع</option>
                        <option value="month">هذا الشهر</option>
                        <option value="custom">مخصص</option>
                    </select>

                    {/* Custom Date Range */}
                    {dateRange === 'custom' && (
                        <div className="mt-2 space-y-2">
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="input text-sm"
                                placeholder="من تاريخ"
                            />
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                className="input text-sm"
                                placeholder="إلى تاريخ"
                            />
                            <button
                                onClick={handleCustomDateChange}
                                className="btn btn-sm btn-primary w-full"
                                disabled={!customStartDate || !customEndDate}
                            >
                                تطبيق
                            </button>
                        </div>
                    )}
                </div>

                {/* Session Type Filter */}
                <div>
                    <label className="label">نوع الحصة</label>
                    <select
                        value={sessionType}
                        onChange={(e) => handleSessionTypeChange(e.target.value)}
                        className="input"
                    >
                        <option value="all">كل الأنواع</option>
                        <option value="1">فردي</option>
                        <option value="2">جماعي</option>
                    </select>
                </div>

                {/* Student Filter */}
                <div>
                    <label className="label">الطالب</label>
                    <select
                        value={selectedStudent}
                        onChange={(e) => handleStudentChange(e.target.value)}
                        className="input"
                    >
                        <option value="all">كل الطلاب</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.fullName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SessionFilters
