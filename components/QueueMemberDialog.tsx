'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { QueueItem } from '@/lib/types'
import { X } from 'lucide-react'

interface QueueMemberDialogProps {
  member: QueueItem
  children: React.ReactNode
}

export default function QueueMemberDialog({ member, children }: QueueMemberDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600"><strong>Service:</strong> {member.service}</p>
                  {member.details && <p className="text-sm text-gray-600"><strong>Details:</strong> {member.details}</p>}
                  <p className="text-sm text-gray-600"><strong>Position:</strong> {member.position}</p>
                  <p className="text-sm text-gray-600"><strong>Joined:</strong> {new Date(member.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
