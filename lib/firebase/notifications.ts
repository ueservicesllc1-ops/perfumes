import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  doc
} from "firebase/firestore";
import type { Timestamp as FirestoreTimestamp } from "firebase/firestore";
import { db } from "./config";

export interface Notification {
  id?: string;
  userId?: string; // Si es null, es un mensaje global para todos los usuarios
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
  createdAt?: Date | FirestoreTimestamp | any;
  updatedAt?: Date | FirestoreTimestamp | any;
}

const NOTIFICATIONS_COLLECTION = "notifications";

// Crear una notificación (admin)
export async function createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'read'>): Promise<string> {
  try {
    const notificationRef = collection(db, NOTIFICATIONS_COLLECTION);
    const now = Timestamp.now();
    const newNotification = {
      ...notification,
      read: false,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await addDoc(notificationRef, newNotification);
    return docRef.id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Obtener notificaciones de un usuario (incluye globales y personales)
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
    
    // Obtener notificaciones globales (userId es null) y personales del usuario
    const q = query(
      notificationsRef,
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    // Filtrar en memoria: globales (userId null) o personales del usuario
    const notifications = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt,
      }))
      .filter((notif: any) => !notif.userId || notif.userId === userId) as Notification[];
    
    return notifications;
  } catch (error) {
    console.error("Error getting user notifications:", error);
    throw error;
  }
}

// Marcar notificación como leída
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notificationRef, {
      read: true,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

// Marcar todas las notificaciones de un usuario como leídas
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const notifications = await getUserNotifications(userId);
    const unreadNotifications = notifications.filter(n => !n.read);
    
    const updatePromises = unreadNotifications.map(n => {
      if (n.id) {
        return markNotificationAsRead(n.id);
      }
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

// Obtener todas las notificaciones (admin)
export async function getAllNotifications(): Promise<Notification[]> {
  try {
    const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt,
    })) as Notification[];
  } catch (error) {
    console.error("Error getting all notifications:", error);
    throw error;
  }
}

// Obtener contador de notificaciones no leídas
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const notifications = await getUserNotifications(userId);
    return notifications.filter(n => !n.read).length;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

