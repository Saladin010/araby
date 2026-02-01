import { DollarSign, Calendar, TrendingUp, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * ReportTypeSelector Component
 * Large cards for selecting report type
 */
const ReportTypeSelector = ({ onSelect, selectedType }) => {
    const reportTypes = [
        {
            id: 'financial',
            title: 'التقرير المالي',
            description: 'إيرادات، مدفوعات، متأخرات',
            icon: DollarSign,
            badge: 'شهري',
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            id: 'attendance',
            title: 'تقرير الحضور',
            description: 'ملخص الحضور والغياب',
            icon: Calendar,
            badge: 'عام',
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            id: 'performance',
            title: 'تقرير الأداء الأكاديمي',
            description: 'درجات ومتوسطات الطلاب',
            icon: TrendingUp,
            badge: 'تفصيلي',
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            id: 'defaulters',
            title: 'تقرير المتأخرات',
            description: 'الطلاب المتأخرين في الدفع',
            icon: AlertTriangle,
            badge: 'هام',
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((type) => {
                const Icon = type.icon
                const isSelected = selectedType === type.id

                return (
                    <motion.button
                        key={type.id}
                        onClick={() => onSelect(type.id)}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-6 rounded-2xl text-right transition-all ${isSelected
                                ? 'ring-4 ring-primary/30 shadow-xl'
                                : 'hover:shadow-lg'
                            } bg-white border-2 ${isSelected ? 'border-primary' : 'border-gray-200'
                            }`}
                    >
                        {/* Badge */}
                        <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${type.color} text-white`}>
                                {type.badge}
                            </span>
                        </div>

                        {/* Icon */}
                        <div className={`inline-flex p-4 rounded-xl ${type.bgColor} mb-4`}>
                            <Icon className={`w-8 h-8 ${type.iconColor}`} />
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {type.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {type.description}
                        </p>

                        {/* Selection Indicator */}
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                        )}
                    </motion.button>
                )
            })}
        </div>
    )
}

ReportTypeSelector.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selectedType: PropTypes.string
}

export default ReportTypeSelector
