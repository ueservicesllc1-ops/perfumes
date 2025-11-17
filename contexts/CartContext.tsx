'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Perfume } from '@/lib/firebase/perfumes'

export interface CartItem extends Perfume {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (perfume: Perfume, quantity?: number) => { success: boolean; message?: string }
  removeFromCart: (perfumeId: string) => void
  updateQuantity: (perfumeId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  minimumOrderAmount: number
  meetsMinimumOrder: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'arabiyat-cart'
const MINIMUM_ORDER_AMOUNT = 500 // Mínimo de compra en dólares

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Cargar carrito guardado al montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedItems = JSON.parse(saved)
        setItems(parsedItems)
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    }
    setMounted(true)
  }, [])

  // Guardar carrito cuando cambia
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Error saving cart:', error)
      }
    }
  }, [items, mounted])

  const addToCart = (perfume: Perfume, quantity: number = 1): { success: boolean; message?: string } => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === perfume.id)
      
      if (existingItem) {
        // Si ya existe, aumentar cantidad
        return prevItems.map((item) =>
          item.id === perfume.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Si no existe, agregar nuevo item con la cantidad especificada
        return [...prevItems, { ...perfume, quantity }]
      }
    })
    setIsOpen(true) // Abrir carrito al agregar
    return { success: true }
  }

  const removeFromCart = (perfumeId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== perfumeId))
  }

  const updateQuantity = (perfumeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(perfumeId)
      return
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === perfumeId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const meetsMinimumOrder = totalPrice >= MINIMUM_ORDER_AMOUNT

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((prev) => !prev)

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    minimumOrderAmount: MINIMUM_ORDER_AMOUNT,
    meetsMinimumOrder,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

