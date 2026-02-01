import { useState } from 'react'
import { X, Users, DollarSign, BarChart3, Edit2, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { useStudentGroup, useGroupStatistics } from '../../hooks/useStudentGroups'
import { useStudents } from '../../hooks/useStudents'
import GroupStudents from './GroupStudents'
import GroupFeeTypes from './GroupFeeTypes'
import GroupStatistics from './GroupStatistics'
import AddStudentsModal from './AddStudentsModal'
import { useAddStudentsToGroup, useRemoveStudentFromGroup } from '../../hooks/useStudentGroups'

/**
 * GroupDetailsModal Component
 * Full group details with tabs for students, fee types, and statistics
 */
const GroupDetailsModal = ({ isOpen, onClose, groupId, onEdit, onDelete }) => {
    const [activeTab, setActiveTab] = useState('students')
    const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false)

    // Fetch group details
    const { data: group, isLoading: groupLoading } = useStudentGroup(groupId, {
        enabled: isOpen && !!groupId
    })

    // Fetch group statistics
    const { data: stats, isLoading: statsLoading } = useGroupStatistics(groupId, {
        enabled: isOpen && !!groupId && activeTab === 'statistics'
    })

    // Fetch all students for adding
    const { data: allStudentsData } = useStudents()
    const allStudents = allStudentsData || []

    // Mutations
    const addStudents = useAddStudentsToGroup()
    const removeStudent = useRemoveStudentFromGroup()

    const tabs = [
        { id: 'students', label: 'الطلاب', icon: Users },
        { id: 'fees', label: 'المصروفات', icon: DollarSign },
        { id: 'statistics', label: 'الإحصائيات', icon: BarChart3 }
    ]

    const handleAddStudents = (studentIds) => {
        addStudents.mutate(
            { groupId, studentIds },
            {
                onSuccess: () => {
                    setIsAddStudentsOpen(false)
                }
            }
        )
    }

    const handleRemoveStudent = (studentId) => {
        removeStudent.mutate({ groupId, studentId })
    }

    const handleEdit = () => {
        onEdit(group)
        onClose()
    }

    const handleDelete = () => {
        if (window.confirm(`هل أنت متأكد من حذف المجموعة "${group?.groupName}"؟\n\nسيتم إزالة الطلاب من المجموعة ولكن لن يتم حذف بياناتهم.`)) {
            onDelete(group)
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <>
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
                                {/* Header */}
                                <div className="bg-gradient-to-l from-primary to-primary-dark p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 p-3 rounded-lg">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">
                                                    {group?.groupName || 'تفاصيل المجموعة'}
                                                </h2>
                                                {group?.description && (
                                                    <p className="text-sm text-white/80 mt-1">
                                                        {group.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={handleEdit}
                                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={handleDelete}
                                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={onClose}
                                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-200 bg-gray-50">
                                    <div className="flex gap-1 px-6">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon
                                            return (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${activeTab === tab.id
                                                        ? 'text-primary bg-white'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    {tab.label}
                                                    {activeTab === tab.id && (
                                                        <motion.div
                                                            layoutId="activeTab"
                                                            className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary"
                                                        />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {groupLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                        </div>
                                    ) : (
                                        <>
                                            {activeTab === 'students' && (
                                                <GroupStudents
                                                    groupId={groupId}
                                                    students={group?.members || []}
                                                    onAddStudents={() => setIsAddStudentsOpen(true)}
                                                    onRemoveStudent={handleRemoveStudent}
                                                    isLoading={groupLoading}
                                                />
                                            )}

                                            {activeTab === 'fees' && (
                                                <GroupFeeTypes
                                                    feeTypes={group?.applicableFees || []}
                                                    isLoading={groupLoading}
                                                />
                                            )}

                                            {activeTab === 'statistics' && (
                                                <GroupStatistics
                                                    group={group}
                                                    stats={stats}
                                                    isLoading={groupLoading || statsLoading}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Students Modal */}
            <AddStudentsModal
                isOpen={isAddStudentsOpen}
                onClose={() => setIsAddStudentsOpen(false)}
                groupId={groupId}
                currentMembers={group?.members || []}
                allStudents={allStudents}
                onSubmit={handleAddStudents}
                isLoading={addStudents.isPending}
            />
        </>
    )
}

GroupDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    groupId: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
}

export default GroupDetailsModal
