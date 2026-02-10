import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Search, Calendar, Filter, Download, Hash, ArrowLeft, Clock, Users } from 'lucide-react'
import { useScanQRCode } from '../hooks/useQRCode'
import { useTodayActiveSessions } from '../hooks/useSessions'
import QRCodeScanner from '../components/qr-code/QRCodeScanner'
import ScanResultModal from '../components/qr-code/ScanResultModal'
import ManualEntryModal from '../components/qr-code/ManualEntryModal'
import RecentScans from '../components/qr-code/RecentScans'
import { Card } from '../components/common'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

/**
 * QR Scanner Page - Teacher/Assistant Only
 * Scan student QR codes for attendance
 */
const QRScanner = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('scan') // 'scan' or 'history'
    const [scanning, setScanning] = useState(false)
    const [showManualEntry, setShowManualEntry] = useState(false)
    const [scanResult, setScanResult] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [recentScans, setRecentScans] = useState([])
    const [studentNumberFilter, setStudentNumberFilter] = useState('')

    const scanMutation = useScanQRCode()
    const { data: todaySessions, isLoading: sessionsLoading } = useTodayActiveSessions()

    // Handle QR code scan
    const handleScan = async (qrData) => {
        // Validate QR data
        if (!qrData || !qrData.studentNumber) {
            setScanResult({
                success: false,
                message: 'بيانات الرمز غير صحيحة',
            })
            setShowResult(true)
            setTimeout(() => setShowResult(false), 3000)
            return
        }

        // Submit scan
        const scanData = {
            studentNumber: qrData.studentNumber,
            scanTime: new Date().toISOString(),
        }

        try {
            const result = await scanMutation.mutateAsync(scanData)
            setScanResult(result)
            setShowResult(true)

            // Add to recent scans if successful
            if (result.success) {
                setRecentScans((prev) => [
                    {
                        studentName: result.studentName,
                        studentNumber: qrData.studentNumber,
                        sessionTitle: result.sessionTitle,
                        scanTime: new Date().toISOString(),
                        status: result.status,
                    },
                    ...prev.slice(0, 9), // Keep only last 10
                ])
            }

            // Auto-close success modal after 2 seconds
            if (result.success) {
                setTimeout(() => {
                    setShowResult(false)
                    setScanning(true) // Resume scanning
                }, 2000)
            } else {
                setTimeout(() => {
                    setShowResult(false)
                    setScanning(true) // Resume scanning
                }, 3000)
            }
        } catch (error) {
            setScanResult({
                success: false,
                message: error.response?.data?.message || 'فشل تسجيل الحضور',
            })
            setShowResult(true)
            setTimeout(() => {
                setShowResult(false)
                setScanning(true)
            }, 3000)
        }
    }

    // Handle scan error
    const handleScanError = (error) => {
        console.error('Scan error:', error)
    }

    // Handle manual entry
    const handleManualEntry = async (data) => {
        await handleScan(data)
        setShowManualEntry(false)
    }

    return (
        <div className="container-custom py-8">
            {/* Page Header */}
            <div className="mb-8">
                <div className="breadcrumb">
                    <span>الرئيسية</span>
                    <span>مسح الحضور</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <h1 className="text-3xl font-heading font-bold">مسح رموز الحضور</h1>
                        <p className="text-text-secondary mt-2">
                            استخدم الكاميرا لمسح رموز QR وتسجيل حضور الطلاب
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        العودة للوحة التحكم
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-border">
                <button
                    onClick={() => setActiveTab('scan')}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'scan'
                        ? 'text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                >
                    <Camera size={20} className="inline ml-2" />
                    مسح الرموز
                    {activeTab === 'scan' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'history'
                        ? 'text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                >
                    <Calendar size={20} className="inline ml-2" />
                    السجل
                    {activeTab === 'history' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'scan' && (
                <div className="space-y-6">
                    {/* Current Session Info */}
                    <Card>
                        <h3 className="text-lg font-bold mb-3">الحصص النشطة اليوم</h3>
                        <div className="bg-background rounded-lg p-4">
                            {sessionsLoading ? (
                                <p className="text-text-secondary text-center">جاري التحميل...</p>
                            ) : !todaySessions || todaySessions.length === 0 ? (
                                <p className="text-text-secondary text-center">
                                    لا توجد حصص نشطة اليوم
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {todaySessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="bg-surface rounded-lg p-4 border border-border"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-text-primary mb-2">
                                                        {session.title}
                                                    </h4>
                                                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={16} />
                                                            {format(new Date(session.startTime), 'HH:mm', { locale: ar })} - {format(new Date(session.endTime), 'HH:mm', { locale: ar })}
                                                        </div>
                                                        {session.academicLevel && (
                                                            <span className="badge badge-secondary">
                                                                {session.academicLevel}
                                                            </span>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <Users size={16} />
                                                            {session.currentStudents || 0} طالب
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Scanner Section */}
                    <Card>
                        <h3 className="text-lg font-bold mb-4">مسح رمز QR</h3>
                        <QRCodeScanner
                            onScan={handleScan}
                            onError={handleScanError}
                            scanning={scanning}
                            onScanningChange={setScanning}
                        />

                        {/* Manual Entry Button */}
                        <div className="mt-4">
                            <button
                                onClick={() => setShowManualEntry(true)}
                                className="btn btn-outline w-full"
                            >
                                <Hash size={20} className="mr-2" />
                                إدخال رقم الطالب يدوياً
                            </button>
                        </div>
                    </Card>

                    {/* Recent Scans */}
                    {recentScans.length > 0 && (
                        <RecentScans scans={recentScans} />
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <Card>
                        <h3 className="text-lg font-bold mb-4">تصفية النتائج</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="label">رقم الطالب</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="ابحث برقم الطالب..."
                                    value={studentNumberFilter}
                                    onChange={(e) => setStudentNumberFilter(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">التاريخ</label>
                                <input
                                    type="date"
                                    className="input"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div>
                                <label className="label">الحصة</label>
                                <select className="input">
                                    <option value="">جميع الحصص</option>
                                    {/* TODO: Fetch sessions */}
                                </select>
                            </div>
                            <div>
                                <label className="label">الحالة</label>
                                <select className="input">
                                    <option value="">الكل</option>
                                    <option value="0">حاضر</option>
                                    <option value="1">متأخر</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button className="btn btn-primary">
                                <Search size={20} className="mr-2" />
                                بحث
                            </button>
                            <button className="btn btn-outline">
                                <Download size={20} className="mr-2" />
                                تصدير Excel
                            </button>
                        </div>
                    </Card>

                    {/* Summary Stats */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                            <div className="text-center">
                                <p className="text-text-secondary mb-2">إجمالي المسح اليوم</p>
                                <p className="text-4xl font-bold text-primary">{recentScans.length}</p>
                            </div>
                        </Card>
                        <Card>
                            <div className="text-center">
                                <p className="text-text-secondary mb-2">حاضر</p>
                                <p className="text-4xl font-bold text-success">
                                    {recentScans.filter((s) => s.status === 0).length}
                                </p>
                            </div>
                        </Card>
                        <Card>
                            <div className="text-center">
                                <p className="text-text-secondary mb-2">متأخر</p>
                                <p className="text-4xl font-bold text-warning">
                                    {recentScans.filter((s) => s.status === 1).length}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* History List */}
                    <Card>
                        <h3 className="text-lg font-bold mb-4">سجل المسح</h3>
                        {(() => {
                            // Filter scans by student number if filter is set
                            const filteredScans = studentNumberFilter
                                ? recentScans.filter(scan =>
                                    scan.studentNumber?.toString().includes(studentNumberFilter)
                                )
                                : recentScans

                            return filteredScans.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-text-secondary">
                                        {studentNumberFilter ? 'لا توجد نتائج للبحث' : 'لا توجد عمليات مسح مسجلة'}
                                    </p>
                                </div>
                            ) : (
                                <RecentScans scans={filteredScans} />
                            )
                        })()}
                    </Card>
                </div>
            )}

            {/* Modals */}
            <ScanResultModal
                result={scanResult}
                isOpen={showResult}
                onClose={() => setShowResult(false)}
            />

            <ManualEntryModal
                isOpen={showManualEntry}
                onClose={() => setShowManualEntry(false)}
                onSubmit={handleManualEntry}
            />
        </div>
    )
}

export default QRScanner
