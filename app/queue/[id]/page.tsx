'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Clock, Download, Trash2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Queue, QueueItem } from '@/lib/types'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import CloseQueueModal from '@/components/CloseQueueModal'
import QueueMemberDialog from '@/components/QueueMemberDialog'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function QueueManagementPage() {
  const params = useParams()
  const queueId = params.id as string
  const [queue, setQueue] = useState<Queue | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCloseModal, setShowCloseModal] = useState(false)

  useEffect(() => {
    fetchQueue()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queues',
          filter: `id=eq.${queueId}`
        },
        (payload) => {
          console.log('Real-time update:', payload)
          if (payload.eventType === 'DELETE') {
            // Queue was deleted, redirect to home
            window.location.href = '/'
          } else {
            // Queue was updated, refresh data
            fetchQueue()
          }
        }
      )
      .subscribe()
    
    // Fallback polling every 5 seconds
    const interval = setInterval(fetchQueue, 5000)
    
    // Auto-cleanup check
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
  }, [queueId])

  const fetchQueue = async () => {
    try {
      const response = await fetch(`/api/queue/${queueId}`)
      if (response.ok) {
        const data = await response.json()
        setQueue(data)
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsServed = async (itemId: string) => {
    try {
      const response = await fetch(`/api/queue/${queueId}/serve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      })
      if (response.ok) {
        fetchQueue()
      }
    } catch (error) {
      console.error('Failed to mark as served:', error)
    }
  }

  const exportData = (format: 'csv' | 'json' | 'pdf') => {
    if (!queue) return

    const data = queue.items.map(item => ({
      position: item.position,
      name: item.name,
      service: item.service,
      details: item.details,
      timestamp: new Date(item.timestamp).toLocaleString()
    }))

    if (format === 'csv') {
      const csv = [
        'Position,Name,Service,Details,Timestamp',
        ...data.map(row => `${row.position},"${row.name}","${row.service}","${row.details}","${row.timestamp}"`)
      ].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `queue-${queue.title}-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `queue-${queue.title}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
    }
  }

  const closeQueue = () => {
    setShowCloseModal(true)
  }

  const handleCloseConfirm = async () => {
    try {
      await fetch(`/api/queue/${queueId}`, { method: 'DELETE' })
      window.location.href = '/'
    } catch (error) {
      console.error('Failed to close queue:', error)
    }
  }

  const handleExportAndClose = (format: 'csv' | 'json') => {
    exportData(format)
    // Give time for download
    setTimeout(() => {
      setShowCloseModal(false)
    }, 1000)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!queue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Queue Not Found</h1>
          <Link href="/" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 sm:mb-8">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <QRCodeDisplay queueId={queueId} title={queue.title} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 shadow-xl mt-4 sm:mt-6"
            >
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-900">Queue Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    People in queue
                  </span>
                  <span className="font-bold text-gray-900">{queue.items.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    Est. wait time
                  </span>
                  <span className="font-bold text-gray-900">
                    {queue.items.length * queue.estimatedTimePerPerson} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Auto-closes in
                  </span>
                  <span className="text-xs font-bold text-orange-500">
                    {Math.max(0, Math.floor((queue.createdAt + 15 * 60 * 60 * 1000 - Date.now()) / (60 * 60 * 1000)))}h {Math.max(0, Math.floor(((queue.createdAt + 15 * 60 * 60 * 1000 - Date.now()) % (60 * 60 * 1000)) / (60 * 1000)))}m
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl mt-6"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900">Export Data</h3>
              <div className="space-y-2">
                <button onClick={() => exportData('csv')} className="w-full py-3 px-4 bg-white/80 border border-gray-200 text-gray-900 font-medium rounded-xl hover:bg-white transition-all text-sm">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export as CSV
                </button>
                <button onClick={() => exportData('json')} className="w-full py-3 px-4 bg-white/80 border border-gray-200 text-gray-900 font-medium rounded-xl hover:bg-white transition-all text-sm">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export as JSON
                </button>
              </div>
              
              {queue.items.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-700 mb-2">
                    💡 Tip: Download your data before closing to avoid losing queue information!
                  </p>
                </div>
              )}
              
              <button onClick={closeQueue} className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-all">
                <Trash2 className="w-4 h-4 mr-2 inline" />
                Close Queue
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{queue.title}</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Live</span>
                </div>
              </div>

              {queue.items.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">No one in queue yet</h3>
                  <p className="text-gray-400">People will appear here when they scan your QR code</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {queue.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/80 border border-gray-200 rounded-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {item.position}
                        </div>
                        <QueueMemberDialog member={item}>
                          <div className="cursor-pointer">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.service} {item.details && `• ${item.details}`}
                            </p>
                          </div>
                        </QueueMemberDialog>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsServed(item.id)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      <CloseQueueModal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        onConfirm={handleCloseConfirm}
        onExport={handleExportAndClose}
        queueItemsCount={queue?.items.length || 0}
      />
    </div>
  )
}