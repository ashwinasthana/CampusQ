'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle } from 'lucide-react'

export default function SecurityAlert() {
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    // Monitor for security violations in console
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args.join(' ')
      if (message.includes('CSP') || message.includes('security') || message.includes('blocked')) {
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 5000)
      }
      originalConsoleError.apply(console, args)
    }

    // Monitor for suspicious activity
    const checkSuspiciousActivity = () => {
      // Check for developer tools
      if (window.outerHeight - window.innerHeight > 200 || 
          window.outerWidth - window.innerWidth > 200) {
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      }
    }

    const interval = setInterval(checkSuspiciousActivity, 5000)

    return () => {
      console.error = originalConsoleError
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <div className="font-semibold">Security Alert</div>
            <div className="text-sm opacity-90">
              Suspicious activity detected. This incident has been logged.
            </div>
          </div>
          <Shield className="w-5 h-5 flex-shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}