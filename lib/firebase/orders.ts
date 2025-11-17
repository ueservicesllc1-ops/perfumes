import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  orderBy,
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

