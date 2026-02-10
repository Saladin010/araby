import api from './api'

/**
 * Get student QR code data
 * @param {string} studentId - Student user ID
 * @returns {Promise} Student QR data
 */
export const getStudentQRData = async (studentId) => {
    const response = await api.get(`/qrcode/student/${studentId}`)
    return response.data
}

/**
 * Scan QR code and record attendance
 * @param {Object} scanData - {studentNumber, scanTime}
 * @returns {Promise} Scan result
 */
export const scanQRCode = async (scanData) => {
    const response = await api.post('/qrcode/scan', scanData)
    return response.data
}
