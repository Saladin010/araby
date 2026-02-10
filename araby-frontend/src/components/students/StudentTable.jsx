import { motion } from 'framer-motion'
import { MoreVertical, Eye, Edit, Key, Calendar, Award, CreditCard, ToggleLeft, ToggleRight, Trash2, QrCode } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { formatDate } from '../../utils/dateUtils'

/**
 * StudentTable Component - Desktop table view with multi-select support
 */
const StudentTable = ({ students, onView, onEdit, onDelete, onToggleStatus, onShowPassword, onShowQR, loading, selectedStudents, onSelectStudent, onSelectAll }) => {
    const [openDropdown, setOpenDropdown] = useState(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const ActionsDropdown = ({ student, index }) => {
        const isOpen = openDropdown === index

        return (
            <div className="relative" ref={isOpen ? dropdownRef : null}>
                <button
                    onClick={() => setOpenDropdown(isOpen ? null : index)}
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                >
                    <MoreVertical className="w-5 h-5" />
                </button>

                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute left-0 mt-2 w-56 bg-surface rounded-lg shadow-lg border border-border z-50"
                    >
                        <div className="py-2">
                            <button
                                onClick={() => {
                                    onView(student)
                                    setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-right hover:bg-background transition-colors flex items-center gap-3"
                            >
                                <Eye className="w-4 h-4" />
                                <span>عرض التفاصيل</span>
                            </button>

                            <button
                                onClick={() => {
                                    onEdit(student)
                                    setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-right hover:bg-background transition-colors flex items-center gap-3"
                            >
                                <Edit className="w-4 h-4" />
                                <span>تعديل البيانات</span>
                            </button>

                            <button
                                onClick={() => {
                                    onShowPassword(student)
                                    setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-right hover:bg-background transition-colors flex items-center gap-3"
                            >
                                <Key className="w-4 h-4" />
                                <span>تغيير كلمة المرور</span>
                            </button>

                            {student.studentNumber && (
                                <button
                                    onClick={() => {
                                        onShowQR(student)
                                        setOpenDropdown(null)
                                    }}
                                    className="w-full px-4 py-2 text-right hover:bg-background transition-colors flex items-center gap-3"
                                >
                                    <QrCode className="w-4 h-4" />
                                    <span>عرض رمز QR</span>
                                </button>
                            )}

                            <div className="border-t border-border my-2" />

                            <button
                                onClick={() => {
                                    onToggleStatus(student)
                                    setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-right hover:bg-background transition-colors flex items-center gap-3"
                            >
                                {student.isActive ? (
                                    <>
                                        <ToggleLeft className="w-4 h-4 text-warning" />
                                        <span>إلغاء التفعيل</span>
                                    </>
                                ) : (
                                    <>
                                        <ToggleRight className="w-4 h-4 text-success" />
                                        <span>تفعيل</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    onDelete(student)
                                    setOpenDropdown(null)
                                }}
                                className="w-full px-4 py-2 text-right hover:bg-background transition-colors flex items-center gap-3 text-error"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>حذف</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        )
    }

    const getInitials = (name) => {
        return name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
    }

    if (loading) {
        return (
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border bg-background/50">
                                {['الصورة', 'الاسم الكامل', 'اسم المستخدم', 'رقم الهاتف', 'النوع', 'المستوى الدراسي', 'الحالة', 'تاريخ الإنضمام', 'الإجراءات'].map((header, i) => (
                                    <th key={i} className="text-right py-3 px-4 text-sm font-semibold text-text-primary">
                                        <div className="h-4 w-24 bg-background rounded animate-pulse" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="border-b border-border">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (
                                        <td key={j} className="py-3 px-4">
                                            <div className="h-4 w-full bg-background rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return (
        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-background/50">
                            <th className="text-center py-3 px-4 text-sm font-semibold text-text-primary w-12">
                                <input
                                    type="checkbox"
                                    checked={students.length > 0 && selectedStudents.length === students.filter(s => s.studentNumber).length}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                                    title="تحديد الكل"
                                />
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">الصورة</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">الاسم الكامل</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">رقم الطالب</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">اسم المستخدم</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">رقم الهاتف</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">النوع</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">المستوى الدراسي</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">الحالة</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">تاريخ الإنضمام</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-text-primary">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <motion.tr
                                key={student.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={`border-b border-border hover:bg-background/30 transition-colors ${selectedStudents.includes(student.id) ? 'bg-primary/5' : ''
                                    }`}
                            >
                                <td className="py-3 px-4 text-center">
                                    {student.studentNumber ? (
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={(e) => onSelectStudent(student.id, e.target.checked)}
                                            className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                                        />
                                    ) : (
                                        <span className="text-text-muted text-xs">-</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                        {getInitials(student.fullName)}
                                    </div>
                                </td>
                                <td className="py-3 px-4 font-medium text-text-primary">{student.fullName}</td>
                                <td className="py-3 px-4">
                                    {student.studentNumber ? (
                                        <span className="badge badge-info">{student.studentNumber}</span>
                                    ) : (
                                        <span className="text-text-muted">-</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-text-muted">{student.userName}</td>
                                <td className="py-3 px-4 text-text-muted">{student.phoneNumber || '-'}</td>
                                <td className="py-3 px-4">
                                    {student.role === 1 ? (
                                        <span className="badge badge-primary">طالب</span>
                                    ) : student.role === 2 ? (
                                        <span className="badge badge-warning">مساعد</span>
                                    ) : (
                                        <span className="badge badge-secondary">غير محدد</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-text-muted">{student.academicLevel || '-'}</td>
                                <td className="py-3 px-4">
                                    {student.isActive ? (
                                        <span className="badge badge-success">نشط</span>
                                    ) : (
                                        <span className="badge badge-error">غير نشط</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-sm text-text-muted">{formatDate(student.createdAt)}</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        {/* QR Button - Only for students with studentNumber */}
                                        {student.studentNumber && (
                                            <button
                                                onClick={() => onShowQR(student)}
                                                className="p-2 hover:bg-background rounded-lg transition-colors group relative"
                                                title="عرض رمز QR"
                                            >
                                                <QrCode className="w-5 h-5 text-primary" />
                                            </button>
                                        )}

                                        {/* Actions Dropdown */}
                                        <ActionsDropdown student={student} index={index} />
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentTable
