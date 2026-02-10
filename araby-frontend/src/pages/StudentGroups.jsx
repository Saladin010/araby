import { useState } from 'react'
import { Plus, Search, Grid3x3, List, Filter } from 'lucide-react'
import { DashboardLayout } from '../components/layout'
import {
    GroupsList,
    AddEditGroupModal,
    GroupDetailsModal
} from '../components/student-groups'
import {
    useStudentGroups,
    useCreateStudentGroup,
    useUpdateStudentGroup,
    useDeleteStudentGroup
} from '../hooks/useStudentGroups'
import { filterGroups, sortGroups } from '../utils/groupHelpers'

/**
 * StudentGroups Page
 * Comprehensive student groups management
 */
const StudentGroups = () => {
    const [view, setView] = useState('grid')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')
    const [studentRange, setStudentRange] = useState('')

    // Modals state
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)

    // Fetch groups
    const { data: groupsData, isLoading } = useStudentGroups()
    const groups = groupsData || []

    // Mutations
    const createGroup = useCreateStudentGroup()
    const updateGroup = useUpdateStudentGroup()
    const deleteGroup = useDeleteStudentGroup()

    // Filter and sort groups
    const filteredGroups = filterGroups(groups, { search: searchTerm, studentRange })
    const sortedGroups = sortGroups(filteredGroups, sortBy, sortOrder)

    // Handlers
    const handleCreateGroup = () => {
        setSelectedGroup(null)
        setIsAddEditModalOpen(true)
    }

    const handleEditGroup = (group) => {
        setSelectedGroup(group)
        setIsAddEditModalOpen(true)
    }

    const handleDeleteGroup = (group) => {
        if (window.confirm(`هل أنت متأكد من حذف المجموعة "${group.groupName}"؟`)) {
            deleteGroup.mutate(group.id)
        }
    }

    const handleViewGroup = (group) => {
        setSelectedGroup(group)
        setIsDetailsModalOpen(true)
    }

    const handleSubmitGroup = (data) => {
        if (selectedGroup) {
            // Update
            updateGroup.mutate(
                { id: selectedGroup.id, data },
                {
                    onSuccess: () => {
                        setIsAddEditModalOpen(false)
                        setSelectedGroup(null)
                    }
                }
            )
        } else {
            // Create
            createGroup.mutate(data, {
                onSuccess: () => {
                    setIsAddEditModalOpen(false)
                }
            })
        }
    }

    const handleCloseAddEditModal = () => {
        setIsAddEditModalOpen(false)
        setSelectedGroup(null)
    }

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false)
        setSelectedGroup(null)
    }

    return (
        <DashboardLayout
            title="إدارة المجموعات"
            breadcrumbs={[
                { label: 'الرئيسية', path: '/dashboard' },
                { label: 'المجموعات' }
            ]}
        >
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            المجموعات ({sortedGroups.length})
                        </h1>
                        <p className="text-gray-600 mt-1">
                            إدارة وتنظيم الطلاب في مجموعات
                        </p>
                    </div>
                    <button
                        onClick={handleCreateGroup}
                        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        إنشاء مجموعة جديدة
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ابحث عن مجموعة، طالب، أو رقم..."
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        {/* Student Range Filter */}
                        <div className="relative">
                            <Filter className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                            <select
                                value={studentRange}
                                onChange={(e) => setStudentRange(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                            >
                                <option value="">كل المجموعات</option>
                                <option value="0-10">0-10 طلاب</option>
                                <option value="11-25">11-25 طالب</option>
                                <option value="26-50">26-50 طالب</option>
                                <option value="50+">أكثر من 50</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="name">الاسم</option>
                                <option value="students">عدد الطلاب</option>
                                <option value="date">تاريخ الإنشاء</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                title={sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                        <span className="text-sm text-gray-600 ml-2">العرض:</span>
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 rounded-lg transition-colors ${view === 'grid'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            title="عرض شبكي"
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-lg transition-colors ${view === 'list'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            title="عرض قائمة"
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Groups List */}
            <GroupsList
                groups={sortedGroups}
                view={view}
                onEdit={handleEditGroup}
                onDelete={handleDeleteGroup}
                onView={handleViewGroup}
                isLoading={isLoading}
            />

            {/* Add/Edit Modal */}
            <AddEditGroupModal
                isOpen={isAddEditModalOpen}
                onClose={handleCloseAddEditModal}
                group={selectedGroup}
                onSubmit={handleSubmitGroup}
                isLoading={createGroup.isPending || updateGroup.isPending}
            />

            {/* Details Modal */}
            <GroupDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                groupId={selectedGroup?.id}
                onEdit={handleEditGroup}
                onDelete={handleDeleteGroup}
            />
        </DashboardLayout>
    )
}

export default StudentGroups
