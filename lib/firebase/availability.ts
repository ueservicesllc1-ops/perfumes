import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from './config'

export interface AvailableSlot {
  id?: string
  date: string // YYYY-MM-DD format
  time: string // HH:MM format
  available: boolean
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export async function getAvailableSlots(): Promise<AvailableSlot[]> {
  try {
    const availabilityRef = collection(db, 'availability')
    // Intentar ordenar por date y time, pero si falla (por ejemplo, si no hay índice), obtener todos sin ordenar
    let querySnapshot
    try {
      const q = query(availabilityRef, orderBy('date'), orderBy('time'))
      querySnapshot = await getDocs(q)
    } catch (orderError) {
      // Si falla el ordenamiento (por ejemplo, si no hay índice), obtener todos sin ordenar
      console.warn('Error al ordenar slots por date y time (posiblemente falta índice). Obteniendo sin ordenar.')
      querySnapshot = await getDocs(availabilityRef)
    }
    
    const slots = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AvailableSlot[]
    
    // Ordenar en el cliente si es necesario
    return slots.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return a.time.localeCompare(b.time)
    })
  } catch (error) {
    console.error('Error getting available slots:', error)
    throw error
  }
}

export async function addAvailableSlot(slot: Omit<AvailableSlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db, 'availability'), {
      ...slot,
      available: true,
      createdAt: now,
      updatedAt: now
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding available slot:', error)
    throw error
  }
}

export async function updateAvailableSlot(id: string, slot: Partial<AvailableSlot>): Promise<void> {
  try {
    const slotRef = doc(db, 'availability', id)
    await updateDoc(slotRef, {
      ...slot,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error updating available slot:', error)
    throw error
  }
}

export async function deleteAvailableSlot(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'availability', id))
  } catch (error) {
    console.error('Error deleting available slot:', error)
    throw error
  }
}

export async function getAvailableSlotsByDate(date: string): Promise<AvailableSlot[]> {
  try {
    const availabilityRef = collection(db, 'availability')
    // Intentar ordenar por date y time, pero si falla (por ejemplo, si no hay índice), obtener todos sin ordenar
    let querySnapshot
    try {
      const q = query(availabilityRef, orderBy('date'), orderBy('time'))
      querySnapshot = await getDocs(q)
    } catch (orderError) {
      // Si falla el ordenamiento (por ejemplo, si no hay índice), obtener todos sin ordenar
      console.warn('Error al ordenar slots por date y time (posiblemente falta índice). Obteniendo sin ordenar.')
      querySnapshot = await getDocs(availabilityRef)
    }
    
    const slots = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AvailableSlot[]
    
    // Filtrar por fecha y disponibilidad, luego ordenar en el cliente
    const filteredSlots = slots.filter(slot => slot.date === date && slot.available)
    return filteredSlots.sort((a, b) => a.time.localeCompare(b.time))
  } catch (error) {
    console.error('Error getting available slots by date:', error)
    throw error
  }
}

