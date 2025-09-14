'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, QrCode, Settings, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SERVICE_CATEGORIES } from '@/lib/types'

export default function CreateQueuePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    category: '' as keyof typeof SERVICE_CATEGORIES,
    estimatedTimePerPerson: 5
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.category) return

    setIsCreating(true)
    
    try {
      const response = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          estimatedTimePerPerson: formData.estimatedTimePerPerson
        })
      })

      const queue = await response.json()
      router.push(`/queue/${queue.id}`)
    } catch (error) {
      console.error('Failed to create queue:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="relative p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl">
            <div className="text-center mb-8 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
                Create New Queue
              </h1>
              <p className="text-gray-600 text-base sm:text-lg px-4">
                Set up a queue for your service counter
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 sm:mb-3 text-gray-700">Queue Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Main Library Counter"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 sm:mb-4 text-gray-700">Service Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
                    <motion.button
                      key={key}
                      type="button"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData({ ...formData, category: key as keyof typeof SERVICE_CATEGORIES })}
                      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                        formData.category === key
                          ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-500/25'
                          : 'border-gray-200 bg-white/80 hover:border-blue-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{category.icon}</div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 sm:mb-3 text-gray-700">
                  <Clock className="w-4 h-4 inline mr-2 text-blue-600" />
                  Estimated Time per Person (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.estimatedTimePerPerson}
                  onChange={(e) => setFormData({ ...formData, estimatedTimePerPerson: parseInt(e.target.value) })}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm sm:text-base"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isCreating || !formData.title || !formData.category}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                    />
                    Creating Queue...
                  </div>
                ) : (
                  'Create Queue & Generate QR Code'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}