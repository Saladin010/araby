import { DashboardLayout } from '../components/layout'
import { Card } from '../components/common'

const DashboardPage = () => {
    const { user, logout } = useAuth()

    const getRoleName = (role) => {
        switch (role) {
            case 1:
                return 'معلم'
            case 2:
                return 'مساعد'
            case 3:
                return 'طالب'
            default:
                return 'غير محدد'
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-surface shadow-sm border-b border-border">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Home className="text-primary" size={24} />
                            <h1 className="text-2xl font-heading font-bold gradient-text">
                                منصة الأستاذ
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-left">
                                <p className="font-medium">{user?.fullName}</p>
                                <p className="text-sm text-text-secondary">
                                    {getRoleName(user?.role)}
                                </p>
                            </div>
                            <button onClick={logout} className="btn btn-outline btn-sm">
                                <LogOut size={18} />
                                تسجيل الخروج
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom section">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        مرحباً، {user?.fullName}
                    </h2>
                    <p className="text-text-secondary mb-8">
                        لوحة التحكم الخاصة بك
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <StatCard
                            title="الحصص"
                            value="0"
                            color="bg-primary/10 text-primary"
                        />
                        <StatCard
                            title="الطلاب"
                            value="0"
                            color="bg-success/10 text-success"
                        />
                        <StatCard
                            title="الحضور"
                            value="0%"
                            color="bg-warning/10 text-warning"
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

const StatCard = ({ title, value, color }) => {
    return (
        <div className="card text-center">
            <h3 className="text-text-secondary mb-2">{title}</h3>
            <p className={`text-4xl font-bold ${color}`}>{value}</p>
        </div>
    )
}

export default DashboardPage
