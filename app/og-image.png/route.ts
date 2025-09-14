import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const imagePath = join(process.cwd(), 'public', 'og-image.png')
    const imageBuffer = readFileSync(imagePath)
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    return new NextResponse('Image not found', { status: 404 })
  }
}