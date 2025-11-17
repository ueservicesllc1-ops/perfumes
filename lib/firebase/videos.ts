import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { db } from "./config";

export interface Video {
  id?: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const VIDEOS_COLLECTION = "videos";

// Obtener todos los videos
export async function getAllVideos(): Promise<Video[]> {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    // Intentar ordenar por order, pero si falla, obtener todos sin ordenar
    let querySnapshot;
    try {
      const q = query(videosRef, orderBy("order", "asc"));
      querySnapshot = await getDocs(q);
    } catch (orderError) {
      // Si falla el ordenamiento (por ejemplo, si no hay índice), obtener todos sin ordenar
      querySnapshot = await getDocs(videosRef);
    }
    
    const videos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Video[];
    
    // Ordenar en el cliente si es necesario
    return videos.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error getting videos:", error);
    throw error;
  }
}

// Obtener un video por ID
export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const videoRef = doc(db, VIDEOS_COLLECTION, id);
    const videoSnap = await getDoc(videoRef);
    
    if (videoSnap.exists()) {
      return {
        id: videoSnap.id,
        ...videoSnap.data(),
        createdAt: videoSnap.data().createdAt?.toDate(),
        updatedAt: videoSnap.data().updatedAt?.toDate(),
      } as Video;
    }
    return null;
  } catch (error) {
    console.error("Error getting video:", error);
    throw error;
  }
}

// Agregar un nuevo video
export async function addVideo(video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const videosRef = collection(db, VIDEOS_COLLECTION);
    
    // Filtrar campos undefined (Firestore no los acepta)
    const cleanData: any = {
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    Object.keys(video).forEach((key) => {
      const value = (video as any)[key];
      if (value !== undefined && value !== null) {
        cleanData[key] = value;
      }
    });
    
    const docRef = await addDoc(videosRef, cleanData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding video:", error);
    throw error;
  }
}

// Actualizar un video
export async function updateVideo(id: string, video: Partial<Video>): Promise<void> {
  try {
    const videoRef = doc(db, VIDEOS_COLLECTION, id);
    
    // Filtrar campos undefined (Firestore no los acepta)
    const cleanData: any = {
      updatedAt: Timestamp.now(),
    };
    
    Object.keys(video).forEach((key) => {
      const value = (video as any)[key];
      if (value !== undefined && value !== null) {
        cleanData[key] = value;
      }
    });
    
    await updateDoc(videoRef, cleanData);
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
}

// Eliminar un video
export async function deleteVideo(id: string): Promise<void> {
  try {
    const videoRef = doc(db, VIDEOS_COLLECTION, id);
    await deleteDoc(videoRef);
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
}

