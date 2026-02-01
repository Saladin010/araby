import * as XLSX from 'xlsx'

/**
 * Excel Generator Utilities
 * Functions to export reports as Excel files
 */

/**
 * Generate Financial Report Excel
 */
export const generateFinancialExcel = (data, payments = []) => {
    try {
        // Create workbook
        const wb = XLSX.utils.book_new()

        // Summary sheet
        const summaryData = [
            ['التقرير المالي'],
            [],
            ['إجمالي الإيرادات', data.totalRevenue],
            ['عدد المدفوعات', data.totalPayments],
            ['المدفوع', data.paidCount],
            ['المعلق', data.pendingCount],
            ['المتأخر', data.overdueCount],
            [],
            ['الشهر', data.month],
            ['السنة', data.year]
        ]

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
        XLSX.utils.book_append_sheet(wb, summarySheet, 'ملخص')

        // Payments sheet
        if (payments.length > 0) {
            const paymentsData = [
                ['التاريخ', 'الطالب', 'نوع المصروف', 'المبلغ', 'الحالة']
            ]

            payments.forEach(payment => {
                paymentsData.push([
                    new Date(payment.paymentDate).toLocaleDateString('ar-EG'),
                    payment.studentName,
                    payment.feeTypeName,
                    payment.amountPaid,
                    payment.status
                ])
            })

            const paymentsSheet = XLSX.utils.aoa_to_sheet(paymentsData)
            XLSX.utils.book_append_sheet(wb, paymentsSheet, 'المدفوعات')
        }

        // Save file
        XLSX.writeFile(wb, 'financial-report.xlsx')
        return { success: true }
    } catch (error) {
        console.error('Excel generation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate Attendance Report Excel
 */
export const generateAttendanceExcel = (data) => {
    try {
        const wb = XLSX.utils.book_new()

        const summaryData = [
            ['تقرير الحضور'],
            [],
            ['إجمالي الحصص', data.totalSessions],
            ['سجلات الحضور', data.totalAttendanceRecords],
            ['معدل الحضور', `${data.overallAttendancePercentage}%`],
            [],
            ['حاضر', data.presentCount],
            ['غائب', data.absentCount],
            ['متأخر', data.lateCount],
            ['معذور', data.excusedCount]
        ]

        const sheet = XLSX.utils.aoa_to_sheet(summaryData)
        XLSX.utils.book_append_sheet(wb, sheet, 'ملخص الحضور')

        XLSX.writeFile(wb, 'attendance-report.xlsx')
        return { success: true }
    } catch (error) {
        console.error('Excel generation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate Performance Report Excel
 */
export const generatePerformanceExcel = (students) => {
    try {
        const wb = XLSX.utils.book_new()

        const data = [
            ['#', 'الطالب', 'عدد الامتحانات', 'متوسط الدرجات', 'النسبة المئوية', 'نسبة الحضور']
        ]

        students.forEach((student, index) => {
            data.push([
                index + 1,
                student.studentName,
                student.totalExams,
                student.averageGrade.toFixed(2),
                `${student.averagePercentage.toFixed(1)}%`,
                `${student.attendancePercentage.toFixed(1)}%`
            ])
        })

        const sheet = XLSX.utils.aoa_to_sheet(data)
        XLSX.utils.book_append_sheet(wb, sheet, 'الأداء الأكاديمي')

        XLSX.writeFile(wb, 'performance-report.xlsx')
        return { success: true }
    } catch (error) {
        console.error('Excel generation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate Defaulters Report Excel
 */
export const generateDefaultersExcel = (defaulters) => {
    try {
        const wb = XLSX.utils.book_new()

        const data = [
            ['#', 'الطالب', 'عدد المتأخرات', 'المبلغ المتأخر', 'آخر دفعة']
        ]

        defaulters.forEach((defaulter, index) => {
            data.push([
                index + 1,
                defaulter.studentName,
                defaulter.totalOverdue,
                defaulter.overdueAmount,
                defaulter.lastPaymentDate
                    ? new Date(defaulter.lastPaymentDate).toLocaleDateString('ar-EG')
                    : '-'
            ])
        })

        const sheet = XLSX.utils.aoa_to_sheet(data)
        XLSX.utils.book_append_sheet(wb, sheet, 'المتأخرات')

        XLSX.writeFile(wb, 'defaulters-report.xlsx')
        return { success: true }
    } catch (error) {
        console.error('Excel generation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generic Excel export from table data
 */
export const exportTableToExcel = (columns, data, filename = 'export.xlsx', sheetName = 'Data') => {
    try {
        const wb = XLSX.utils.book_new()

        // Create header row
        const headers = columns.map(col => col.label)
        const rows = [headers]

        // Add data rows
        data.forEach(row => {
            const rowData = columns.map(col => {
                const value = row[col.key]
                // Handle custom render functions by using raw value
                return value !== undefined && value !== null ? value : ''
            })
            rows.push(rowData)
        })

        const sheet = XLSX.utils.aoa_to_sheet(rows)
        XLSX.utils.book_append_sheet(wb, sheet, sheetName)

        XLSX.writeFile(wb, filename)
        return { success: true }
    } catch (error) {
        console.error('Excel export error:', error)
        return { success: false, error: error.message }
    }
}

export default {
    generateFinancialExcel,
    generateAttendanceExcel,
    generatePerformanceExcel,
    generateDefaultersExcel,
    exportTableToExcel
}
