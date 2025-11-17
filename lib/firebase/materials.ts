// Funciones para manejar material de apoyo en Firestore

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { db } from './config'

export interface Material {
  id?: string
  title: string
  description?: string
  fileUrl: string
  fileType: 'image' | 'video' | 'pdf' | 'other'
  fileName: string
  fileSize?: number
  thumbnailUrl?: string
  order?: number
  createdAt?: Date | Timestamp
  updatedAt?: Date | Timestamp
}

/**
 * Agregar nuevo material de apoyo
 */
export async function addMaterial(material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'materials'), {
      ...material,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error: any) {
    console.error('Error adding material:', error)
    throw new Error(error.message || 'Error al agregar material')
  }
}

/**
 * Obtener todos los materiales de apoyo
 */
export async function getAllMaterials(): Promise<Material[]> {
  try {
    const q = query(collection(db, 'materials'), orderBy('order', 'asc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Material[]
  } catch (error: any) {
    console.error('Error getting materials:', error)
    // Si falla el ordenamiento, intentar sin ordenar
    try {
      const querySnapshot = await getDocs(collection(db, 'materials'))
      const materials = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Material[]
      // Ordenar en el cliente
      return materials.sort((a, b) => (a.order || 0) - (b.order || 0))
    } catch (fallbackError) {
      throw new Error(error.message || 'Error al obtener materiales')
    }
  }
}

/**
 * Actualizar material de apoyo
 */
export async function updateMaterial(id: string, material: Partial<Material>): Promise<void> {
  try {
    const materialRef = doc(db, 'materials', id)
    const updateData: any = {
      ...material,
      updatedAt: Timestamp.now(),
    }
    // Eliminar campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })
    await updateDoc(materialRef, updateData)
  } catch (error: any) {
    console.error('Error updating material:', error)
    throw new Error(error.message || 'Error al actualizar material')
  }
}

/**
 * Eliminar material de apoyo
 */
export async function deleteMaterial(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'materials', id))
  } catch (error: any) {
    console.error('Error deleting material:', error)
    throw new Error(error.message || 'Error al eliminar material')
  }
}

