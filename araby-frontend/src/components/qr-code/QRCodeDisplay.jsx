import { QRCodeCanvas } from 'qrcode.react'
import PropTypes from 'prop-types'

/**
 * QR Code Display Component
 * Displays a QR code with student information
 */
const QRCodeDisplay = ({ studentData, size = 300 }) => {
    if (!studentData) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-text-secondary">لا توجد بيانات للعرض</p>
            </div>
        )
    }

    // Prepare QR data
    const qrData = JSON.stringify({
        studentNumber: studentData.studentNumber,
        studentId: studentData.studentId,
        fullName: studentData.fullName,
        timestamp: new Date().toISOString(),
    })

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <QRCodeCanvas
                    value={qrData}
                    size={size}
                    level="H" // High error correction
                    includeMargin={true}
                    id="qr-code-canvas"
                />
            </div>
        </div>
    )
}

QRCodeDisplay.propTypes = {
    studentData: PropTypes.shape({
        studentNumber: PropTypes.number.isRequired,
        studentId: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
    }),
    size: PropTypes.number,
}

export default QRCodeDisplay
