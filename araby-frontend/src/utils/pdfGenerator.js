import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * PDF Generator Utilities
 * Functions to export reports as PDF
 */

/**
 * Add Arabic font support to jsPDF
 */
const setupArabicFont = (doc) => {
    // Note: For full Arabic support, you need to add custom fonts
    // This is a placeholder - in production, add Arabic font files
    doc.setFont('helvetica')
    doc.setLanguage('ar')
}

/**
 * Generate PDF from HTML element
 */
export const generatePDFFromElement = async (elementId, filename = 'report.pdf') => {
    try {
        const element = document.getElementById(elementId)
        if (!element) {
            throw new Error(`Element with id "${elementId}" not found`)
        }

        // Capture element as canvas
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        const imgWidth = 210 // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        pdf.save(filename)

        return { success: true }
    } catch (error) {
        console.error('PDF generation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate Financial Report PDF
 */
export const generateFinancialPDF = async (data, charts) => {
    try {
        const doc = new jsPDF()
        setupArabicFont(doc)

        // Add title
        doc.setFontSize(20)
        doc.text('Financial Report', 105, 20, { align: 'center' })

        // Add summary
        doc.setFontSize(12)
        let y = 40
        doc.text(`Total Revenue: ${data.totalRevenue}`, 20, y)
        y += 10
        doc.text(`Total Payments: ${data.totalPayments}`, 20, y)
        y += 10
        doc.text(`Paid: ${data.paidCount}`, 20, y)
        y += 10
        doc.text(`Pending: ${data.pendingCount}`, 20, y)
        y += 10
        doc.text(`Overdue: ${data.overdueCount}`, 20, y)

        // Add charts if provided
        if (charts && charts.length > 0) {
            y += 20
            for (const chart of charts) {
                if (y > 250) {
                    doc.addPage()
                    y = 20
                }
                doc.addImage(chart, 'PNG', 20, y, 170, 100)
                y += 110
            }
        }

        doc.save('financial-report.pdf')
        return { success: true }
    } catch (error) {
        console.error('PDF generation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate Attendance Report PDF
 */
export const generateAttendancePDF = async (data) => {
    try {
        const doc = new jsPDF()
        setupArabicFont(doc)

        doc.setFontSize(20)
        doc.text('Attendance Report', 105, 20, { align: 'center' })

        doc.setFontSize(12)
        let y = 40
        doc.text(`Total Sessions: ${data.totalSessions}`, 20, y)
        y += 10
        doc.text(`Attendance Rate: ${data.overallAttendancePercentage}%`, 20, y)
        y += 10
        doc.text(`Present: ${data.presentCount}`, 20, y)
        y += 10
        doc.text(`Absent: ${data.absentCount}`, 20, y)
        y += 10
        doc.text(`Late: ${data.lateCount}`, 20, y)
        y += 10
        doc.text(`Excused: ${data.excusedCount}`, 20, y)

        doc.save('attendance-report.pdf')
        return { success: true }
    } catch (error) {
        console.error('PDF generation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate Performance Report PDF
 */
export const generatePerformancePDF = async (students) => {
    try {
        const doc = new jsPDF()
        setupArabicFont(doc)

        doc.setFontSize(20)
        doc.text('Performance Report', 105, 20, { align: 'center' })

        doc.setFontSize(10)
        let y = 40

        students.forEach((student, index) => {
            if (y > 270) {
                doc.addPage()
                y = 20
            }

            doc.text(`${index + 1}. ${student.studentName}`, 20, y)
            y += 7
            doc.text(`   Average: ${student.averagePercentage}%`, 20, y)
            y += 7
            doc.text(`   Exams: ${student.totalExams}`, 20, y)
            y += 10
        })

        doc.save('performance-report.pdf')
        return { success: true }
    } catch (error) {
        console.error('PDF generation error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Generate Defaulters Report PDF
 */
export const generateDefaultersPDF = async (defaulters) => {
    try {
        const doc = new jsPDF()
        setupArabicFont(doc)

        doc.setFontSize(20)
        doc.text('Payment Defaulters Report', 105, 20, { align: 'center' })

        doc.setFontSize(10)
        let y = 40

        defaulters.forEach((defaulter, index) => {
            if (y > 270) {
                doc.addPage()
                y = 20
            }

            doc.text(`${index + 1}. ${defaulter.studentName}`, 20, y)
            y += 7
            doc.text(`   Overdue: ${defaulter.overdueAmount} EGP`, 20, y)
            y += 7
            doc.text(`   Count: ${defaulter.totalOverdue}`, 20, y)
            y += 10
        })

        doc.save('defaulters-report.pdf')
        return { success: true }
    } catch (error) {
        console.error('PDF generation error:', error)
        return { success: false, error: error.message }
    }
}

export default {
    generatePDFFromElement,
    generateFinancialPDF,
    generateAttendancePDF,
    generatePerformancePDF,
    generateDefaultersPDF
}
