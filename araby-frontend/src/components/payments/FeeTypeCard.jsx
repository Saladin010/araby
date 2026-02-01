import { DollarSign, Calendar, Users, Edit, Trash2, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * FeeTypeCard Component
 * Displays fee type information in a card
 */
const FeeTypeCard = ({ feeType, onEdit, onDelete, onAssignGroups, index = 0 }) => {
    const frequencyLabels = {
        1: 'شهري',
        2: 'أسبوعي',
        3: 'سنوي',
        4: 'لمرة واحدة'
    }

    const frequencyColors = {
        1: 'bg-blue-100 text-blue-800',
        2: 'bg-green-100 text-green-800',
        3: 'bg-purple-100 text-purple-800',
        4: 'bg-yellow-100 text-yellow-800'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-200 ${!feeType.isActive ? 'opacity-60' : ''
                }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feeType.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${feeType.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {feeType.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="space-y-3 mb-4">
                {/* Amount */}
                <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">المبلغ:</span>
                    <span className="font-bold text-green-600 text-lg">
                        {feeType.amount.toLocaleString('ar-EG')} ج.م
                    </span>
                </div>

                {/* Frequency */}
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">التكرار:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${frequencyColors[feeType.frequency]}`}>
                        {frequencyLabels[feeType.frequency]}
                    </span>
                </div>

                {/* Groups */}
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600">المجموعات:</span>
                    <span className="font-semibold text-gray-900">
                        {feeType.applicableGroupIds?.length > 0
                            ? `${feeType.applicableGroupIds.length} مجموعات`
                            : 'الكل'
                        }
                    </span>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                    onClick={() => onEdit(feeType)}
                    className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    title="تعديل"
                >
                    <Edit className="w-4 h-4" />
                    تعديل
                </button>
                <button
                    onClick={() => onAssignGroups(feeType)}
                    className="flex-1 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    title="ربط مجموعات"
                >
                    <UserPlus className="w-4 h-4" />
                    مجموعات
                </button>
                <button
                    onClick={() => onDelete(feeType)}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    title="حذف"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    )
}

export default FeeTypeCard
