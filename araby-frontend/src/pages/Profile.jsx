import { useState } from 'react'
import { User, Lock, Settings, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '../components/layout'
import {
    ProfileHeader,
    ProfilePictureUpload,
    ChangePasswordForm,
    SettingsPanel,
    StudentStatistics
} from '../components/profile'
import {
    useCurrentUser,
    useUpdateProfile,
    useChangePassword,
    useProfilePicture,
    useUploadProfilePicture,
    useDeleteProfilePicture
} from '../hooks/useProfile'
import { toast } from 'react-hot-toast'

/**
 * Profile Page
 * User profile with tabs for personal info, password, settings, and statistics
 */
const Profile = () => {
    const [activeTab, setActiveTab] = useState('password')
    const [showPictureUpload, setShowPictureUpload] = useState(false)

    // Fetch data
    const { data: user, isLoading: userLoading } = useCurrentUser()
    const { data: profilePicture } = useProfilePicture()

    // Mutations
    const updateProfile = useUpdateProfile()
    const changePassword = useChangePassword()
    const uploadPicture = useUploadProfilePicture()
    const deletePicture = useDeleteProfilePicture()

    // Tabs configuration
    const tabs = [
        { id: 'password', label: 'تغيير كلمة المرور', icon: Lock },
        { id: 'settings', label: 'الإعدادات', icon: Settings }
    ]

    // Add statistics tab for students
    if (user?.role === 3) {
        tabs.push({ id: 'statistics', label: 'إحصائياتي', icon: BarChart3 })
    }

    // Handle profile update
    const handleProfileUpdate = async (data) => {
        try {
            await updateProfile.mutateAsync(data)
            toast.success('تم حفظ التغييرات بنجاح')
        } catch (error) {
            toast.error(error.message || 'فشل حفظ التغييرات')
        }
    }

    // Handle password change
    const handlePasswordChange = async (data) => {
        try {
            await changePassword.mutateAsync(data)
            toast.success('تم تغيير كلمة المرور بنجاح')
        } catch (error) {
            toast.error(error.message || 'فشل تغيير كلمة المرور')
        }
    }

    // Handle picture upload
    const handlePictureUpload = async (file) => {
        try {
            await uploadPicture.mutateAsync(file)
            toast.success('تم رفع الصورة بنجاح')
        } catch (error) {
            toast.error(error.message || 'فشل رفع الصورة')
        }
    }

    // Handle picture delete
    const handlePictureDelete = async () => {
        try {
            await deletePicture.mutateAsync()
            toast.success('تم حذف الصورة بنجاح')
        } catch (error) {
            toast.error(error.message || 'فشل حذف الصورة')
        }
    }

    // Handle settings save
    const handleSettingsSave = async (settingsData) => {
        try {
            // Apply theme
            if (settingsData.theme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }

            // Apply font size
            const fontSizeMap = {
                small: '14px',
                medium: '16px',
                large: '18px'
            }
            document.documentElement.style.fontSize = fontSizeMap[settingsData.fontSize] || '16px'

            // Save to localStorage
            localStorage.setItem(`user_settings_${user?.id}`, JSON.stringify(settingsData))

            toast.success('تم حفظ الإعدادات بنجاح')
        } catch (error) {
            toast.error(error.message || 'فشل حفظ الإعدادات')
        }
    }

    if (userLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        الملف الشخصي
                    </h1>
                    <p className="text-gray-600">
                        إدارة معلوماتك الشخصية وإعداداتك
                    </p>
                </div>

                {/* Profile Header */}
                <ProfileHeader
                    user={user}
                    profilePicture={profilePicture}
                    onUploadClick={() => setShowPictureUpload(true)}
                />

                {/* Tabs */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Tab Headers */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? 'text-primary border-b-2 border-primary bg-primary/5'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'password' && (
                                <motion.div
                                    key="password"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <ChangePasswordForm
                                        onSubmit={handlePasswordChange}
                                        isLoading={changePassword.isPending}
                                    />
                                </motion.div>
                            )}

                            {/* {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <SettingsPanel
                                        settings={null}
                                        onSave={handleSettingsSave}
                                        isLoading={false}
                                    />
                                </motion.div>
                            )} */}

                            {activeTab === 'statistics' && user?.role === 3 && (
                                <motion.div
                                    key="statistics"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <StudentStatistics />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Account Info Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات الحساب</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">تاريخ الإنضمام</p>
                            <p className="text-sm font-medium text-gray-900">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : '-'}
                            </p>
                        </div>
                        {user?.createdBy && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">تم الإنشاء بواسطة</p>
                                <p className="text-sm font-medium text-gray-900">{user.createdBy}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-600 mb-1">الحالة</p>
                            <p className="text-sm font-medium">
                                {user?.isActive ? (
                                    <span className="text-green-600">نشط ✓</span>
                                ) : (
                                    <span className="text-red-600">معلق</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Picture Upload Modal */}
            <ProfilePictureUpload
                currentPicture={profilePicture}
                onUpload={handlePictureUpload}
                onDelete={handlePictureDelete}
                isOpen={showPictureUpload}
                onClose={() => setShowPictureUpload(false)}
            />
        </DashboardLayout>
    )
}

export default Profile
