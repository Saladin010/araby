import { User, Calendar, Shield, CheckCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * ProfileHeader Component
 * Displays user avatar, name, role, and basic info
 */
const ProfileHeader = ({ user, profilePicture, onUploadClick }) => {
    // Role configurations
    const roleConfig = {
        1: { label: 'مدرس', color: 'bg-purple-100 text-purple-800', icon: '👨‍🏫' },
        2: { label: 'مساعد', color: 'bg-blue-100 text-blue-800', icon: '👨‍💼' },
        3: { label: 'طالب', color: 'bg-green-100 text-green-800', icon: '🎓' }
    }

    const role = roleConfig[user?.role] || roleConfig[3]

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U'
        const parts = name.split(' ')
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0]
        }
        return name.substring(0, 2)
    }

    // Format join date
    const formatJoinDate = (date) => {
        if (!date) return '-'
        return new Date(date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-l from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-8"
        >
            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Picture */}
                <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        {profilePicture ? (
                            <img
                                src={profilePicture}
                                alt={user?.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                <span className="text-5xl font-bold text-white">
                                    {getInitials(user?.fullName)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Upload Overlay */}
                    <button
                        onClick={onUploadClick}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <div className="text-center text-white">
                            <User className="w-8 h-8 mx-auto mb-1" />
                            <span className="text-sm font-medium">تغيير الصورة</span>
                        </div>
                    </button>

                    {/* Active Status Indicator */}
                    {user?.isActive && (
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-right">
                    {/* Name */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {user?.fullName || 'المستخدم'}
                    </h1>

                    {/* Role Badge */}
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${role.color}`}>
                            <span>{role.icon}</span>
                            <span>{role.label}</span>
                        </span>
                        {user?.isActive && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                <span>نشط</span>
                            </span>
                        )}
                    </div>

                    {/* Username */}
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm">@{user?.userName}</span>
                    </div>

                    {/* Join Date */}
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">عضو منذ: {formatJoinDate(user?.createdAt)}</span>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {user?.email && (
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
                                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                            </div>
                        )}
                        {user?.phoneNumber && (
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">رقم الهاتف</p>
                                <p className="text-sm font-medium text-gray-900">{user.phoneNumber}</p>
                            </div>
                        )}
                        {user?.academicLevel && (
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">المستوى الدراسي</p>
                                <p className="text-sm font-medium text-gray-900">{user.academicLevel}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

ProfileHeader.propTypes = {
    user: PropTypes.shape({
        fullName: PropTypes.string,
        userName: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        academicLevel: PropTypes.string,
        role: PropTypes.number,
        isActive: PropTypes.bool,
        createdAt: PropTypes.string
    }),
    profilePicture: PropTypes.string,
    onUploadClick: PropTypes.func.isRequired
}

export default ProfileHeader
