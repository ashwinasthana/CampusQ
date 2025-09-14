'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Queue, QueueItem, PATIENCE_QUOTES } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function JoinQueuePage() {
  const searchParams = useSearchParams()
  const queueId = searchParams.get('id')
  const [queue, setQueue] = useState<Queue | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [userItem, setUserItem] = useState<QueueItem | null>(null)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    details: ''
  })

  useEffect(() => {
    if (queueId) {
      fetchQueue()
      
      // Set up real-time subscription for queue changes
      const subscription = supabase
        .channel('queue-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'queues',
            filter: `id=eq.${queueId}`
          },
          (payload) => {
            console.log('Queue update:', payload)
            if (payload.eventType === 'DELETE') {
              // Queue was closed, redirect after a moment
              setTimeout(() => {
                window.location.href = '/'
              }, 2000)
            } else {
              // Queue was updated, refresh data
              fetchQueue()
            }
          }
        )
        .subscribe()
      
      // Fallback polling
      const interval = setInterval(fetchQueue, 5000)
      
      // Cleanup check
      const runCleanup = async () => {
        try {
          await fetch('/api/cleanup', { method: 'POST' })
        } catch (error) {
          console.error('Cleanup check failed:', error)
        }
      }
      runCleanup()
      
      return () => {
        clearInterval(interval)
        supabase.removeChannel(subscription)
      }
    }
  }, [queueId])

  useEffect(() => {
    if (joined) {
      const quoteInterval = setInterval(() => {
        setCurrentQuote(prev => (prev + 1) % PATIENCE_QUOTES.length)
      }, 4000)
      return () => clearInterval(quoteInterval)
    }
  }, [joined])

  const fetchQueue = async () => {
    if (!queueId) return
    
    try {
      const response = await fetch(`/api/queue/${queueId}`)
      if (response.ok) {
        const data = await response.json()
        setQueue(data)
        
        // Update user's position if they're in queue
        if (userItem) {
          const updatedItem = data.items.find((item: QueueItem) => item.id === userItem.id)
          if (updatedItem) {
            setUserItem(updatedItem)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.service || !queueId) return

    setJoining(true)
    
    try {
      const response = await fetch(`/api/queue/${queueId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: Math.random().toString(36).substring(2, 15),
          timestamp: Date.now()
        })
      })

      if (response.ok) {
        const newItem = await response.json()
        setUserItem(newItem)
        setJoined(true)
        fetchQueue()
      }
    } catch (error) {
      console.error('Failed to join queue:', error)
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!queue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Queue Not Found</h1>
          <p className="text-gray-600 mb-6">The queue you're looking for doesn't exist or has been closed.</p>
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Go Home</Link>
        </div>
      </div>
    )
  }

  if (joined && userItem) {
    const currentPosition = queue.items.findIndex(item => item.id === userItem.id) + 1
    const estimatedWaitTime = Math.max(0, (currentPosition - 1) * queue.estimatedTimePerPerson)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl text-center"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">You're in!</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Welcome to {queue.title}
              </p>

              <div className="bg-white/80 border-2 border-blue-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-blue-600">#{currentPosition}</div>
                <div className="text-xs sm:text-sm text-gray-600">Your queue number</div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-white/80 rounded-xl p-3 sm:p-4 border border-gray-200">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl font-bold text-gray-900">{queue.items.length}</div>
                  <div className="text-xs text-gray-600">Total in queue</div>
                </div>
                <div className="bg-white/80 rounded-xl p-3 sm:p-4 border border-gray-200">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl font-bold text-gray-900">{estimatedWaitTime}m</div>
                  <div className="text-xs text-gray-600">Est. wait time</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-medium mb-2 text-gray-900">Your Request:</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  <strong>{formData.service}</strong>
                  {formData.details && (
                    <span className="block text-gray-600 mt-1">
                      {formData.details}
                    </span>
                  )}
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-base sm:text-lg font-medium text-blue-600 px-2">
                    {PATIENCE_QUOTES[currentQuote]}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 px-2">
                  This page updates automatically. Keep it open to see your progress!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm sm:max-w-md mx-auto"
        >
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{queue.category === 'library' ? '📚' : queue.category === 'canteen' ? '🍽️' : '🎓'}</div>
              <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">{queue.title}</h1>
              <p className="text-sm sm:text-base text-gray-600">
                {queue.items.length} people currently in queue
              </p>
            </div>

            <form onSubmit={handleJoinQueue} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-xl bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Service Needed</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-xl bg-white/80 border border-gray-200 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                  required
                >
                  <option value="">Select a service</option>
                  {queue.services.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Additional Details 
                  <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="e.g., Book title, order number, etc."
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-xl bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>

              <motion.button
                type="submit"
                disabled={joining || !formData.name || !formData.service}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Joining Queue...
                  </div>
                ) : (
                  'Join Queue'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}