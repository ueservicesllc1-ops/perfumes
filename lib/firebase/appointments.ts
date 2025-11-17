import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where, Timestamp } from 'firebase/firestore'
import type { Timestamp as FirestoreTimestamp } from 'firebase/firestore'
import { db } from './config'

export interface Appointment {
  id?: string
  userId?: string
  name: string
  email: string
  phone: string
  date: string // YYYY-MM-DD format
  time: string // HH:MM format
  notes?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt?: Date | FirestoreTimestamp | any
  updatedAt?: Date | FirestoreTimestamp | any
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
  try {
    const now = Timestamp.now()
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointment,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating appointment:', error)
    throw error
  }
}

// Obtener citas de un usuario
export async function getUserAppointments(userId: string): Promise<Appointment[]> {
  try {
    const appointmentsRef = collection(db, 'appointments')
    const q = query(
      appointmentsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    // Ordenar por fecha y luego por hora manualmente
    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt,
    })) as Appointment[]
    
    // Ordenar por fecha (desc) y luego por hora (desc)
    return appointments.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date) // Fecha descendente
      }
      return b.time.localeCompare(a.time) // Hora descendente
    })
  } catch (error) {
    console.error('Error getting user appointments:', error)
    throw error
  }
}

export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    const q = query(collection(db, 'appointments'), orderBy('date'), orderBy('time'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[]
  } catch (error) {
    console.error('Error getting appointments:', error)
    throw error
  }
}

export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  try {
    const q = query(
      collection(db, 'appointments'),
      where('date', '==', date),
      orderBy('time')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[]
  } catch (error) {
    console.error('Error getting appointments by date:', error)
    throw error
  }
}

export async function updateAppointment(id: string, appointment: Partial<Appointment>): Promise<void> {
  try {
    const appointmentRef = doc(db, 'appointments', id)
    await updateDoc(appointmentRef, {
      ...appointment,
      updatedAt: Timestamp.now()
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    throw error
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'appointments', id))
  } catch (error) {
    console.error('Error deleting appointment:', error)
    throw error
  }
}

