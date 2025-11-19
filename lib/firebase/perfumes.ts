import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "./config";

export interface Perfume {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  costPrice?: number; // Precio de costo (solo para cálculos internos, no se muestra al público)
  category: 'For Her' | 'For Him' | 'For Both';
  brand?: string;
  size?: string;
  inStock: boolean;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PERFUMES_COLLECTION = "perfumes";

// Obtener todos los perfumes
export async function getAllPerfumes(): Promise<Perfume[]> {
  try {
    const perfumesRef = collection(db, PERFUMES_COLLECTION);
    const q = query(perfumesRef, orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Perfume[];
  } catch (error) {
    console.error("Error getting perfumes:", error);
    throw error;
  }
}

// Obtener perfumes por categoría
export async function getPerfumesByCategory(category: string): Promise<Perfume[]> {
  try {
    const perfumesRef = collection(db, PERFUMES_COLLECTION);
    // Solo filtrar por categoría, ordenar en el cliente para evitar necesidad de índice compuesto
    const q = query(
      perfumesRef, 
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    
    const perfumes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Perfume[];
    
    // Ordenar por nombre en el cliente
    return perfumes.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error getting perfumes by category:", error);
    throw error;
  }
}

// Obtener un perfume por ID
export async function getPerfumeById(id: string): Promise<Perfume | null> {
  try {
    const perfumeRef = doc(db, PERFUMES_COLLECTION, id);
    const perfumeSnap = await getDoc(perfumeRef);
    
    if (perfumeSnap.exists()) {
      return {
        id: perfumeSnap.id,
        ...perfumeSnap.data(),
        createdAt: perfumeSnap.data().createdAt?.toDate(),
        updatedAt: perfumeSnap.data().updatedAt?.toDate(),
      } as Perfume;
    }
    return null;
  } catch (error) {
    console.error("Error getting perfume:", error);
    throw error;
  }
}

// Agregar un nuevo perfume
export async function addPerfume(perfume: Omit<Perfume, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const perfumesRef = collection(db, PERFUMES_COLLECTION);
    
    // Filtrar campos undefined (Firestore no los acepta)
    const cleanData: any = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    Object.keys(perfume).forEach((key) => {
      const value = (perfume as any)[key];
      if (value !== undefined && value !== null) {
        cleanData[key] = value;
      }
    });
    
    const docRef = await addDoc(perfumesRef, cleanData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding perfume:", error);
    throw error;
  }
}

// Actualizar un perfume
export async function updatePerfume(id: string, perfume: Partial<Perfume>): Promise<void> {
  try {
    const perfumeRef = doc(db, PERFUMES_COLLECTION, id);
    
    // Filtrar campos undefined (Firestore no los acepta)
    const cleanData: any = {
      updatedAt: Timestamp.now(),
    };
    
    Object.keys(perfume).forEach((key) => {
      const value = (perfume as any)[key];
      if (value !== undefined && value !== null) {
        cleanData[key] = value;
      }
    });
    
    await updateDoc(perfumeRef, cleanData);
  } catch (error) {
    console.error("Error updating perfume:", error);
    throw error;
  }
}

// Eliminar un perfume
export async function deletePerfume(id: string): Promise<void> {
  try {
    const perfumeRef = doc(db, PERFUMES_COLLECTION, id);
    await deleteDoc(perfumeRef);
  } catch (error) {
    console.error("Error deleting perfume:", error);
    throw error;
  }
}

