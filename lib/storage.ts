import { supabase } from './supabase'
import { Queue, QueueItem } from './types'
import { sanitizeLog } from './security'

export const storage = {
  createQueue: async (queue: Queue): Promise<Queue> => {
    const { data, error } = await supabase
      .from('queues')
      .insert([{
        id: queue.id,
        title: queue.title,
        category: queue.category,
        services: queue.services,
        items: queue.items,
        isActive: queue.isActive,
        createdAt: queue.createdAt,
        estimatedTimePerPerson: queue.estimatedTimePerPerson
      }])
      .select()
      .single()
    
    if (error) {
      console.error('Supabase error:', sanitizeLog(error?.message || 'Unknown error'))
      throw error
    }
    return {
      ...data,
      items: data.items || []
    }
  },

  getQueue: async (id: string): Promise<Queue | null> => {
    const { data, error } = await supabase
      .from('queues')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Get queue error:', sanitizeLog(error?.message || 'Unknown error'))
      return null
    }
    
    return {
      ...data,
      items: data.items || []
    }
  },

  updateQueue: async (id: string, updates: Partial<Queue>): Promise<Queue | null> => {
    const { data, error } = await supabase
      .from('queues')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) return null
    return data
  },

  addToQueue: async (queueId: string, item: QueueItem): Promise<Queue | null> => {
    const queue = await storage.getQueue(queueId)
    if (!queue) return null

    const newItem = { 
      ...item, 
      position: queue.items.length + 1,
      timestamp: Date.now()
    }
    const updatedItems = [...queue.items, newItem]
    
    const { data, error } = await supabase
      .from('queues')
      .update({ items: updatedItems })
      .eq('id', queueId)
      .select()
      .single()
    
    if (error) return null
    return { ...data, items: data.items || [] }
  },

  removeFromQueue: async (queueId: string, itemId: string): Promise<Queue | null> => {
    const queue = await storage.getQueue(queueId)
    if (!queue) return null

    const updatedItems = queue.items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, position: index + 1 }))
    
    const { data, error } = await supabase
      .from('queues')
      .update({ items: updatedItems })
      .eq('id', queueId)
      .select()
      .single()
    
    if (error) return null
    return { ...data, items: data.items || [] }
  },

  deleteQueue: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('queues')
      .delete()
      .eq('id', id)
    
    return !error
  },

  getAllQueues: async (): Promise<Queue[]> => {
    const { data, error } = await supabase
      .from('queues')
      .select('*')
    
    if (error) return []
    return data.map(queue => ({ ...queue, items: queue.items || [] }))
  }
}