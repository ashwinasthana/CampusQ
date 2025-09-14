import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { Queue, SERVICE_CATEGORIES } from '@/lib/types'
import { sanitizeInput, generateSecureId } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const { title, category, estimatedTimePerPerson } = await request.json()

    if (!title || !category || !SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES]) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const queueId = generateSecureId()
    
    const queue: Queue = {
      id: queueId,
      title: sanitizeInput(title),
      category,
      services: [...SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES].services],
      items: [],
      isActive: true,
      createdAt: Date.now(),
      estimatedTimePerPerson: estimatedTimePerPerson || 5
    }

    const createdQueue = await storage.createQueue(queue)
    return NextResponse.json(createdQueue)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create queue' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const queue = await storage.getQueue(sanitizeInput(id))
      if (!queue) {
        return NextResponse.json({ error: 'Queue not found' }, { status: 404 })
      }
      return NextResponse.json(queue)
    }

    const queues = await storage.getAllQueues()
    return NextResponse.json(queues)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch queues' }, { status: 500 })
  }
}