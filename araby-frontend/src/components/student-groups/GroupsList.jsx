import { Grid3x3, List, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import GroupCard from './GroupCard'
import { formatGroupData } from '../../utils/groupHelpers'

/**
 * GroupsList Component
 * Displays groups in grid or list view
 */
const GroupsList = ({ groups, view = 'grid', onEdit, onDelete, onView, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (!groups || groups.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 px-4"
            >
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <Users className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    لا توجد مجموعات
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                    لم يتم إنشاء أي مجموعات بعد. ابدأ بإنشاء مجموعة جديدة لتنظيم الطلاب.
                </p>
            </motion.div>
        )
    }

    // Grid View
    if (view === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group, index) => {
                    const formattedGroup = formatGroupData(group, index)
                    return (
                        <GroupCard
                            key={group.id}
                            group={formattedGroup}
                            colors={formattedGroup.colors}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onView={onView}
                            index={index}
                        />
                    )
                })}
            </div>
        )
    }

    // List View
    return (
        <div className="space-y-4">
            {groups.map((group, index) => {
                const formattedGroup = formatGroupData(group, index)
                return (
                    <motion.div
                        key={group.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 flex items-center justify-between border-r-4 ${formattedGroup.colors.border}`}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`p-3 ${formattedGroup.colors.bg} rounded-lg`}>
                                <Users className={`w-6 h-6 ${formattedGroup.colors.text}`} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {group.groupName}
                                </h3>
                                {group.description && (
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                        {group.description}
                                    </p>
                                )}
                            </div>
                            <div className="text-center px-4">
                                <p className="text-2xl font-bold text-gray-900">
                                    {group.membersCount || 0}
                                </p>
                                <p className="text-xs text-gray-500">طالب</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onView(group)}
                                className={`px-4 py-2 ${formattedGroup.colors.bg} ${formattedGroup.colors.text} rounded-lg hover:opacity-80 transition-all font-medium`}
                            >
                                عرض
                            </button>
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(group)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="تعديل"
                                >
                                    <Grid3x3 className="w-5 h-5 text-gray-600" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(group)}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="حذف"
                                >
                                    <List className="w-5 h-5 text-red-600" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

GroupsList.propTypes = {
    groups: PropTypes.array,
    view: PropTypes.oneOf(['grid', 'list']),
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onView: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

export default GroupsList
