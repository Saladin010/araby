import { useState, useRef } from 'react'
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * ProfilePictureUpload Component
 * Handles profile picture upload with preview and validation
 */
const ProfilePictureUpload = ({ currentPicture, onUpload, onDelete, isOpen, onClose }) => {
    const [preview, setPreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [error, setError] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    // Validate file
    const validateFile = (file) => {
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!validTypes.includes(file.type)) {
            return 'يرجى اختيار صورة بصيغة JPG أو PNG'
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت'
        }

        return null
    }

    // Handle file selection
    const handleFileSelect = (file) => {
        setError('')

        const validationError = validateFile(file)
        if (validationError) {
            setError(validationError)
            return
        }

        setSelectedFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target.result)
        }
        reader.readAsDataURL(file)
    }

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    // Handle upload
    const handleUpload = async () => {
        if (!selectedFile) return

        try {
            await onUpload(selectedFile)
            handleClose()
        } catch (err) {
            setError(err.message || 'فشل رفع الصورة')
        }
    }

    // Handle delete
    const handleDelete = async () => {
        try {
            await onDelete()
            handleClose()
        } catch (err) {
            setError(err.message || 'فشل حذف الصورة')
        }
    }

    // Handle close
    const handleClose = () => {
        setPreview(null)
        setSelectedFile(null)
        setError('')
        setIsDragging(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">تغيير الصورة الشخصية</h3>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Current Picture */}
                    {currentPicture && !preview && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">الصورة الحالية:</p>
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                                <img
                                    src={currentPicture}
                                    alt="Current"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    {preview && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-600 mb-2">معاينة:</p>
                            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Upload Area */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />

                        <p className="text-sm text-gray-600 mb-2">
                            اسحب الصورة هنا أو
                        </p>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-primary hover:text-primary-dark font-medium"
                        >
                            اختر من جهازك
                        </button>

                        <p className="text-xs text-gray-500 mt-4">
                            JPG, PNG (حد أقصى 5 ميجابايت)
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        {preview ? (
                            <>
                                <button
                                    onClick={handleUpload}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                                >
                                    <Check className="w-5 h-5" />
                                    <span>رفع الصورة</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setPreview(null)
                                        setSelectedFile(null)
                                        setError('')
                                    }}
                                    className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    إلغاء
                                </button>
                            </>
                        ) : currentPicture ? (
                            <>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                                >
                                    <Upload className="w-5 h-5" />
                                    <span>تغيير الصورة</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-3 border border-red-300 hover:bg-red-50 text-red-600 rounded-lg font-medium transition-colors"
                                >
                                    حذف
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleClose}
                                className="w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                إغلاق
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

ProfilePictureUpload.propTypes = {
    currentPicture: PropTypes.string,
    onUpload: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default ProfilePictureUpload
