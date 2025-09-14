'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Users, Heart, Github, Linkedin, ArrowRight, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import QRScanner from '@/components/QRScanner'

export default function HomePage() {
  const [showScanner, setShowScanner] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-8"
            >
              <Zap className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Revolutionary Queue Management</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
            >
              Campus<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Q</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto px-2"
            >
              Transform your campus experience with intelligent queue management. 
              <span className="text-blue-600 font-semibold"> No more waiting in lines.</span>
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full sm:w-auto"
              >
                <Link href="/create" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="group w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center justify-center text-sm sm:text-base">
                      Create Queue
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                onClick={() => setShowScanner(true)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/70 backdrop-blur-sm border border-white/20 text-gray-700 font-semibold rounded-xl sm:rounded-2xl hover:bg-white/90 transition-all duration-300 text-sm sm:text-base"
              >
                Join Queue
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Real-time Updates</h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">Live position tracking and notifications</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">No Registration</h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">Instant access with QR code scanning</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Smart Timing</h3>
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">AI-powered wait time predictions</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-white/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center space-y-6">
            {/* Brand Section */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">CampusQ</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Revolutionizing campus queue management with intelligent, real-time solutions.
              </p>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <motion.a
                  href="https://github.com/ashwinasthana"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-gray-700" />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/ashwinasthanax/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-blue-600" />
                </motion.a>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center w-full">
              <div className="flex items-center text-gray-600 mb-4 sm:mb-0">
                <span className="text-sm">© 2024 CampusQ. All rights reserved.</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <span>Built with</span>
                <Heart className="w-4 h-4 text-red-500 mx-1" />
                <span>by</span>
                <a href="https://github.com/ashwinasthana" className="font-medium text-gray-700 hover:text-blue-600 ml-1 transition-colors">
                  Ashwin Asthana
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <AnimatePresence>
        {showScanner && (
          <QRScanner onClose={() => setShowScanner(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}