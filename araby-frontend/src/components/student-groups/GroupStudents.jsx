import { useState } from 'react'
import { Search, UserPlus, Trash2, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { Avatar } from '../common'

/**
 * GroupStudents Component
 * Displays and manages students in a group
 */
const GroupStudents = ({ groupId, students = [], onAddStudents, onRemoveStudent, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('name')

    // Filter students by search term
    const filteredStudents = students.filter(student =>
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort students
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        if (sortBy === 'name') {
            return (a.fullName || '').localeCompare(b.fullName || '', 'ar')
        } else if (sortBy === 'joinDate') {
            return new Date(b.joinedAt || 0) - new Date(a.joinedAt || 0)
        }
        return 0
    })

    const handleRemove = (student) => {
        if (window.confirm(`هل تريد إزالة ${student.fullName} من المجموعة؟`)) {
            onRemoveStudent(student.studentId || student.id)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        الطلاب ({students.length})
                    </h3>
                    <p className="text-sm text-gray-600">
                        إدارة طلاب المجموعة
                    </p>
                </div>
                <button
                    onClick={onAddStudents}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                    <UserPlus className="w-5 h-5" />
                    إضافة طلاب
                </button>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ابحث عن طالب..."
                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    <option value="name">الترتيب: الاسم</option>
                    <option value="joinDate">الترتيب: تاريخ الانضمام</option>
                </select>
            </div>

            {/* Students List */}
            {sortedStudents.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="bg-gray-100 rounded-full p-6 w-fit mx-auto mb-4">
                        <UserPlus className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'لا توجد نتائج' : 'لا يوجد طلاب في هذه المجموعة'}
                    </h4>
                    <p className="text-gray-600">
                        {searchTerm ? 'جرب البحث بكلمات أخرى' : 'ابدأ بإضافة طلاب للمجموعة'}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedStudents.map((student, index) => (
                        <motion.div
                            key={student.studentId || student.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar
                                    name={student.fullName}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">
                                        {student.fullName}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {student.academicLevel || 'غير محدد'}
                                    </p>
                                    {student.joinedAt && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                انضم: {new Date(student.joinedAt).toLocaleDateString('ar-EG')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleRemove(student)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                    title="إزالة من المجموعة"
                                >
                                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

GroupStudents.propTypes = {
    groupId: PropTypes.number.isRequired,
    students: PropTypes.array,
    onAddStudents: PropTypes.func.isRequired,
    onRemoveStudent: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

export default GroupStudents
