'use client'

import QRCode from 'qrcode.react'
import { motion } from 'framer-motion'
import { Download, Printer, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface QRCodeDisplayProps {
  queueId: string
  title: string
}

export default function QRCodeDisplay({ queueId, title }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const queueUrl = `${window.location.origin}/join?id=${queueId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(queueUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = queueUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePrint = async () => {
    try {
      const QRCode = await import('qrcode')
      const dataUrl = await QRCode.toDataURL(queueUrl, { width: 300, margin: 2 })
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        const sanitizedTitle = title.replace(/[<>"'&]/g, (match) => {
          const entities: { [key: string]: string } = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '&': '&amp;'
          }
          return entities[match] || match
        })
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Queue QR Code - ${sanitizedTitle}</title>
              <style>
                @media print {
                  body { margin: 0; padding: 20px; }
                }
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 40px;
                  background: white;
                }
                .qr-container { 
                  margin: 30px 0; 
                  display: inline-block;
                  padding: 20px;
                  border: 2px solid #333;
                  background: white;
                }
                h1 { 
                  color: #333; 
                  margin-bottom: 20px; 
                  font-size: 32px; 
                  font-weight: bold;
                }
                p { 
                  color: #666; 
                  margin-bottom: 20px; 
                  font-size: 18px; 
                }
                .url { 
                  font-size: 14px;
                  word-break: break-all;
                  margin-top: 30px;
                  color: #333;
                }
                img { 
                  display: block;
                  margin: 0 auto;
                }
              </style>
            </head>
            <body>
              <h1>${sanitizedTitle}</h1>
              <p>Scan this QR code to join the queue</p>
              <div class="qr-container">
                <img src="${dataUrl}" alt="QR Code" width="300" height="300" />
              </div>
              <p class="url"><strong>Or visit:</strong><br/>${queueUrl}</p>
              <script>
                window.onload = () => {
                  setTimeout(() => {
                    window.print()
                    window.close()
                  }, 500)
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    } catch (error) {
      console.error('Print failed:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl text-center"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900">Queue QR Code</h3>
      
      <div className="bg-white p-6 rounded-xl inline-block mb-6 shadow-sm">
        <div className="qr-code-svg">
          <QRCode
            value={queueUrl}
            size={200}
            level="M"
            includeMargin={true}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Students can scan this QR code to join your queue
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="px-4 py-2 bg-white/80 border border-gray-200 text-gray-900 font-medium rounded-xl hover:bg-white transition-all flex items-center"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="px-4 py-2 bg-white/80 border border-gray-200 text-gray-900 font-medium rounded-xl hover:bg-white transition-all flex items-center"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}