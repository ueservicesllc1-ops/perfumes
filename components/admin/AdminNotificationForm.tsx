'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Notification } from '@/lib/firebase/notifications'
import { createNotification } from '@/lib/firebase/notifications'

interface AdminNotificationFormProps {
  notification: Notification | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminNotificationForm({ notification, onClose, onSuccess }: AdminNotificationFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    userId: '', // Si está vacío, es global
  })

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title || '',
        message: notification.message || '',
        type: notification.type || 'info',
        userId: notification.userId || '',
      })
    }
  }, [notification])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await createNotification({
        title: formData.title,
        message: formData.message,
        type: formData.type,
        userId: formData.userId.trim() || undefined, // Si está vacío, es global
      })

      onSuccess()
    } catch (error: any) {
      alert('Error al crear notificación: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: '#D4AF37' }}>
        {notification ? 'Editar Notificación' : 'Nueva Notificación'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
            Título
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444' }}
            placeholder="Ej: Nueva oferta disponible"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
            Mensaje
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444', resize: 'vertical' }}
            placeholder="Escribe el mensaje que quieres enviar a los usuarios..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
            Tipo
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444' }}
          >
            <option value="info">Info</option>
            <option value="success">Éxito</option>
            <option value="warning">Advertencia</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
            ID de Usuario (opcional)
          </label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444' }}
            placeholder="Dejar vacío para enviar a todos los usuarios"
          />
          <p className="text-xs mt-1" style={{ color: '#999' }}>
            Si dejas este campo vacío, la notificación se enviará a todos los usuarios (global).
            Si ingresas un ID de usuario, solo ese usuario recibirá la notificación.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <motion.button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg font-medium"
            style={{ backgroundColor: '#2a2a2a', color: '#D4AF37', border: '1px solid #444' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 rounded-lg font-medium"
            style={{ 
              backgroundColor: loading ? '#666' : '#D4AF37', 
              color: '#000000',
              opacity: loading ? 0.6 : 1
            }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Enviando...' : 'Enviar Notificación'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

