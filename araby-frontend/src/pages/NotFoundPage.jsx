import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center max-w-md">
                <AlertCircle className="w-24 h-24 text-error mx-auto mb-6" />
                <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
                <h2 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
                <p className="text-text-secondary mb-8">
                    عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
                </p>
                <Link to="/" className="btn btn-primary">
                    <Home size={20} />
                    العودة إلى الصفحة الرئيسية
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage
