import html2canvas from 'html2canvas'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Printer } from 'lucide-react'
import PropTypes from 'prop-types'
import { Avatar } from '../common'

/**
 * QR Download Card Component
 * Generates downloadable QR image with student information
 */
const QRDownloadCard = ({ studentData }) => {
    const handleDownload = async () => {
        // Get the existing QR canvas from the page
        const existingQRCanvas = document.getElementById('qr-code-canvas')

        if (!existingQRCanvas) {
            alert('لم يتم العثور على رمز QR. يرجى المحاولة مرة أخرى.')
            return
        }

        // Create a hidden div for rendering the complete card
        const container = document.createElement('div')
        container.style.cssText = `
            position: absolute;
            left: -9999px;
            width: 800px;
            padding: 40px;
            background: white;
            font-family: 'Cairo', sans-serif;
        `

        container.innerHTML = `
            <div style="border: 4px solid #2386C8; padding: 30px; border-radius: 20px; text-align: center;">
                <div style="margin-bottom: 20px;">
                    <div style="width: 150px; height: 150px; border-radius: 50%; margin: 0 auto; background: linear-gradient(135deg, #2386C8, #1e5a8e); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; font-weight: bold;">
                        ${studentData.fullName.charAt(0)}
                    </div>
                </div>
                <h1 style="font-size: 36px; margin: 10px 0; color: #1E293B;">${studentData.fullName}</h1>
                <h2 style="font-size: 28px; margin: 10px 0; color: #2386C8;">رقم الطالب: #${studentData.studentNumber}</h2>
                <p style="font-size: 20px; color: #64748B; margin: 10px 0;">${studentData.academicLevel || ''}</p>
                <div id="qr-placeholder" style="margin: 30px 0; display: flex; justify-content: center;"></div>
                <p style="font-size: 18px; color: #94A3B8; margin-top: 20px;">Mr. Ahmed Amr - نظام الحضور</p>
                <p style="font-size: 14px; color: #CBD5E1; margin-top: 10px;">للاستخدام الشخصي فقط</p>
            </div>
        `

        document.body.appendChild(container)

        try {
            // Clone the existing QR canvas and add it to our container
            const qrContainer = container.querySelector('#qr-placeholder')
            const clonedQRCanvas = document.createElement('canvas')
            clonedQRCanvas.width = existingQRCanvas.width
            clonedQRCanvas.height = existingQRCanvas.height

            const ctx = clonedQRCanvas.getContext('2d')
            ctx.drawImage(existingQRCanvas, 0, 0)

            qrContainer.appendChild(clonedQRCanvas)

            // Convert the entire container to image using html2canvas
            const canvas = await html2canvas(container, {
                backgroundColor: '#ffffff',
                scale: 2,
            })

            // Download the generated image
            const link = document.createElement('a')
            link.download = `QR_${studentData.fullName}_${studentData.studentNumber}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        } catch (error) {
            console.error('Download error:', error)
            alert('فشل تحميل الصورة. يرجى المحاولة مرة أخرى.')
        } finally {
            // Cleanup
            document.body.removeChild(container)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="flex gap-3 mt-6">
            <button
                onClick={handleDownload}
                className="btn btn-primary flex-1"
            >
                <Download size={20} className="mr-2" />
                تحميل الصورة
            </button>
            <button
                onClick={handlePrint}
                className="btn btn-outline flex-1"
            >
                <Printer size={20} className="mr-2" />
                طباعة
            </button>
        </div>
    )
}

QRDownloadCard.propTypes = {
    studentData: PropTypes.shape({
        studentNumber: PropTypes.number.isRequired,
        studentId: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        academicLevel: PropTypes.string,
    }).isRequired,
}

export default QRDownloadCard
