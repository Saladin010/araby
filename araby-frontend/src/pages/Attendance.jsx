import { useState } from 'react'
import { ClipboardCheck, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/layout'
import { RecordAttendance, AttendanceHistory, AttendanceStatistics } from '../components/attendance'

/**
 * Attendance Page - Main attendance management page
 */
const Attendance = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('record') // 'record', 'history', 'statistics'

    const tabs = [
        { id: 'record', label: 'تسجيل الحضور', icon: ClipboardCheck },
        { id: 'history', label: 'سجل الحضور', icon: ClipboardCheck },
        { id: 'statistics', label: 'الإحصائيات', icon: ClipboardCheck },
    ]

    return (
        <DashboardLayout>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-outline px-3 py-2"
                                title="العودة للوحة التحكم"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-3xl font-bold text-text-primary">
                                إدارة الحضور
                            </h1>
                        </div>
                        <p className="text-text-muted">تسجيل ومتابعة حضور الطلاب</p>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex gap-2 border-b border-border overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-6 py-3 font-semibold transition-all whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-text-muted hover:text-text-primary'
                                }
                            `}
                        >
                            <tab.icon className="w-5 h-5 inline-block ml-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'record' && <RecordAttendance />}
                {activeTab === 'history' && <AttendanceHistory />}
                {activeTab === 'statistics' && <AttendanceStatistics />}
            </motion.div>
        </DashboardLayout>
    )
}

export default Attendance
