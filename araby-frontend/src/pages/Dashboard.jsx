import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import TeacherDashboard from './dashboards/TeacherDashboard'
import AssistantDashboard from './dashboards/AssistantDashboard'
import StudentDashboard from './dashboards/StudentDashboard'

/**
 * Main Dashboard Component - Routes to role-specific dashboard
 */
const Dashboard = () => {
    const navigate = useNavigate()
    const user = authService.getCurrentUser()

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    if (!user) {
        return null
    }

    console.log('Current user:', user)
    console.log('User role:', user.role, typeof user.role)

    // Convert role to string if it's a number (enum)
    // Backend enum: Teacher = 1, Assistant = 2, Student = 3
    const getRoleName = (role) => {
        // If role is already a string, return it
        if (typeof role === 'string') return role

        // If role is a number (enum from backend), convert it
        switch (role) {
            case 1:
            case 'Teacher':
                return 'Teacher'
            case 2:
            case 'Assistant':
                return 'Assistant'
            case 3:
            case 'Student':
                return 'Student'
            default:
                return null
        }
    }

    const roleName = getRoleName(user.role)
    console.log('Resolved role name:', roleName)

    // Route to appropriate dashboard based on role
    switch (roleName) {
        case 'Teacher':
            return <TeacherDashboard />
        case 'Assistant':
            return <AssistantDashboard />
        case 'Student':
            return <StudentDashboard />
        default:
            return (
                <div className="container-custom section">
                    <div className="card text-center">
                        <h2 className="text-2xl font-bold text-error mb-4">خطأ في الصلاحيات</h2>
                        <p className="text-text-muted">
                            لا يمكن تحديد نوع المستخدم (Role: {JSON.stringify(user.role)})
                        </p>
                        <p className="text-sm text-text-muted mt-2">
                            الأدوار المتاحة: 1=Teacher, 2=Assistant, 3=Student
                        </p>
                    </div>
                </div>
            )
    }
}

export default Dashboard
