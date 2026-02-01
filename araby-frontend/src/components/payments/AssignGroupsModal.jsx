import { X, Search, CheckSquare, Square } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useStudentGroups } from '../../hooks/useStudentGroups'

/**
 * AssignGroupsModal Component
 * Modal for assigning student groups to a fee type
 */
const AssignGroupsModal = ({ isOpen, onClose, onSubmit, feeType, loading }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedGroups, setSelectedGroups] = useState([])
    const [autoAssignToMembers, setAutoAssignToMembers] = useState(false)

    const { data: groupsData, isLoading } = useStudentGroups()
    const groups = groupsData || []

    // Initialize selected groups when modal opens
    useEffect(() => {
        if (isOpen && feeType?.assignedGroups) {
            setSelectedGroups(feeType.assignedGroups.map(g => g.id))
        } else if (isOpen) {
            setSelectedGroups([])
        }
        // Default to true for better UX
        setAutoAssignToMembers(true)
    }, [isOpen, feeType])

    // Filter groups based on search
    const filteredGroups = groups.filter(group =>
        group?.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Toggle group selection
    const toggleGroup = (groupId) => {
        setSelectedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        )
    }

    // Select all filtered groups
    const selectAll = () => {
        const allIds = filteredGroups.map(g => g.id)
        setSelectedGroups(allIds)
    }

    // Deselect all
    const selectNone = () => {
        setSelectedGroups([])
    }

    // Handle submit
    const handleSubmit = () => {
        onSubmit({ groupIds: selectedGroups, autoAssignToMembers })
    }

    // Reset on close
    const handleClose = () => {
        setSearchTerm('')
        setSelectedGroups([])
        setAutoAssignToMembers(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                تعيين المجموعات
                            </h2>
                            {feeType && (
                                <p className="text-sm text-gray-500 mt-1">
                                    نوع الرسوم: {feeType.name}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Search and Actions */}
                    <div className="p-6 border-b border-gray-200 space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث عن مجموعة..."
                                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Select All/None */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                {selectedGroups.length} من {filteredGroups.length} محدد
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={selectAll}
                                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    تحديد الكل
                                </button>
                                <button
                                    onClick={selectNone}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    إلغاء التحديد
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Groups List */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : filteredGroups.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    {searchTerm ? 'لا توجد مجموعات مطابقة' : 'لا توجد مجموعات'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredGroups.map((group) => {
                                    const isSelected = selectedGroups.includes(group.id)
                                    return (
                                        <motion.button
                                            key={group.id}
                                            onClick={() => toggleGroup(group.id)}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${isSelected
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }`}
                                        >
                                            {isSelected ? (
                                                <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            ) : (
                                                <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 text-right">
                                                <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'
                                                    }`}>
                                                    {group.groupName}
                                                </h3>
                                                {group.description && (
                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                        {group.description}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {group.membersCount || 0} طالب
                                                </p>
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Auto-assign Option */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoAssignToMembers}
                                onChange={(e) => setAutoAssignToMembers(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-900">
                                    تعيين الرسوم للأعضاء الحاليين
                                </span>
                                <p className="text-xs text-gray-500">
                                    عند التفعيل، سيتم إنشاء سجلات دفع تلقائياً لجميع الطلاب في المجموعات المحددة
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-gray-200">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default AssignGroupsModal
