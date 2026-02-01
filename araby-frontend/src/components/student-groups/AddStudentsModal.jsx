import { useState, useEffect } from 'react'
import { X, Search, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { Avatar } from '../common'
import { filterAvailableStudents } from '../../utils/groupHelpers'

/**
 * AddStudentsModal Component
 * Modal for adding students to a group
 */
const AddStudentsModal = ({ isOpen, onClose, groupId, currentMembers = [], allStudents = [], onSubmit, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([])

    // Get available students (not in group)
    const availableStudents = filterAvailableStudents(allStudents, currentMembers)

    // Filter by search term
    const filteredStudents = availableStudents.filter(student =>
        student.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Reset selection when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedStudents([])
            setSearchTerm('')
        }
    }, [isOpen])

    const toggleStudent = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        )
    }

    const toggleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([])
        } else {
            setSelectedStudents(filteredStudents.map(s => s.id))
        }
    }

    const handleSubmit = () => {
        if (selectedStudents.length > 0) {
            onSubmit(selectedStudents)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="bg-gradient-to-l from-primary to-primary-dark p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">إضافة طلاب للمجموعة</h2>
                                        <p className="text-sm text-white/80 mt-1">
                                            {selectedStudents.length} طالب محدد
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="relative">
                                    <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="ابحث عن طالب..."
                                        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                {/* Select All */}
                                {filteredStudents.length > 0 && (
                                    <div className="mt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                                                onChange={toggleSelectAll}
                                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                تحديد الكل ({filteredStudents.length})
                                            </span>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Students List */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {filteredStudents.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="bg-gray-100 rounded-full p-6 w-fit mx-auto mb-4">
                                            <Users className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            {searchTerm ? 'لا توجد نتائج' : 'لا يوجد طلاب متاحين'}
                                        </h4>
                                        <p className="text-gray-600">
                                            {searchTerm ? 'جرب البحث بكلمات أخرى' : 'جميع الطلاب موجودون في المجموعة'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredStudents.map((student) => (
                                            <motion.label
                                                key={student.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedStudents.includes(student.id)
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={() => toggleStudent(student.id)}
                                                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                                />
                                                <Avatar name={student.fullName} size="sm" />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {student.fullName}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {student.academicLevel || 'غير محدد'}
                                                    </p>
                                                </div>
                                            </motion.label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-200">
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={selectedStudents.length === 0 || isLoading}
                                        className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'جاري الإضافة...' : `إضافة (${selectedStudents.length})`}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

AddStudentsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    groupId: PropTypes.number.isRequired,
    currentMembers: PropTypes.array,
    allStudents: PropTypes.array,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

export default AddStudentsModal
