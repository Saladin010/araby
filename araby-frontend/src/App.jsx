import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Sessions from './pages/Sessions'
import Attendance from './pages/Attendance'
import FeeTypes from './pages/FeeTypes'
import Payments from './pages/Payments'
import Grades from './pages/Grades'
import StudentGroups from './pages/StudentGroups'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import StudentSessions from './pages/student/StudentSessions'
import StudentPayments from './pages/student/StudentPayments'
import StudentGrades from './pages/student/StudentGrades'
import NotFoundPage from './pages/NotFoundPage'
import ComponentShowcase from './pages/ComponentShowcase'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

function App() {
    return (
        <div className="min-h-screen bg-background">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/components" element={<ComponentShowcase />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/students"
                    element={
                        <ProtectedRoute allowedRoles={[1, 2]}>
                            <Students />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sessions"
                    element={
                        <ProtectedRoute allowedRoles={[1, 2]}>
                            <Sessions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute allowedRoles={[1, 2]}>
                            <Attendance />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/fee-types"
                    element={
                        <ProtectedRoute allowedRoles={[1]}>
                            <FeeTypes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payments"
                    element={
                        <ProtectedRoute allowedRoles={[1, 2]}>
                            <Payments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/grades"
                    element={
                        <ProtectedRoute>
                            <Grades />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/groups"
                    element={
                        <ProtectedRoute allowedRoles={[1, 2]}>
                            <StudentGroups />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute allowedRoles={[1, 2]}>
                            <Reports />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Student Routes */}
                <Route
                    path="/student/sessions"
                    element={
                        <ProtectedRoute allowedRoles={[3, 'Student']}>
                            <StudentSessions />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/payments"
                    element={
                        <ProtectedRoute allowedRoles={[3, 'Student']}>
                            <StudentPayments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student/grades"
                    element={
                        <ProtectedRoute allowedRoles={[3, 'Student']}>
                            <StudentGrades />
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    )
}

export default App
