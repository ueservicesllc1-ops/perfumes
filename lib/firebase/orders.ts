import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  Timestamp 
} from "firebase/firestore";
import type { Timestamp as FirestoreTimestamp } from "firebase/firestore";
import { db } from "./config";

export interface OrderItem {
  perfumeId: string;
  name: string; // Cambiado de perfumeName a name para coincidir con el checkout
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface Order {
  id?: string;
  userId?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt?: Date | FirestoreTimestamp | any;
  updatedAt?: Date | FirestoreTimestamp | any;
}

const ORDERS_COLLECTION = "orders";

// Crear una nueva orden
export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const orderRef = collection(db, ORDERS_COLLECTION);
    const newOrder = {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(orderRef, newOrder);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Obtener órdenes de un usuario
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Order[];
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw error;
  }
}

// Obtener todas las órdenes (para admin)
export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    
    // Intentar con orderBy primero
    try {
      const q = query(
        ordersRef,
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[];
    } catch (orderByError: any) {
      // Si falla por falta de índice, obtener sin orderBy y ordenar en el cliente
      if (orderByError.code === 'failed-precondition' || orderByError.message?.includes('index')) {
        console.warn("Índice no encontrado, ordenando en el cliente");
        const querySnapshot = await getDocs(ordersRef);
        const orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Order[];
        
        // Ordenar por fecha de creación (más recientes primero)
        return orders.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return dateB - dateA;
        });
      }
      throw orderByError;
    }
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw error;
  }
}

// Actualizar el estado de una orden
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// Actualizar una orden completa (items, total, etc.)
export async function updateOrder(orderId: string, orderData: Partial<Order>): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const updateData: any = {
      updatedAt: Timestamp.now(),
    };
    
    // Incluir solo los campos que se proporcionaron
    if (orderData.items !== undefined) {
      updateData.items = orderData.items;
    }
    if (orderData.total !== undefined) {
      updateData.total = orderData.total;
    }
    if (orderData.status !== undefined) {
      updateData.status = orderData.status;
    }
    if (orderData.shippingInfo !== undefined) {
      updateData.shippingInfo = orderData.shippingInfo;
    }
    if (orderData.paymentMethod !== undefined) {
      updateData.paymentMethod = orderData.paymentMethod;
    }
    
    await updateDoc(orderRef, updateData);
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

