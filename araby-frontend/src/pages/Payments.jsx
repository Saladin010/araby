import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/layout'
import {
    RecordPayment,
    AssignFee,
    PaymentHistory,
    PendingPayments,
    OverduePayments,
    PaymentStatistics,
} from '../components/payments'

/**
 * Payments Page - Main payment management page
 */
const Payments = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('record')

    const tabs = [
        { id: 'record', label: 'تسجيل دفعة' },
        { id: 'assign', label: 'تعيين رسوم' },
        { id: 'history', label: 'سجل المدفوعات' },
        { id: 'pending', label: 'المعلقة' },
        { id: 'overdue', label: 'المتأخرة' },
        { id: 'statistics', label: 'الإحصائيات' },
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
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-3xl font-bold text-text-primary">
                                إدارة المدفوعات
                            </h1>
                        </div>
                        <p className="text-text-muted">تسجيل ومتابعة مدفوعات الطلاب</p>
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
                {activeTab === 'record' && <RecordPayment />}
                {activeTab === 'assign' && <AssignFee />}
                {activeTab === 'history' && <PaymentHistory />}
                {activeTab === 'pending' && <PendingPayments />}
                {activeTab === 'overdue' && <OverduePayments />}
                {activeTab === 'statistics' && <PaymentStatistics />}
            </motion.div>
        </DashboardLayout>
    )
}

export default Payments

