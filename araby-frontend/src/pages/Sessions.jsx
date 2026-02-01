import { useState } from 'react'
import { Calendar as CalendarIcon, List, Plus, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/layout'
import {
    SessionFilters,
    ListView,
    CalendarView,
    AddEditSessionModal,
    SessionDetailsModal,
    DeleteConfirmation
} from '../components/sessions'
import {
    useSessions,
    useCreateSession,
    useUpdateSession,
    useDeleteSession
} from '../hooks/useSessions'
import { useStudents } from '../hooks/useStudents'

/**
 * Sessions Page - Main sessions management page
 */
const Sessions = () => {
    const navigate = useNavigate()

    // View mode state
    const [viewMode, setViewMode] = useState('list') // 'calendar' or 'list'

    // Filter state
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        type: null,
        studentId: null,
    })

    // Modal state
    const [showAddEditModal, setShowAddEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedSession, setSelectedSession] = useState(null)

    // Fetch data
    const { data: sessions = [], isLoading } = useSessions(filters)
    const { data: studentsData } = useStudents({})
    const students = Array.isArray(studentsData) ? studentsData : []

    // Mutations
    const createSession = useCreateSession()
    const updateSession = useUpdateSession()
    const deleteSession = useDeleteSession()

    const totalSessions = sessions.length

    // Handlers
    const handleAddSession = () => {
        setSelectedSession(null)
        setShowAddEditModal(true)
    }

    const handleViewSession = (session) => {
        setSelectedSession(session)
        setShowDetailsModal(true)
    }

    const handleEditSession = (session) => {
        setSelectedSession(session)
        setShowAddEditModal(true)
    }

    const handleDeleteSession = (session) => {
        setSelectedSession(session)
        setShowDeleteModal(true)
    }

    const handleTakeAttendance = (session) => {
        // Navigate to attendance page
        navigate(`/attendance/session/${session.id}`)
    }

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters)
    }

    const handleSubmitSession = async (data) => {
        console.log('=== handleSubmitSession called ===')
        console.log('Selected session:', selectedSession)
        console.log('Form data received:', data)

        try {
            if (selectedSession) {
                console.log('Updating session with ID:', selectedSession.id)
                console.log('Update data:', data)
                await updateSession.mutateAsync({ id: selectedSession.id, data })
            } else {
                console.log('Creating new session')
                console.log('Create data:', data)
                await createSession.mutateAsync(data)
            }
            setShowAddEditModal(false)
        } catch (error) {
            console.error('Error saving session:', error)
            console.error('Error response:', error.response)
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteSession.mutateAsync(selectedSession.id)
            setShowDeleteModal(false)
        } catch (error) {
            console.error('Error deleting session:', error)
        }
    }

    const handleSelectSlot = (slotInfo) => {
        // Pre-fill form with selected date/time
        setSelectedSession(null)
        setShowAddEditModal(true)
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-outline px-3 py-2"
                                title="العودة للوحة التحكم"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-3xl font-bold text-text-primary">
                                إدارة الحصص
                                {totalSessions > 0 && (
                                    <span className="text-text-muted text-xl mr-2">({totalSessions})</span>
                                )}
                            </h1>
                        </div>
                        <p className="text-text-muted">جدولة وإدارة الحصص الدراسية</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* View Toggle */}
                        <div className="hidden md:flex gap-2 border border-border rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${viewMode === 'calendar'
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-background'
                                    }`}
                            >
                                <CalendarIcon className="w-4 h-4" />
                                <span className="hidden lg:inline">عرض التقويم</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${viewMode === 'list'
                                    ? 'bg-primary text-white'
                                    : 'hover:bg-background'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                <span className="hidden lg:inline">عرض القائمة</span>
                            </button>
                        </div>

                        {/* Add Session Button */}
                        <button
                            onClick={handleAddSession}
                            className="btn btn-primary"
                        >
                            <Plus className="w-5 h-5" />
                            إضافة حصة جديدة
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <SessionFilters
                onFilterChange={handleFilterChange}
                students={students}
            />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {viewMode === 'calendar' ? (
                    <CalendarView
                        sessions={sessions}
                        loading={isLoading}
                        onSelectEvent={handleViewSession}
                        onSelectSlot={handleSelectSlot}
                    />
                ) : (
                    <ListView
                        sessions={sessions}
                        loading={isLoading}
                        onView={handleViewSession}
                        onEdit={handleEditSession}
                        onDelete={handleDeleteSession}
                        onTakeAttendance={handleTakeAttendance}
                    />
                )}
            </motion.div>

            {/* Modals */}
            <AddEditSessionModal
                isOpen={showAddEditModal}
                onClose={() => setShowAddEditModal(false)}
                onSubmit={handleSubmitSession}
                session={selectedSession}
                students={students}
                loading={createSession.isPending || updateSession.isPending}
            />

            <SessionDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                session={selectedSession}
                onEdit={handleEditSession}
                onDelete={handleDeleteSession}
            />

            <DeleteConfirmation
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                sessionTitle={selectedSession?.title}
                loading={deleteSession.isPending}
            />
        </DashboardLayout>
    )
}

export default Sessions
