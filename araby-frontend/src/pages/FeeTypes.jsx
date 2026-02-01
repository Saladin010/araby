import { useState } from 'react'
import { Plus, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/layout'
import { FeeTypeCard, AddEditFeeTypeModal, AssignGroupsModal } from '../components/payments'
import { useFeeTypes, useCreateFeeType, useUpdateFeeType, useDeleteFeeType, useAssignGroups } from '../hooks/useFeeTypes'

/**
 * FeeTypes Page - Manage fee types (Teacher only)
 */
const FeeTypes = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [selectedFeeType, setSelectedFeeType] = useState(null)

    // Fetch fee types
    const { data: feeTypes = [], isLoading } = useFeeTypes()

    // Mutations
    const createFeeType = useCreateFeeType()
    const updateFeeType = useUpdateFeeType()
    const deleteFeeType = useDeleteFeeType()
    const assignGroups = useAssignGroups()

    const handleAdd = () => {
        setSelectedFeeType(null)
        setIsModalOpen(true)
    }

    const handleEdit = (feeType) => {
        setSelectedFeeType(feeType)
        setIsModalOpen(true)
    }

    const handleDelete = async (feeType) => {
        if (window.confirm(`هل أنت متأكد من حذف "${feeType.name}"؟\nسيتم حذف جميع المدفوعات المرتبطة بهذا النوع.`)) {
            await deleteFeeType.mutateAsync(feeType.id)
        }
    }

    const handleAssignGroups = (feeType) => {
        setSelectedFeeType(feeType)
        setIsAssignModalOpen(true)
    }

    const handleAssignGroupsSubmit = async (data) => {
        if (selectedFeeType) {
            await assignGroups.mutateAsync({
                id: selectedFeeType.id,
                groupIds: data.groupIds,
                autoAssignToMembers: data.autoAssignToMembers ?? true
            })
            setIsAssignModalOpen(false)
            setSelectedFeeType(null)
        }
    }

    const handleSubmit = async (data) => {
        if (selectedFeeType) {
            await updateFeeType.mutateAsync({ id: selectedFeeType.id, data })
        } else {
            await createFeeType.mutateAsync(data)
        }
        setIsModalOpen(false)
        setSelectedFeeType(null)
    }

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
                                أنواع المصروفات ({feeTypes.length})
                            </h1>
                        </div>
                        <p className="text-text-muted">إدارة أنواع المصروفات والرسوم</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="btn btn-primary"
                    >
                        <Plus className="w-5 h-5" />
                        إضافة نوع مصروف جديد
                    </button>
                </div>
            </motion.div>

            {/* Fee Types Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-32 bg-background rounded" />
                        </div>
                    ))}
                </div>
            ) : feeTypes.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-text-muted mb-4">لا توجد أنواع مصروفات</p>
                    <button onClick={handleAdd} className="btn btn-primary">
                        <Plus className="w-5 h-5" />
                        إضافة نوع مصروف
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feeTypes.map((feeType, index) => (
                        <FeeTypeCard
                            key={feeType.id}
                            feeType={feeType}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onAssignGroups={handleAssignGroups}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AddEditFeeTypeModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedFeeType(null)
                }}
                feeType={selectedFeeType}
                onSubmit={handleSubmit}
                isLoading={createFeeType.isPending || updateFeeType.isPending}
            />

            {/* Assign Groups Modal */}
            <AssignGroupsModal
                isOpen={isAssignModalOpen}
                onClose={() => {
                    setIsAssignModalOpen(false)
                    setSelectedFeeType(null)
                }}
                feeType={selectedFeeType}
                onSubmit={handleAssignGroupsSubmit}
                loading={assignGroups.isPending}
            />
        </DashboardLayout>
    )
}

export default FeeTypes
