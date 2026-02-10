import { useState } from 'react'
import { UserPlus, Grid, List, Filter, ArrowLeft, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/common/SearchBar'
import Pagination from '../components/common/Pagination'
import { downloadMultipleQRCodes } from '../utils/qrBulkDownload'
import {
    StudentTable,
    StudentCard,
    AddEditStudentModal,
    StudentDetailsModal,
    DeleteConfirmation,
    ShowPasswordModal,
} from '../components/students'
import StudentQRModal from '../components/students/StudentQRModal'
import {
    useAllUsers,
    useStudents,
    useCreateStudent,
    useCreateAssistant,
    useUpdateStudent,
    useDeleteStudent,
    useToggleStudentStatus,
} from '../hooks/useStudents'
import { EmptyState } from '../components/dashboard'
import { Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

/**
 * Students Page - Main students management page
 */
const Students = () => {
    const navigate = useNavigate()

    // View mode state
    const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [levelFilter, setLevelFilter] = useState('all')
    const [roleFilter, setRoleFilter] = useState('all') // New: Role filter

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    // Modal state
    const [showAddEditModal, setShowAddEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showQRModal, setShowQRModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [studentPassword, setStudentPassword] = useState('')

    // Multi-select state for bulk QR download
    const [selectedStudents, setSelectedStudents] = useState([])
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 })


    // Get current user
    const { user } = useAuth()

    // Build filters object
    const filters = {
        search: searchQuery,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        academicLevel: levelFilter !== 'all' ? levelFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
    }

    // Fetch all users (students + assistants) - pass user role
    const { data: allUsersData, isLoading } = useAllUsers(roleFilter, user?.role)

    // Apply client-side filters
    let filteredUsers = Array.isArray(allUsersData) ? allUsersData : []

    // Filter by search query
    if (searchQuery) {
        filteredUsers = filteredUsers.filter(user =>
            user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phoneNumber?.includes(searchQuery) ||
            (user.studentNumber && user.studentNumber.toString().includes(searchQuery))
        )
    }

    // Filter by status
    if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user =>
            statusFilter === 'active' ? user.isActive : !user.isActive
        )
    }

    // Filter by academic level (only for students)
    if (levelFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user =>
            user.academicLevel === levelFilter
        )
    }

    const students = filteredUsers
    const totalStudents = students.length
    const totalPages = Math.ceil(totalStudents / itemsPerPage)


    // Mutations
    const createStudent = useCreateStudent()
    const createAssistant = useCreateAssistant()
    const updateStudent = useUpdateStudent()
    const deleteStudent = useDeleteStudent()
    const toggleStatus = useToggleStudentStatus()

    // Handlers
    const handleAddStudent = () => {
        setSelectedStudent(null)
        setShowAddEditModal(true)
    }

    const handleEditStudent = (student) => {
        setSelectedStudent(student)
        setShowAddEditModal(true)
    }

    const handleViewStudent = (student) => {
        setSelectedStudent(student)
        setShowDetailsModal(true)
    }

    const handleDeleteStudent = (student) => {
        setSelectedStudent(student)
        setShowDeleteModal(true)
    }

    const handleToggleStatus = async (student) => {
        await toggleStatus.mutateAsync(student.id)
    }

    const handleShowPassword = (student) => {
        setSelectedStudent(student)
        setShowPasswordModal(true)
    }

    const handleShowQR = (student) => {
        setSelectedStudent(student)
        setShowQRModal(true)
    }

    // Multi-select handlers
    const handleSelectStudent = (studentId, checked) => {
        setSelectedStudents(prev =>
            checked
                ? [...prev, studentId]
                : prev.filter(id => id !== studentId)
        )
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            // Select all students that have student numbers
            const allStudentIds = students
                .filter(s => s.studentNumber)
                .map(s => s.id)
            setSelectedStudents(allStudentIds)
        } else {
            setSelectedStudents([])
        }
    }

    // Bulk QR download handler
    const handleBulkDownloadQR = async () => {
        if (selectedStudents.length === 0) {
            alert('يرجى تحديد طلاب على الأقل')
            return
        }

        setIsDownloading(true)
        setDownloadProgress({ current: 0, total: selectedStudents.length })

        try {
            const selectedStudentsData = students.filter(s => selectedStudents.includes(s.id))

            await downloadMultipleQRCodes(
                selectedStudentsData,
                (current, total) => {
                    setDownloadProgress({ current, total })
                }
            )

            // Clear selection after successful download
            setSelectedStudents([])
            alert(`تم تحميل ${selectedStudentsData.length} رمز QR بنجاح!`)
        } catch (error) {
            console.error('Error downloading QR codes:', error)
            alert('حدث خطأ أثناء تحميل رموز QR. يرجى المحاولة مرة أخرى.')
        } finally {
            setIsDownloading(false)
            setDownloadProgress({ current: 0, total: 0 })
        }
    }

    const handleSubmitStudent = async (data) => {
        try {
            if (selectedStudent) {
                // Update existing user
                await updateStudent.mutateAsync({ id: selectedStudent.id, data })
            } else {
                // Create new user - check role
                if (data.role === 'Assistant') {
                    // Remove academicLevel for assistants
                    const { academicLevel, role, ...assistantData } = data
                    await createAssistant.mutateAsync(assistantData)
                } else {
                    // Create student
                    const { role, ...studentData } = data
                    await createStudent.mutateAsync(studentData)
                }
            }
            setShowAddEditModal(false)
        } catch (error) {
            console.error('Error saving student:', error)
        }
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteStudent.mutateAsync(selectedStudent.id)
            setShowDeleteModal(false)
        } catch (error) {
            console.error('Error deleting student:', error)
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleItemsPerPageChange = (items) => {
        setItemsPerPage(items)
        setCurrentPage(1)
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container-custom py-8">
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
                                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                                    إدارة الطلاب
                                    {totalStudents > 0 && (
                                        <span className="text-text-muted text-lg sm:text-xl mr-2">({totalStudents})</span>
                                    )}
                                </h1>
                            </div>
                            <p className="text-text-muted text-sm sm:text-base">إدارة وتتبع بيانات الطلاب والمساعدين</p>
                        </div>
                        <div className="flex gap-2">
                            {selectedStudents.length > 0 && (
                                <button
                                    onClick={handleBulkDownloadQR}
                                    className="btn btn-success"
                                    disabled={isDownloading}
                                >
                                    <Download className="w-5 h-5" />
                                    {isDownloading
                                        ? `جاري التحميل... (${downloadProgress.current}/${downloadProgress.total})`
                                        : `تحميل QR (${selectedStudents.length})`
                                    }
                                </button>
                            )}
                            <button onClick={handleAddStudent} className="btn btn-primary w-full sm:w-auto">
                                <UserPlus className="w-5 h-5" />
                                <span className="hidden sm:inline">إضافة مستخدم جديد</span>
                                <span className="sm:hidden">إضافة مستخدم</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card mb-6"
                >
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="ابحث عن طالب بالاسم، الرقم التعريفي، أو رقم الهاتف..."
                        />

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="input flex-1 sm:flex-none sm:min-w-[140px]"
                            >
                                <option value="all">كل الحالات</option>
                                <option value="active">نشط</option>
                                <option value="inactive">غير نشط</option>
                            </select>

                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="input flex-1 sm:flex-none sm:min-w-[140px]"
                            >
                                <option value="all">الكل</option>
                                <option value="student">طلاب</option>
                                {/* Only show Assistant filter for Teachers */}
                                {user?.role === 1 && (
                                    <option value="assistant">مساعدين</option>
                                )}
                            </select>

                            {/* Level Filter */}
                            <select
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                                className="input flex-1 sm:flex-none sm:min-w-[180px]"
                            >
                                <option value="all">كل المستويات</option>
                                <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                                <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                                <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                            </select>

                            {/* View Toggle */}
                            <div className="hidden md:flex gap-2 border border-border rounded-lg p-1 sm:mr-auto">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'table' ? 'bg-primary text-white' : 'hover:bg-background'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-background'
                                        }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Students Display */}
                {students.length === 0 && !isLoading ? (
                    <EmptyState
                        icon={Users}
                        title="لا يوجد طلاب"
                        description="لم يتم العثور على أي طلاب. ابدأ بإضافة طالب جديد"
                        action={
                            <button onClick={handleAddStudent} className="btn btn-primary">
                                <UserPlus className="w-5 h-5" />
                                إضافة طالب جديد
                            </button>
                        }
                    />
                ) : viewMode === 'table' ? (
                    <StudentTable
                        students={students}
                        onView={handleViewStudent}
                        onEdit={handleEditStudent}
                        onDelete={handleDeleteStudent}
                        onToggleStatus={handleToggleStatus}
                        onShowPassword={handleShowPassword}
                        onShowQR={handleShowQR}
                        loading={isLoading}
                        selectedStudents={selectedStudents}
                        onSelectStudent={handleSelectStudent}
                        onSelectAll={handleSelectAll}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {students.map((student, index) => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onView={handleViewStudent}
                                onEdit={handleEditStudent}
                                onDelete={handleDeleteStudent}
                                onToggleStatus={handleToggleStatus}
                                onShowPassword={handleShowPassword}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalStudents}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}

                {/* Modals */}
                <AddEditStudentModal
                    isOpen={showAddEditModal}
                    onClose={() => setShowAddEditModal(false)}
                    onSubmit={handleSubmitStudent}
                    student={selectedStudent}
                    loading={createStudent.isPending || updateStudent.isPending}
                />

                <DeleteConfirmation
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                    studentName={selectedStudent?.fullName}
                    loading={deleteStudent.isPending}
                />

                {/* Show Password Modal */}
                <ShowPasswordModal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    student={selectedStudent}
                    password={studentPassword}
                />

                {/* Student Details Modal */}
                <StudentDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    student={selectedStudent}
                />

                {/* Student QR Modal */}
                <StudentQRModal
                    isOpen={showQRModal}
                    onClose={() => setShowQRModal(false)}
                    student={selectedStudent}
                />
            </div>
        </div>
    )
}

export default Students
