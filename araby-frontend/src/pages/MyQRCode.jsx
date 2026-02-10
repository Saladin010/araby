import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useStudentQRData } from '../hooks/useQRCode'
import { AlertCircle, Info, Shield, CheckCircle } from 'lucide-react'
import QRCodeDisplay from '../components/qr-code/QRCodeDisplay'
import QRDownloadCard from '../components/qr-code/QRDownloadCard'
import { Avatar, Card } from '../components/common'

/**
 * My QR Code Page - Student Only
 * Displays student's personal QR code for attendance
 */
const MyQRCode = () => {
    const { user } = useContext(AuthContext)
    const { data: qrData, isLoading, error } = useStudentQRData(user?.id)

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">جاري تحميل رمز الحضور...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="max-w-md text-center">
                    <AlertCircle size={64} className="mx-auto mb-4 text-error" />
                    <h2 className="text-xl font-bold mb-2">فشل تحميل البيانات</h2>
                    <p className="text-text-secondary">{error.message || 'حدث خطأ أثناء تحميل رمز الحضور'}</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="container-custom py-8">
            {/* Page Header */}
            <div className="mb-8">
                <div className="breadcrumb">
                    <span>الرئيسية</span>
                    <span>رمز الحضور</span>
                </div>
                <h1 className="text-3xl font-heading font-bold mt-4">رمز الحضور QR</h1>
                <p className="text-text-secondary mt-2">
                    استخدم هذا الرمز لتسجيل حضورك في الحصص
                </p>
            </div>

            {/* Info Alert */}
            <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-8 flex gap-3">
                <Info size={24} className="text-info flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-text-primary font-medium mb-1">
                        استخدم هذا الرمز لتسجيل حضورك في الحصص
                    </p>
                    <p className="text-text-secondary text-sm">
                        يرجى عرضه للمدرس أو المساعد عند الدخول. سيتم تسجيل حضورك تلقائياً عند مسح الرمز.
                    </p>
                </div>
            </div>

            {/* Main QR Code Card */}
            <div className="max-w-2xl mx-auto mb-8">
                <Card className="text-center">
                    {/* Student Info Header */}
                    <div className="mb-6">
                        <Avatar name={qrData?.fullName} size="xl" className="mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-text-primary mb-2">
                            {qrData?.fullName}
                        </h2>
                        <p className="text-3xl font-bold text-primary mb-2">
                            #{qrData?.studentNumber}
                        </p>
                        {qrData?.academicLevel && (
                            <p className="text-text-secondary">{qrData.academicLevel}</p>
                        )}
                    </div>

                    {/* QR Code */}
                    <div className="mb-6">
                        <QRCodeDisplay studentData={qrData} size={300} />
                    </div>

                    {/* Student Details */}
                    <div className="bg-background rounded-lg p-4 space-y-2 mb-6">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">رقم الطالب:</span>
                            <span className="font-bold text-primary">#{qrData?.studentNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">الاسم:</span>
                            <span className="font-medium">{qrData?.fullName}</span>
                        </div>
                        {user?.username && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">اسم المستخدم:</span>
                                <span className="font-medium">{user.username}</span>
                            </div>
                        )}
                        {user?.phoneNumber && (
                            <div className="flex justify-between">
                                <span className="text-text-secondary">رقم الهاتف:</span>
                                <span className="font-medium">{user.phoneNumber}</span>
                            </div>
                        )}
                    </div>

                    {/* Download Actions */}
                    <QRDownloadCard studentData={qrData} />
                </Card>
            </div>

            {/* Instructions Card */}
            <div className="max-w-2xl mx-auto mb-8">
                <Card>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Info size={20} className="text-primary" />
                        إرشادات الاستخدام
                    </h3>
                    <ol className="space-y-3 mr-6">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                1
                            </span>
                            <span className="text-text-primary">احتفظ بصورة الرمز على هاتفك للوصول السريع</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                2
                            </span>
                            <span className="text-text-primary">اعرض الرمز للمدرس أو المساعد عند دخول الحصة</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                3
                            </span>
                            <span className="text-text-primary">تأكد من وضوح الرمز وإضاءة الشاشة الكافية عند العرض</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                4
                            </span>
                            <span className="text-text-primary">سيتم تسجيل حضورك تلقائياً عند مسح الرمز بنجاح</span>
                        </li>
                    </ol>
                </Card>
            </div>

            {/* Security Note */}
            <div className="max-w-2xl mx-auto">
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex gap-3">
                    <Shield size={24} className="text-warning flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-text-primary font-medium mb-1">
                            ملاحظة أمنية
                        </p>
                        <p className="text-text-secondary text-sm">
                            هذا الرمز شخصي وخاص بك. لا تشاركه مع الآخرين حفاظاً على دقة سجل الحضور.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyQRCode
