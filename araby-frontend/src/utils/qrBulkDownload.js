import QRCode from 'qrcode'
import JSZip from 'jszip'

/**
 * Generate a single QR code image with student information card
 * @param {Object} student - Student data
 * @returns {Promise<Blob>} - Image blob
 */
export async function generateQRCardImage(student) {
    // Create canvas for the card
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Card dimensions
    const cardWidth = 800
    const cardHeight = 1000
    const padding = 40

    canvas.width = cardWidth
    canvas.height = cardHeight

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, cardWidth, cardHeight)

    // Border
    ctx.strokeStyle = '#2386C8'
    ctx.lineWidth = 8
    ctx.strokeRect(padding / 2, padding / 2, cardWidth - padding, cardHeight - padding)

    // Avatar circle
    const avatarSize = 150
    const avatarX = cardWidth / 2
    const avatarY = padding + 100

    const gradient = ctx.createLinearGradient(avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarX + avatarSize / 2, avatarY + avatarSize / 2)
    gradient.addColorStop(0, '#2386C8')
    gradient.addColorStop(1, '#1e5a8e')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2)
    ctx.fill()

    // Initial letter
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 64px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(student.fullName.charAt(0), avatarX, avatarY)

    // Student name
    ctx.fillStyle = '#1E293B'
    ctx.font = 'bold 42px Arial'
    ctx.fillText(student.fullName, avatarX, avatarY + avatarSize / 2 + 60)

    // Student number
    ctx.fillStyle = '#2386C8'
    ctx.font = 'bold 36px Arial'
    ctx.fillText(`رقم الطالب: #${student.studentNumber}`, avatarX, avatarY + avatarSize / 2 + 120)

    // Academic level
    if (student.academicLevel) {
        ctx.fillStyle = '#64748B'
        ctx.font = '28px Arial'
        ctx.fillText(student.academicLevel, avatarX, avatarY + avatarSize / 2 + 170)
    }

    // Generate QR code
    const qrData = JSON.stringify({
        studentNumber: student.studentNumber,
        studentId: student.id,
        fullName: student.fullName,
        timestamp: new Date().toISOString(),
    })

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 350,
        margin: 2,
        errorCorrectionLevel: 'H',
    })

    // Load and draw QR code
    const qrImage = new Image()
    await new Promise((resolve, reject) => {
        qrImage.onload = resolve
        qrImage.onerror = reject
        qrImage.src = qrCodeDataUrl
    })

    const qrX = (cardWidth - 350) / 2
    const qrY = avatarY + avatarSize / 2 + 220
    ctx.drawImage(qrImage, qrX, qrY, 350, 350)

    // Footer text
    ctx.fillStyle = '#94A3B8'
    ctx.font = '24px Arial'
    ctx.fillText('Mr. Ahmed Amr - نظام الحضور', avatarX, qrY + 400)

    ctx.fillStyle = '#CBD5E1'
    ctx.font = '18px Arial'
    ctx.fillText('للاستخدام الشخصي فقط', avatarX, qrY + 440)

    // Convert canvas to blob
    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png')
    })
}

/**
 * Download multiple QR codes as a ZIP file
 * @param {Array} students - Array of student objects
 * @param {Function} onProgress - Progress callback (current, total)
 */
export async function downloadMultipleQRCodes(students, onProgress) {
    const zip = new JSZip()
    const folder = zip.folder('QR_Codes')

    const totalStudents = students.length

    for (let i = 0; i < totalStudents; i++) {
        const student = students[i]

        // Skip students without student number
        if (!student.studentNumber) {
            if (onProgress) onProgress(i + 1, totalStudents)
            continue
        }

        try {
            const imageBlob = await generateQRCardImage(student)
            const fileName = `QR_${student.fullName}_${student.studentNumber}.png`
            folder.file(fileName, imageBlob)

            if (onProgress) onProgress(i + 1, totalStudents)
        } catch (error) {
            console.error(`Failed to generate QR for ${student.fullName}:`, error)
            if (onProgress) onProgress(i + 1, totalStudents)
        }
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' })

    // Download ZIP
    const link = document.createElement('a')
    link.href = URL.createObjectURL(zipBlob)
    link.download = `QR_Codes_${new Date().toISOString().split('T')[0]}.zip`
    link.click()

    // Cleanup
    URL.revokeObjectURL(link.href)
}

/**
 * Download a single QR code image
 * @param {Object} student - Student object
 */
export async function downloadSingleQRCode(student) {
    if (!student.studentNumber) {
        throw new Error('Student does not have a student number')
    }

    const imageBlob = await generateQRCardImage(student)
    const url = URL.createObjectURL(imageBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = `QR_${student.fullName}_${student.studentNumber}.png`
    link.click()

    URL.revokeObjectURL(url)
}
