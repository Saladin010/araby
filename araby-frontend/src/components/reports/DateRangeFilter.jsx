import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { datePresets, getPresetLabel, calculateDateRange } from '../../utils/dateHelpers'

/**
 * DateRangeFilter Component
 * Date range selector with presets
 */
const DateRangeFilter = ({ onApply, initialFrom, initialTo }) => {
    const [selectedPreset, setSelectedPreset] = useState(datePresets.THIS_MONTH)
    const [fromDate, setFromDate] = useState(initialFrom || '')
    const [toDate, setToDate] = useState(initialTo || '')
    const [showPresets, setShowPresets] = useState(false)

    const presetOptions = [
        datePresets.THIS_WEEK,
        datePresets.THIS_MONTH,
        datePresets.LAST_3_MONTHS,
        datePresets.LAST_6_MONTHS,
        datePresets.THIS_YEAR,
        datePresets.CUSTOM
    ]

    const handlePresetSelect = (preset) => {
        setSelectedPreset(preset)
        setShowPresets(false)

        if (preset !== datePresets.CUSTOM) {
            const range = calculateDateRange(preset)
            setFromDate(range.from.toISOString().split('T')[0])
            setToDate(range.to.toISOString().split('T')[0])
        }
    }

    const handleApply = () => {
        if (fromDate && toDate) {
            onApply({ from: fromDate, to: toDate, preset: selectedPreset })
        }
    }

    return (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-gray-900">الفترة الزمنية</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Preset Selector */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        اختيار سريع
                    </label>
                    <button
                        onClick={() => setShowPresets(!showPresets)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-right flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                        <span>{getPresetLabel(selectedPreset)}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showPresets && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                            >
                                {presetOptions.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => handlePresetSelect(preset)}
                                        className={`w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors ${selectedPreset === preset ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'
                                            }`}
                                    >
                                        {getPresetLabel(preset)}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* From Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        من تاريخ
                    </label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                            setFromDate(e.target.value)
                            setSelectedPreset(datePresets.CUSTOM)
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                {/* To Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        إلى تاريخ
                    </label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                            setToDate(e.target.value)
                            setSelectedPreset(datePresets.CUSTOM)
                        }}
                        min={fromDate}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            {/* Apply Button */}
            <div className="mt-4">
                <button
                    onClick={handleApply}
                    disabled={!fromDate || !toDate}
                    className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    تطبيق الفترة
                </button>
            </div>
        </div>
    )
}

DateRangeFilter.propTypes = {
    onApply: PropTypes.func.isRequired,
    initialFrom: PropTypes.string,
    initialTo: PropTypes.string
}

export default DateRangeFilter
