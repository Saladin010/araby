import { Users, Edit2, Trash2, Eye, Calendar, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { getStudentRangeLabel } from '../../utils/groupHelpers'

/**
 * GroupCard Component
 * Displays a single group in card format with color coding
 */
const GroupCard = ({ group, colors, onEdit, onDelete, onView, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-r-4 ${colors.border} group`}
        >
            {/* Header */}
            <div className={`${colors.bg} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                    <div className={`p-3 bg-white rounded-lg ${colors.ring} ring-2`}>
                        <Users className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${colors.text}`}>
                            {group.groupName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {getStudentRangeLabel(group.membersCount || 0)}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(group)}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                            title="تعديل"
                        >
                            <Edit2 className="w-4 h-4 text-gray-700" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(group)}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                            title="حذف"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                {/* Description */}
                {group.description && (
                    <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {group.description}
                        </p>
                    </div>
                )}

                {/* Created Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {new Date(group.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                            {group.membersCount || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 pb-4">
                <button
                    onClick={() => onView(group)}
                    className={`w-full py-2 px-4 ${colors.bg} ${colors.text} rounded-lg hover:opacity-80 transition-all flex items-center justify-center gap-2 font-medium`}
                >
                    <Eye className="w-4 h-4" />
                    عرض التفاصيل
                </button>
            </div>
        </motion.div>
    )
}

GroupCard.propTypes = {
    group: PropTypes.object.isRequired,
    colors: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onView: PropTypes.func.isRequired,
    index: PropTypes.number
}

export default GroupCard
