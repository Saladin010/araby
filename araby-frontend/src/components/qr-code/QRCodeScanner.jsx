import { useRef, useState, useEffect, useCallback } from 'react'
import Webcam from 'react-webcam'
import { BrowserQRCodeReader } from '@zxing/library'
import { Camera, CameraOff, Loader2 } from 'lucide-react'
import PropTypes from 'prop-types'

/**
 * QR Code Scanner Component
 * Uses device camera to scan QR codes
 */
const QRCodeScanner = ({ onScan, onError, scanning, onScanningChange }) => {
    const webcamRef = useRef(null)
    const codeReaderRef = useRef(null)
    const [facingMode, setFacingMode] = useState('environment') // 'user' for front, 'environment' for back
    const [cameraReady, setCameraReady] = useState(false)

    useEffect(() => {
        codeReaderRef.current = new BrowserQRCodeReader()
        return () => {
            if (codeReaderRef.current) {
                codeReaderRef.current.reset()
            }
        }
    }, [])

    // Scanning loop
    useEffect(() => {
        let intervalId

        if (scanning && cameraReady) {
            intervalId = setInterval(async () => {
                if (webcamRef.current) {
                    const imageSrc = webcamRef.current.getScreenshot()
                    if (imageSrc) {
                        try {
                            const result = await codeReaderRef.current.decodeFromImageUrl(imageSrc)
                            if (result && result.text) {
                                try {
                                    const data = JSON.parse(result.text)
                                    onScan(data)
                                    onScanningChange(false) // Stop scanning after successful read
                                } catch (parseError) {
                                    // Invalid QR format
                                    onError('تنسيق الرمز غير صحيح')
                                }
                            }
                        } catch (err) {
                            // No QR code found, continue scanning
                        }
                    }
                }
            }, 500) // Scan every 500ms
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId)
            }
        }
    }, [scanning, cameraReady, onScan, onError, onScanningChange])

    const toggleFacingMode = () => {
        setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
    }

    const handleUserMedia = useCallback(() => {
        setCameraReady(true)
    }, [])

    const handleUserMediaError = useCallback((error) => {
        console.error('Camera error:', error)
        setCameraReady(false)
        onError('فشل في الوصول إلى الكاميرا. يرجى التحقق من الأذونات.')
    }, [onError])

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Camera View */}
            <div className="relative aspect-video bg-background rounded-lg overflow-hidden shadow-lg">
                {scanning && (
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            facingMode: facingMode,
                            width: 1280,
                            height: 720,
                        }}
                        onUserMedia={handleUserMedia}
                        onUserMediaError={handleUserMediaError}
                        className="w-full h-full object-cover"
                    />
                )}

                {!scanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background">
                        <div className="text-center p-8">
                            <CameraOff size={64} className="mx-auto mb-4 text-text-muted" />
                            <p className="text-text-secondary">اضغط "بدء المسح" لتشغيل الكاميرا</p>
                        </div>
                    </div>
                )}

                {/* Scanning Overlay */}
                {scanning && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Scanning Frame */}
                        <div className="relative w-64 h-64">
                            <div className="absolute inset-0 border-4 border-primary rounded-lg animate-pulse"></div>
                            {/* Corner markers */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {scanning && !cameraReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <div className="text-center">
                            <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
                            <p className="text-text-primary">جاري تحميل الكاميرا...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => onScanningChange(!scanning)}
                    className={`flex-1 btn ${scanning ? 'btn-error' : 'btn-primary'} btn-lg`}
                >
                    <Camera size={20} className="mr-2" />
                    {scanning ? 'إيقاف المسح' : 'بدء المسح'}
                </button>

                {scanning && (
                    <button
                        onClick={toggleFacingMode}
                        className="btn btn-outline px-4"
                        title="تبديل الكاميرا"
                    >
                        🔄
                    </button>
                )}
            </div>

            {/* Scanning Status */}
            {scanning && cameraReady && (
                <div className="mt-4 text-center">
                    <p className="text-text-secondary animate-pulse">
                        ⏳ جاري البحث عن رمز QR...
                    </p>
                </div>
            )}
        </div>
    )
}

QRCodeScanner.propTypes = {
    onScan: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    scanning: PropTypes.bool.isRequired,
    onScanningChange: PropTypes.func.isRequired,
}

export default QRCodeScanner
