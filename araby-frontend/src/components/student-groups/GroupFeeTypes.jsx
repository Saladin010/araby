import { DollarSign, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * GroupFeeTypes Component
 * Displays fee types associated with a group (read-only)
 */
const GroupFeeTypes = ({ feeTypes = [], isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (!feeTypes || feeTypes.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <div className="bg-gray-100 rounded-full p-6 w-fit mx-auto mb-4">
                    <DollarSign className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد مصروفات مرتبطة
                </h4>
                <p className="text-gray-600 max-w-md mx-auto">
                    لم يتم ربط أي مصروفات بهذه المجموعة بعد. يمكن ربط المصروفات من صفحة أنواع المصروفات.
                </p>
            </motion.div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                    المصروفات المرتبطة ({feeTypes.length})
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feeTypes.map((feeType, index) => (
                    <motion.div
                        key={feeType.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 border border-gray-100"
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                    {feeType.name}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="font-bold text-green-600">
                                        {feeType.amount?.toLocaleString('ar-EG')} جنيه
                                    </span>
                                    {feeType.frequency && (
                                        <>
                                            <span>•</span>
                                            <span>{feeType.frequency}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                            ملاحظة
                        </h4>
                        <p className="text-sm text-blue-800">
                            يتم إدارة المصروفات من صفحة "أنواع المصروفات". هذا العرض للقراءة فقط.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

GroupFeeTypes.propTypes = {
    feeTypes: PropTypes.array,
    isLoading: PropTypes.bool
}

export default GroupFeeTypes
