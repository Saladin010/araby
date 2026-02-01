import { useState } from 'react'
import { Sun, Moon, Type, Bell, Globe, Shield, Database, Trash2 } from 'lucide-react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * SettingsPanel Component
 * User settings management (placeholder for future implementation)
 */
const SettingsPanel = ({ settings, onSave, isLoading }) => {
    const [formData, setFormData] = useState(settings || {
        theme: 'light',
        fontSize: 'medium',
        notifications: {
            upcomingSessions: true,
            paymentReminders: true,
            newGrades: true,
            attendanceAlerts: true,
            emailNotifications: false,
            soundNotifications: true,
            notificationTiming: '1hour'
        },
        language: 'ar',
        timezone: 'Africa/Cairo',
        privacy: {
            showProfileToOthers: true,
            allowWhatsAppNotifications: false,
            shareStatistics: true
        }
    })

    // Handle toggle change
    const handleToggle = (section, field) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: !prev[section][field]
            }
        }))
    }

    // Handle select change
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Handle nested change
    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            {/* Appearance Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    <span>المظهر</span>
                </h3>

                {/* Theme */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">المظهر</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: 'light', label: 'فاتح', icon: Sun },
                            { value: 'dark', label: 'داكن', icon: Moon },
                            { value: 'auto', label: 'تلقائي', icon: Globe }
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => handleChange('theme', value)}
                                className={`p-4 border-2 rounded-lg transition-all ${formData.theme === value
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                <span className="text-sm font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Font Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">حجم الخط</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: 'small', label: 'صغير' },
                            { value: 'medium', label: 'متوسط' },
                            { value: 'large', label: 'كبير' }
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => handleChange('fontSize', value)}
                                className={`p-3 border-2 rounded-lg transition-all ${formData.fontSize === value
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Type className={`mx-auto mb-1 ${value === 'small' ? 'w-4 h-4' :
                                        value === 'medium' ? 'w-5 h-5' :
                                            'w-6 h-6'
                                    }`} />
                                <span className="text-sm font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Notification Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    <span>الإشعارات</span>
                </h3>

                <div className="space-y-3">
                    {[
                        { key: 'upcomingSessions', label: 'إشعارات الحصص القادمة' },
                        { key: 'paymentReminders', label: 'إشعارات المدفوعات' },
                        { key: 'newGrades', label: 'إشعارات الدرجات الجديدة' },
                        { key: 'attendanceAlerts', label: 'إشعارات الحضور' },
                        { key: 'emailNotifications', label: 'إشعارات البريد الإلكتروني' },
                        { key: 'soundNotifications', label: 'الإشعارات الصوتية' }
                    ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                            <button
                                onClick={() => handleToggle('notifications', key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications[key] ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications[key] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Notification Timing */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        توقيت إشعارات الحصص
                    </label>
                    <select
                        value={formData.notifications.notificationTiming}
                        onChange={(e) => handleNestedChange('notifications', 'notificationTiming', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="1hour">قبل ساعة</option>
                        <option value="3hours">قبل 3 ساعات</option>
                        <option value="1day">قبل يوم</option>
                        <option value="none">عدم الإرسال</option>
                    </select>
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Privacy Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span>الخصوصية</span>
                </h3>

                <div className="space-y-3">
                    {[
                        { key: 'showProfileToOthers', label: 'عرض ملفي الشخصي للطلاب الآخرين' },
                        { key: 'allowWhatsAppNotifications', label: 'السماح بالإشعارات عبر WhatsApp' },
                        { key: 'shareStatistics', label: 'مشاركة الإحصائيات' }
                    ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                            <button
                                onClick={() => handleToggle('privacy', key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.privacy[key] ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.privacy[key] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-gray-200" />

            {/* Data & Storage */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    <span>البيانات والتخزين</span>
                </h3>

                <div className="space-y-3">
                    <button className="w-full p-4 border border-gray-300 hover:bg-gray-50 rounded-lg text-right transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">تصدير بياناتي</p>
                                <p className="text-sm text-gray-600">تحميل نسخة من جميع بياناتك</p>
                            </div>
                            <Database className="w-5 h-5 text-gray-400" />
                        </div>
                    </button>

                    <button className="w-full p-4 border border-gray-300 hover:bg-gray-50 rounded-lg text-right transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">مسح ذاكرة التخزين المؤقت</p>
                                <p className="text-sm text-gray-600">تحرير مساحة التخزين</p>
                            </div>
                            <Trash2 className="w-5 h-5 text-gray-400" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4 border-t">
                <button
                    onClick={() => onSave(formData)}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </button>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    💡 <strong>ملاحظة:</strong> سيتم تطبيق الإعدادات فوراً بعد الحفظ. بعض الإعدادات قد تتطلب إعادة تحميل الصفحة.
                </p>
            </div>
        </motion.div>
    )
}

SettingsPanel.propTypes = {
    settings: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
}

export default SettingsPanel
