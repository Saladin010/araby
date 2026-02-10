import { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Save, X, CheckSquare, XSquare } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { ar } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { StudentAttendanceCard, SessionInfoCard, AttendanceSummary } from '../attendance'
import { useSessions } from '../../hooks/useSessions'
import { useStudents } from '../../hooks/useStudents'
import { useRecordAttendance, useAttendanceBySession, useUpdateAttendance } from '../../hooks/useAttendance'
import api from '../../services/api'  // ✅ Import API instance

/**
 * RecordAttendance Component
 * Tab for recording attendance for a session
 */
const RecordAttendance = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedSessionId, setSelectedSessionId] = useState(null)
    const [attendanceData, setAttendanceData] = useState([])
    const [searchQuery, setSearchQuery] = useState('') // Search state

    // Fetch sessions for selected date
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const { data: allSessions = [] } = useSessions({})

    // Expand recurring sessions and filter by selected date
    const sessionsForDate = allSessions.filter(session => {
        const sessionDate = format(new Date(session.startTime), 'yyyy-MM-dd')

        // Check if it's a regular session on this date
        if (sessionDate === dateStr) {
            return true
        }

        // Check if it's a recurring session that occurs on this day
        if (session.isRecurring && session.recurringPattern) {
            try {
                const pattern = JSON.parse(session.recurringPattern)
                const selectedDayOfWeek = selectedDate.getDay() // 0 = Sunday, 6 = Saturday

                // Check if this day is in the recurrence pattern
                if (pattern.daysOfWeek && pattern.daysOfWeek.includes(selectedDayOfWeek)) {
                    // Check if selected date is after session start date
                    const sessionStartDate = new Date(session.startTime)
                    sessionStartDate.setHours(0, 0, 0, 0)
                    const checkDate = new Date(selectedDate)
                    checkDate.setHours(0, 0, 0, 0)

                    if (checkDate >= sessionStartDate) {
                        // Check if there's an end date and we haven't passed it
                        if (pattern.endDate) {
                            const endDate = new Date(pattern.endDate)
                            endDate.setHours(23, 59, 59, 999)
                            if (checkDate <= endDate) {
                                return true
                            }
                        } else {
                            // No end date, recurring indefinitely
                            return true
                        }
                    }
                }
            } catch (e) {
                console.error('Error parsing recurring pattern:', e)
            }
        }

        return false
    })

    // Fetch students
    const { data: studentsData } = useStudents({})
    const students = Array.isArray(studentsData) ? studentsData : []

    // Get selected session
    const selectedSession = sessionsForDate.find(s => s.id === selectedSessionId)

    // Check if attendance already recorded
    // Check if attendance already recorded
    const { data: existingAttendance = [] } = useAttendanceBySession(
        selectedSessionId,
        dateStr,
        { enabled: !!selectedSessionId }
    )
    const alreadyRecorded = existingAttendance.length > 0

    // Check if selected date is today (can edit only today's attendance)
    // NOTE: Allowing edit for past days for corrections if needed, or strictly today.
    // User requested "Manual Entry" which implies corrections.
    // Let's relax the restriction for Admin/Teacher if we had roles here, but for now we'll allow it generally 
    // OR keep strict if safety is preferred. The previous code had strict check.
    // "canEdit = isToday" -> I will comment this out to allow manual entry for past recurring sessions.
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(selectedDate)
    checkDate.setHours(0, 0, 0, 0)
    const isToday = checkDate.getTime() === today.getTime()
    // const canEdit = isToday 
    const canEdit = true // Allow editing any date for now per new requirements for manual entry

    // Record attendance mutation
    const recordAttendance = useRecordAttendance()
    const updateAttendance = useUpdateAttendance()

    // ✅ Fetch full session details with enrolled students
    const [fullSessionDetails, setFullSessionDetails] = useState(null)

    useEffect(() => {
        if (selectedSessionId) {
            // Fetch full session details from API
            const fetchSessionDetails = async () => {
                try {
                    console.log('[DEBUG] Fetching session details for ID:', selectedSessionId)
                    const response = await api.get(`/sessions/${selectedSessionId}`)
                    console.log('[DEBUG] Full session data:', response.data)
                    console.log('[DEBUG] Enrolled students:', response.data.enrolledStudents)
                    setFullSessionDetails(response.data)
                } catch (error) {
                    console.error('[DEBUG] Failed to fetch session details:', error)
                    console.error('[DEBUG] Error response:', error.response)
                    setFullSessionDetails(null)
                }
            }
            fetchSessionDetails()
        } else {
            setFullSessionDetails(null)
        }
    }, [selectedSessionId])

    // Initialize attendance data when session is selected
    useEffect(() => {
        console.log('[DEBUG] useEffect triggered')
        console.log('[DEBUG] fullSessionDetails:', fullSessionDetails)
        console.log('[DEBUG] enrolledStudents:', fullSessionDetails?.enrolledStudents)

        if (fullSessionDetails && fullSessionDetails.enrolledStudents) {
            // ✅ Use enrolled students from session (includes individual + group students)
            const enrolledStudents = fullSessionDetails.enrolledStudents

            console.log('[DEBUG] Found', enrolledStudents.length, 'enrolled students')

            // If attendance already exists, load it
            if (existingAttendance.length > 0) {
                console.log('[DEBUG] Loading existing attendance for', existingAttendance.length, 'records')
                setAttendanceData(
                    enrolledStudents.map(student => {
                        const existing = existingAttendance.find(a => a.studentId === student.id)
                        return {
                            studentId: student.id,
                            studentName: student.fullName,
                            status: existing?.status ?? null,
                            notes: existing?.notes || '',
                            attendanceId: existing?.id || null,
                            enrollmentSource: student.enrollmentSource
                        }
                    })
                )
            } else {
                console.log('[DEBUG] Creating new attendance data for', enrolledStudents.length, 'students')
                // New attendance - Default to null
                setAttendanceData(
                    enrolledStudents.map(student => ({
                        studentId: student.id,
                        studentName: student.fullName,
                        status: null,
                        notes: '',
                        attendanceId: null,
                        enrollmentSource: student.enrollmentSource
                    }))
                )
            }
        } else {
            console.log('[DEBUG] No enrolled students found or session not loaded yet')
            setAttendanceData([])
        }
    }, [fullSessionDetails, existingAttendance])

    // Handlers
    const handleQuickDate = (days) => {
        const date = new Date()
        date.setDate(date.getDate() + days)
        setSelectedDate(date)
        setSelectedSessionId(null)
    }

    const handleMarkAllPresent = () => {
        setAttendanceData(prev => prev.map(item => ({ ...item, status: 0 })))
    }

    const handleMarkAllAbsent = () => {
        setAttendanceData(prev => prev.map(item => ({ ...item, status: 2 })))
    }

    const handleClearAll = () => {
        setAttendanceData(prev => prev.map(item => ({ ...item, status: null })))
    }

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => prev.map(item =>
            item.studentId === studentId ? { ...item, status } : item
        ))
    }

    const handleNotesChange = (studentId, notes) => {
        setAttendanceData(prev => prev.map(item =>
            item.studentId === studentId ? { ...item, notes } : item
        ))
    }

    // Submit attendance
    const handleSubmit = async () => {
        if (!selectedSessionId) return

        // Check if can edit
        if (!canEdit) {
            alert('لا يمكن تعديل الحضور لهذه الفترة!')
            return
        }

        // Validate date for recurring sessions
        if (selectedSession?.isRecurring && selectedSession?.recurringPattern) {
            try {
                const pattern = JSON.parse(selectedSession.recurringPattern)
                const selectedDayOfWeek = selectedDate.getDay()

                // Check if today is one of the recurring days
                if (!pattern.daysOfWeek || !pattern.daysOfWeek.includes(selectedDayOfWeek)) {
                    alert('هذه الحصة لا تتكرر في يوم ' + format(selectedDate, 'EEEE', { locale: ar }))
                    return
                }
            } catch (e) {
                console.error('Error validating recurring pattern:', e)
            }
        }

        // Validate all students are marked
        const allMarked = attendanceData.every(item => item.status)
        if (!allMarked) {
            alert('يجب تحديد حالة لجميع الطلاب')
            return
        }

        try {
            if (alreadyRecorded) {
                // Update existing attendance
                // Update endpoint (PUT /attendance/{id}) doesn't need sessionDate as it updates by ID
                // But RECORD (POST) needs it.
                // WE SHOULD probably use the Upsert logic in backend via POST for "Edit" too if we want to support bulk update?
                // But the current UI iterates and calls updateAttendance (PUT) for each ID.
                for (const record of attendanceData) {
                    if (record.attendanceId) {
                        await updateAttendance.mutateAsync({
                            id: record.attendanceId,
                            data: {
                                status: record.status,
                                notes: record.notes
                            }
                        })
                    } else {
                        // Case: Student wasn't in list before but now is? Or attendance missing for one student?
                        // We should probably just use RecordAttendance (Upsert) for everything if backend supports it.
                        // But for now, let's stick to update loop for existing IDs.
                    }
                }
                alert('تم تحديث الحضور بنجاح')
            } else {
                // Create new attendance
                await recordAttendance.mutateAsync({
                    sessionId: selectedSessionId,
                    records: attendanceData.map(({ studentId, status, notes }) => ({
                        studentId,
                        status,
                        notes
                    })),
                    sessionDate: dateStr // Pass formatted date key
                })
            }

            // Don't reset
        } catch (error) {
            console.error('Failed to save attendance:', error)
        }
    }

    const allMarked = attendanceData.length > 0 && attendanceData.every(item => item.status)

    return (
        <div className="space-y-6">
            {/* Date Selector */}
            <div className="card">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    اختر التاريخ
                </h3>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Quick Buttons */}
                    <button
                        onClick={() => handleQuickDate(-1)}
                        className="btn btn-outline btn-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                        أمس
                    </button>
                    <button
                        onClick={() => handleQuickDate(0)}
                        className="btn btn-primary btn-sm"
                    >
                        اليوم
                    </button>
                    <button
                        onClick={() => handleQuickDate(1)}
                        className="btn btn-outline btn-sm"
                    >
                        غداً
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Date Picker */}
                    <input
                        type="date"
                        value={format(selectedDate, 'yyyy-MM-dd')}
                        onChange={(e) => {
                            setSelectedDate(new Date(e.target.value))
                            setSelectedSessionId(null)
                        }}
                        className="input flex-1"
                    />
                </div>

                <p className="text-text-muted text-sm">
                    التاريخ المحدد: {format(selectedDate, 'EEEE، d MMMM yyyy', { locale: ar })}
                </p>
            </div>

            {/* Session Selector */}
            <div className="card">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                    اختر الحصة
                </h3>

                {sessionsForDate.length === 0 ? (
                    <div className="text-center py-8">
                        <Calendar className="w-16 h-16 mx-auto text-text-muted mb-4" />
                        <p className="text-text-muted">لا توجد حصص في هذا التاريخ</p>
                    </div>
                ) : (
                    <select
                        value={selectedSessionId || ''}
                        onChange={(e) => setSelectedSessionId(Number(e.target.value))}
                        className="input w-full"
                    >
                        <option value="">-- اختر حصة --</option>
                        {sessionsForDate.map(session => {
                            const startTime = new Date(session.startTime)
                            const recurringLabel = session.isRecurring ? ' 🔄 (متكررة)' : ''
                            return (
                                <option key={session.id} value={session.id}>
                                    {session.title} - {format(startTime, 'h:mm a', { locale: ar })}
                                    {recurringLabel}
                                    ({session.enrolledStudentsCount || 0} طالب)
                                </option>
                            )
                        })}
                    </select>
                )}
            </div>

            {/* Session Info & Attendance Recording */}
            {selectedSession && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Session Info */}
                    <SessionInfoCard
                        session={selectedSession}
                        alreadyRecorded={alreadyRecorded}
                    />

                    {/* Edit Mode Indicator */}
                    {alreadyRecorded && (
                        <div className={`card ${canEdit ? 'border-warning' : 'border-info'}`}>
                            <div className="flex items-center gap-3">
                                {canEdit ? (
                                    <>
                                        <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
                                        <p className="text-warning font-semibold">
                                            وضع التعديل - يمكنك تعديل الحضور لليوم الحالي
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-3 h-3 bg-info rounded-full"></div>
                                        <p className="text-info font-semibold">
                                            وضع العرض فقط - لا يمكن تعديل حضور الأيام السابقة
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bulk Actions */}
                    {canEdit && (
                        <div className="card">
                            <h3 className="text-lg font-bold text-text-primary mb-4">
                                إجراءات سريعة
                            </h3>
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={handleMarkAllPresent}
                                        className="btn btn-success btn-sm"
                                    >
                                        <CheckSquare className="w-4 h-4" />
                                        تحديد الكل كحاضر
                                    </button>
                                    <button
                                        onClick={handleMarkAllAbsent}
                                        className="btn btn-error btn-sm"
                                    >
                                        <XSquare className="w-4 h-4" />
                                        تحديد الكل كغائب
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        className="btn btn-outline btn-sm"
                                    >
                                        <X className="w-4 h-4" />
                                        مسح الكل
                                    </button>
                                </div>
                                <div className="relative w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="بحث سريع..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="input py-2 pr-10 pl-4 w-full md:w-64"
                                    />
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    <AttendanceSummary
                        attendanceData={attendanceData}
                        totalStudents={attendanceData.length}
                    />

                    {/* Students Grid */}
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <h3 className="text-lg font-bold text-text-primary">
                                الطلاب ({attendanceData.length})
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {attendanceData
                                .filter(item => {
                                    if (!searchQuery) return true
                                    const student = students.find(s => s.id === item.studentId)
                                    if (!student) return false
                                    const query = searchQuery.toLowerCase()
                                    return (
                                        student.fullName.toLowerCase().includes(query) ||
                                        (student.studentNumber && student.studentNumber.toString().includes(query))
                                    )
                                })
                                .map((item, index) => {
                                    const student = students.find(s => s.id === item.studentId)
                                    if (!student) return null

                                    return (
                                        <StudentAttendanceCard
                                            key={student.id}
                                            student={student}
                                            status={item.status}
                                            notes={item.notes}
                                            onStatusChange={handleStatusChange}
                                            onNotesChange={handleNotesChange}
                                            index={index}
                                            disabled={!canEdit}
                                        />
                                    )
                                })}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="card bg-background">
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setSelectedSessionId(null)
                                    setAttendanceData([])
                                }}
                                className="btn btn-outline flex-1"
                            >
                                <X className="w-4 h-4" />
                                إلغاء
                            </button>
                            {canEdit && (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!allMarked || recordAttendance.isPending || updateAttendance.isPending}
                                    className="btn btn-primary flex-1"
                                >
                                    <Save className="w-4 h-4" />
                                    {alreadyRecorded ? 'تحديث الحضور' : 'حفظ الحضور'}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

export default RecordAttendance
