import { useState } from 'react'
import { FileText, Download, Printer, FileSpreadsheet, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * ExportButton Component
 * Dropdown button for exporting reports (PDF, Excel, Print)
 */
const ExportButton = ({ onExportPDF, onExportExcel, onPrint, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false)

    const exportOptions = [
        {
            id: 'pdf',
            label: 'تصدير PDF',
            icon: FileText,
            color: 'text-red-600',
            onClick: onExportPDF
        },
        {
            id: 'excel',
            label: 'تصدير Excel',
            icon: FileSpreadsheet,
            color: 'text-green-600',
            onClick: onExportExcel
        },
        {
            id: 'print',
            label: 'طباعة',
            icon: Printer,
            color: 'text-blue-600',
            onClick: onPrint
        }
    ]

    const handleOptionClick = (option) => {
        setIsOpen(false)
        if (option.onClick) {
            option.onClick()
        }
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Download className="w-5 h-5" />
                <span>تصدير التقرير</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20"
                        >
                            {exportOptions.map((option) => {
                                const Icon = option.icon
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionClick(option)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-gray-50 transition-colors"
                                    >
                                        <Icon className={`w-5 h-5 ${option.color}`} />
                                        <span className="text-gray-700 font-medium">{option.label}</span>
                                    </button>
                                )
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

ExportButton.propTypes = {
    onExportPDF: PropTypes.func,
    onExportExcel: PropTypes.func,
    onPrint: PropTypes.func,
    isLoading: PropTypes.bool
}

export default ExportButton
