'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, X, Zap, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import jsQR from 'jsqr'
import LoadingSpinner from './LoadingSpinner'

interface QRScannerProps {
  onClose: () => void
}

export default function QRScanner({ onClose }: QRScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [noQrFound, setNoQrFound] = useState(false)
  const [error, setError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (scanning) {
      scanQRCode()
    }
  }, [scanning])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          setScanning(true)
          scanQRCode()
          setLoading(true)
          setNoQrFound(false)
          // Set timeout for no QR found popup after 15 seconds
          timeoutRef.current = setTimeout(() => {
            setLoading(false)
            setNoQrFound(true)
            setScanning(false)
          }, 15000)
        }
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          console.log('QR Code detected:', code.data)

          // Clear the timeout since QR was found
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          setLoading(true)
          setScanning(false)

          // Extract queue ID from URL
          try {
            const url = new URL(code.data)
            const queueId = url.searchParams.get('id') || url.pathname.split('/').pop()

            if (queueId) {
              // Add slight delay before redirecting
              setTimeout(() => {
                stopCamera()
                onClose()
                router.push(`/join?id=${queueId}`)
              }, 2000)
              return
            }
          } catch {
            // If not a URL, treat the whole string as queue ID
            setTimeout(() => {
              stopCamera()
              onClose()
              router.push(`/join?id=${code.data}`)
            }, 2000)
            return
          }
        }
      }

      if (scanning) {
        requestAnimationFrame(scan)
      }
    }

    scan()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-sm mx-4 bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h2>
          <p className="text-sm sm:text-base text-gray-600">Point your camera at the queue QR code</p>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-8 sm:py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6"
            >
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">QR Code Found!</h3>
            <p className="text-sm sm:text-base text-gray-600">Redirecting you to the queue...</p>
          </div>
        ) : noQrFound ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No QR Code Found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Please make sure the QR code is clearly visible and try again.</p>
            <button
              onClick={() => {
                setNoQrFound(false)
                setLoading(false)
                startCamera()
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 sm:h-64 bg-gray-100 rounded-2xl object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-32 sm:w-48 sm:h-48 border-2 border-white/50 rounded-2xl"></div>
                <motion.div
                  animate={{ y: [0, 120, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 left-2 right-2 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                />
                
                {/* Corner indicators */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 sm:mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Scanning...</span>
          </div>
          <p className="text-xs text-gray-500 px-2">
            Make sure the QR code is clearly visible and well-lit
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}