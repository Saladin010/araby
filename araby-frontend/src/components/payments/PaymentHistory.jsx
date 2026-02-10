import { useState } from 'react'
import { Search, Filter, Grid, List } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePayments, useUpdatePaymentStatus } from '../../hooks/usePayments'
import { useStudents } from '../../hooks/useStudents'
import { useFeeTypes } from '../../hooks/useFeeTypes'
import PaymentCard from './PaymentCard'
import PaymentDetailsModal from './PaymentDetailsModal'
import Pagination from '../common/Pagination'
import SearchBar from '../common/SearchBar'

/**
 * PaymentHistory Component
 * Displays payment history with filters
 */
const PaymentHistory = () => {
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({
        studentId: '',
        feeTypeId: '',
        status: '',
        startDate: '',
        endDate: '',
        page: 1,
        pageSize: 12,
    })
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    const { data: paymentsData, isLoading } = usePayments(filters)
    const { data: studentsData } = useStudents()
    const { data: feeTypesData } = useFeeTypes()
    const updateStatus = useUpdatePaymentStatus()

    const payments = paymentsData || []
    const totalPages = paymentsData?.totalPages || 1
    const students = studentsData || []
    const feeTypes = feeTypesData || []

    // Filter payments by search term
    const filteredPayments = payments.filter(payment => {
        const term = searchTerm.toLowerCase()
        const student = students.find(s => s.id === payment.studentId)

        return (
            payment.studentName?.toLowerCase().includes(term) ||
            payment.feeTypeName?.toLowerCase().includes(term) ||
            payment.id?.toString().includes(term) ||
            (student?.studentNumber && student.studentNumber.toString().includes(term))
        )
    })

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment)
        setShowDetailsModal(true)
    }

    const handleUpdateStatus = async (paymentId, status) => {
        await updateStatus.mutateAsync({ id: paymentId, status })
    }

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }))
    }

    const getStatusLabel = (status) => {
        const labels = {
            1: 'مدفوع',
            2: 'معلق',
            3: 'متأخر',
        }
        return labels[status] || 'الكل'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">سجل المدفوعات</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        عرض وإدارة جميع المدفوعات
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">الفلاتر</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Student Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الطالب
                        </label>
                        <select
                            value={filters.studentId}
                            onChange={(e) => setFilters(prev => ({ ...prev, studentId: e.target.value, page: 1 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">الكل</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fee Type Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            نوع الرسوم
                        </label>
                        <select
                            value={filters.feeTypeId}
                            onChange={(e) => setFilters(prev => ({ ...prev, feeTypeId: e.target.value, page: 1 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">الكل</option>
                            {feeTypes.map(feeType => (
                                <option key={feeType.id} value={feeType.id}>
                                    {feeType.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            الحالة
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">الكل</option>
                            <option value="1">مدفوع</option>
                            <option value="2">معلق</option>
                            <option value="3">متأخر</option>
                        </select>
                    </div>

                    {/* Date Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            من تاريخ
                        </label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value, page: 1 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Search */}
                <div className="mt-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="ابحث برقم الإيصال، اسم الطالب، رقم الطالب، أو نوع الرسوم..."
                    />
                </div>
            </div>

            {/* Payments List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <p className="text-gray-500">لا توجد مدفوعات</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPayments.map((payment) => (
                        <PaymentCard
                            key={payment.id}
                            payment={payment}
                            onView={handleViewDetails}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        رقم الإيصال
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        الطالب
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        نوع الرسوم
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        المبلغ
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        التاريخ
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        الحالة
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        إجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{payment.id?.toString().padStart(6, '0')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {payment.studentName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {payment.feeTypeName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {(payment.amountPaid > 0 ? payment.amountPaid : (payment.expectedAmount || payment.amount || 0)).toFixed(2)} جنيه
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(payment.paymentDate).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 1 ? 'bg-green-100 text-green-800' :
                                                payment.status === 2 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {getStatusLabel(payment.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleViewDetails(payment)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                عرض
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedPayment && (
                <PaymentDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false)
                        setSelectedPayment(null)
                    }}
                    payment={selectedPayment}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    )
}

export default PaymentHistory
