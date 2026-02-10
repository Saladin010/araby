import { motion } from 'framer-motion'
import {
    User, Phone, Calendar, Hash, GraduationCap,
    TrendingUp, Star, AlertCircle, CheckCircle,
    DollarSign, BookOpen, Clock, Activity, Download
} from 'lucide-react'
import { formatDate } from '../../utils/dateUtils'
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, AreaChart, Area, CartesianGrid
} from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const StatCard = ({ title, value, subtitle, icon: Icon, color, isNegative }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className={`text-2xl font-bold ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
                {value}
            </h3>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
)

const StudentReport = ({ report }) => {
    if (!report) return null

    // Prepare chart data
    const gradeTrend = report.recentGrades ? [...report.recentGrades].reverse().map(g => ({
        name: g.examName,
        date: formatDate(g.date).split(' ')[0],
        score: g.score,
        percentage: Math.round((g.score / g.maxScore) * 100),
        fullMark: 100
    })) : []

    const attendanceData = report.recentAttendance ? [...report.recentAttendance].reverse().map(a => ({
        name: formatDate(a.date).split(' ')[0], // Date as label
        status: a.status, // 0: Present, 1: Absent, 2: Late
        score: a.status === 0 ? 10 : a.status === 2 ? 5 : 0 // For visualization
    })) : []

    const downloadPDF = async () => {
        const element = document.getElementById('report-content');
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`student-report-${report.studentNumber}.pdf`);
    };

    const getStudentStatus = (attendancePct, gradePct) => {
        // Default to acceptable minimums if null/undefined
        const att = attendancePct || 0
        const grd = gradePct || 0

        if (att < 50 || grd < 50) return { label: 'خطر', color: 'red', icon: AlertCircle }
        if (att < 75 || grd < 65) return { label: 'تحتاج متابعة', color: 'yellow', icon: AlertCircle }
        if (att < 90 || grd < 85) return { label: 'جيد جداً', color: 'blue', icon: TrendingUp }
        return { label: 'ممتاز', color: 'green', icon: Star }
    }

    const { label: statusLabel, color: statusColor, icon: StatusIcon } = getStudentStatus(report.attendancePercentage, report.averagePercentage)

    return (
        <div id="report-content" className="space-y-6 animate-in fade-in duration-500 p-1 bg-gray-50 min-h-full">
            {/* Header / Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border-4 border-white shadow-md">
                            <User className="w-12 h-12" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${(report.absentCount > 5 || statusLabel === 'خطر') ? 'bg-red-500' : 'bg-green-500'
                            }`}>
                            <Activity className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-right space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{report.fullName}</h2>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-gray-500 mt-2">
                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                        <Hash className="w-3 h-3" />
                                        {report.studentNumber || 'N/A'}
                                    </span>
                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                        <GraduationCap className="w-3 h-3" />
                                        {report.academicLevel}
                                    </span>
                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                        <Phone className="w-3 h-3" />
                                        {report.phoneNumber || 'لا يوجد هاتف'}
                                    </span>
                                </div>
                            </div>
                            <div className="hidden md:block text-left">
                                <button
                                    onClick={downloadPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    تحميل التقرير
                                </button>
                                <p className="text-xs text-gray-400 mt-2 text-center">تاريخ الانضمام: {formatDate(report.unlockedAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="نسبة الحضور"
                    value={`${report.attendancePercentage}%`}
                    subtitle={`${report.presentCount} حضور • ${report.absentCount} غياب`}
                    icon={CheckCircle}
                    color="green"
                />
                <StatCard
                    title="متوسط الدرجات"
                    value={`${report.averagePercentage}%`}
                    subtitle={`${report.totalExams} امتحان • Avg: ${report.averageScore}`}
                    icon={Star}
                    color="yellow"
                />
                <StatCard
                    title="الرسوم المدفوعة"
                    value={`${report.totalPaid.toLocaleString()} ج.م`}
                    subtitle={`${report.pendingPaymentsCount} معلق`}
                    icon={DollarSign}
                    color="blue"
                />
                <StatCard
                    title="حالة الطالب"
                    value={statusLabel}
                    subtitle={`${report.lateCount} تأخير`}
                    icon={StatusIcon}
                    color={statusColor}
                    isNegative={statusColor === 'red'}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grade Evaluation Curve */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        المنحنى العام للدرجات Performance Curve
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={gradeTrend}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} hide />
                                <YAxis domain={[0, 100]} hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value}%`, 'النسبة']}
                                    labelFormatter={(label) => `الامتحان: ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="percentage"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <span className="block text-gray-500 text-xs mb-1">أعلى درجة</span>
                            <span className="font-bold text-green-700 text-lg">{report.highestScore}</span>
                        </div>
                        <div className="p-3 bg-red-50 rounded-xl">
                            <span className="block text-gray-500 text-xs mb-1">أقل درجة</span>
                            <span className="font-bold text-red-700 text-lg">{report.lowestScore}</span>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <span className="block text-gray-500 text-xs mb-1">المتوسط</span>
                            <span className="font-bold text-blue-700 text-lg">{report.averageScore}</span>
                        </div>
                    </div>
                </div>

                {/* Attendance Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        ملخص الحضور والغياب Attendance
                    </h3>

                    {/* Mini Bar Chart for Recent Sessions */}
                    <div className="h-40 w-full mb-6 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value, name, props) => {
                                        const status = props.payload.status;
                                        return [status === 0 ? 'حاضر' : status === 2 ? 'تأخير' : 'غائب', 'الحالة'];
                                    }}
                                />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                    {attendanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.status === 0 ? '#10b981' : entry.status === 2 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        {report.recentAttendance && report.recentAttendance.length > 0 ? (
                            report.recentAttendance.map((att, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm ${att.status === 0 ? 'bg-green-500' :
                                            att.status === 1 ? 'bg-red-500' :
                                                att.status === 2 ? 'bg-orange-500' : 'bg-gray-400'
                                            }`} />
                                        <span className="text-sm font-medium text-gray-900 line-clamp-1">{att.sessionTitle}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">{formatDate(att.date).split(' ')[0]}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4 text-sm">لا يوجد سجل حضور حديث</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row - Payments & Recent Grades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Payments */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        سجل المدفوعات Financial History
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="p-3 text-right font-medium rounded-r-lg">البيان</th>
                                    <th className="p-3 text-right font-medium">المبلغ</th>
                                    <th className="p-3 text-right font-medium">التاريخ</th>
                                    <th className="p-3 text-right font-medium rounded-l-lg">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {report.paymentHistory && report.paymentHistory.length > 0 ? (
                                    report.paymentHistory.map((pay, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 font-medium text-gray-900">{pay.feeType}</td>
                                            <td className="p-3 font-bold text-gray-900">{pay.amount} ج.م</td>
                                            <td className="p-3 text-gray-500">{formatDate(pay.date).split(' ')[0]}</td>
                                            <td className="p-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pay.status === 1 ? 'bg-green-100 text-green-700' :
                                                    pay.status === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {pay.status === 1 ? 'مدفوع' : pay.status === 2 ? 'معلق' : 'متأخر'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-400">لا توجد مدفوعات مسجلة</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Exams */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        تفاصيل الاختبارات الأخيرة Recent Exams
                    </h3>
                    <div className="space-y-4">
                        {report.recentGrades && report.recentGrades.length > 0 ? (
                            report.recentGrades.map((grade, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all group">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{grade.examName}</h4>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(grade.date)}
                                        </p>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xl font-bold text-indigo-600 leading-none">
                                            {grade.score} <span className="text-xs text-gray-400 font-normal">/ {grade.maxScore}</span>
                                        </div>
                                        <div className={`text-xs font-bold mt-1 ${(grade.score / grade.maxScore) >= 0.85 ? 'text-green-600' :
                                            (grade.score / grade.maxScore) >= 0.65 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {Math.round((grade.score / grade.maxScore) * 100)}%
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-8">لا توجد اختبارات حديثة</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentReport
