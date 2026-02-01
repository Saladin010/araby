import { useState } from 'react'
import { Plus, History, TrendingUp, BarChart3, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/layout'
import {
    AddGradeForm,
    GradesTable,
    GradeDetailsModal,
    StudentPerformance,
    GradeStatistics
} from '../components/grades'
import { useStudents } from '../hooks/useStudents'
import { useAllGrades, useDeleteGrade } from '../hooks/useGrades'
import { filterGradesByRange, getGradeRangeFilters } from '../utils/gradeHelpers'
import { useAuth } from '../hooks/useAuth'

/**
 * Grades Page - Comprehensive grades management
 */
const Grades = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('add')
    const [selectedGrade, setSelectedGrade] = useState(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

    // Filters for history tab
    const [selectedStudent, setSelectedStudent] = useState('')
    const [gradeRange, setGradeRange] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch data
    const { data: studentsData } = useStudents()
    const students = studentsData || []

    // Fetch all grades using the new hook
    const { data: allGradesData } = useAllGrades()
    const allGrades = allGradesData || []

    // Delete grade mutation
    const deleteGrade = useDeleteGrade()

    // Filter grades based on filters
    const filteredGrades = allGrades.filter(grade => {
        // Student filter
        if (selectedStudent && grade.studentId !== selectedStudent) return false

        // Search filter
        if (searchTerm && !grade.examName?.toLowerCase().includes(searchTerm.toLowerCase())) return false

        return true
    })

    // Apply range filter
    const rangeFilteredGrades = filterGradesByRange(filteredGrades, gradeRange)

    // Handle view grade details
    const handleViewGrade = (grade) => {
        setSelectedGrade(grade)
        setIsDetailsModalOpen(true)
    }

    // Handle delete grade
    const handleDeleteGrade = async (grade) => {
        if (window.confirm(`هل أنت متأكد من حذف درجة "${grade.examName}" للطالب ${grade.studentName}؟`)) {
            await deleteGrade.mutateAsync(grade.id)
        }
    }

    // Reset filters
    const resetFilters = () => {
        setSelectedStudent('')
        setGradeRange('all')
        setSearchTerm('')
    }

    // Check if user is teacher or assistant
    const isTeacherOrAssistant = user?.role === 1 || user?.role === 2 || user?.role === 'Teacher' || user?.role === 'Assistant'

    // Tabs configuration
    const tabs = [
        {
            id: 'add',
            label: 'إضافة درجات',
            icon: Plus,
            show: isTeacherOrAssistant
        },
        {
            id: 'history',
            label: 'سجل الدرجات',
            icon: History,
            show: true
        },
        {
            id: 'performance',
            label: 'أداء الطلاب',
            icon: TrendingUp,
            show: true
        },
        {
            id: 'statistics',
            label: 'الإحصائيات',
            icon: BarChart3,
            show: isTeacherOrAssistant
        }
    ].filter(tab => tab.show)

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">إدارة الدرجات</h1>
                        <p className="text-gray-600 mt-1">الرئيسية &gt; إدارة الدرجات</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            {tabs.map(tab => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Add Grades Tab */}
                        {activeTab === 'add' && (
                            <motion.div
                                key="add"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <AddGradeForm onSuccess={() => setActiveTab('history')} />
                            </motion.div>
                        )}

                        {/* History Tab */}
                        {activeTab === 'history' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Filters */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Filter className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-semibold text-gray-900">فلترة النتائج</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Student Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                الطالب
                                            </label>
                                            <select
                                                value={selectedStudent}
                                                onChange={(e) => setSelectedStudent(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">الكل</option>
                                                {students.map(student => (
                                                    <option key={student.id} value={student.id}>
                                                        {student.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Range Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                النطاق
                                            </label>
                                            <select
                                                value={gradeRange}
                                                onChange={(e) => setGradeRange(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {getGradeRangeFilters().map(filter => (
                                                    <option key={filter.value} value={filter.value}>
                                                        {filter.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Search */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                بحث في الامتحانات
                                            </label>
                                            <div className="relative">
                                                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    placeholder="اسم الامتحان..."
                                                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            إعادة تعيين
                                        </button>
                                    </div>
                                </div>

                                {/* Grades Table */}
                                <GradesTable
                                    grades={rangeFilteredGrades}
                                    onView={handleViewGrade}
                                    onEdit={isTeacherOrAssistant ? handleViewGrade : null}
                                    onDelete={isTeacherOrAssistant ? handleDeleteGrade : null}
                                />
                            </motion.div>
                        )}

                        {/* Performance Tab */}
                        {activeTab === 'performance' && (
                            <motion.div
                                key="performance"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <StudentPerformance />
                            </motion.div>
                        )}

                        {/* Statistics Tab */}
                        {activeTab === 'statistics' && (
                            <motion.div
                                key="statistics"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <GradeStatistics />
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grade Details Modal */}
            <GradeDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false)
                    setSelectedGrade(null)
                }}
                grade={selectedGrade}
                onEdit={isTeacherOrAssistant ? (grade) => {
                    // TODO: Implement edit functionality
                    console.log('Edit grade:', grade)
                } : null}
                onDelete={isTeacherOrAssistant ? handleDeleteGrade : null}
            />
        </DashboardLayout>
    )
}

export default Grades
