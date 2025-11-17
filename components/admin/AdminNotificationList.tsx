'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Notification } from '@/lib/firebase/notifications'

interface AdminNotificationListProps {
  notifications: Notification[]
  onEdit: (notification: Notification) => void
  onRefresh: () => void
}

export default function AdminNotificationList({ notifications, onEdit, onRefresh }: AdminNotificationListProps) {
  function formatDate(date: Date | any): string {
    if (!date) return ''
    let d: Date
    if (date.toDate) {
      d = date.toDate()
    } else if (date instanceof Date) {
      d = date
    } else if (typeof date === 'object' && date.seconds) {
      d = new Date(date.seconds * 1000)
    } else {
      d = new Date(date)
    }
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getTypeColor(type: string): string {
    switch (type) {
      case 'info': return '#3B82F6'
      case 'success': return '#10B981'
      case 'warning': return '#F59E0B'
      case 'error': return '#EF4444'
      default: return '#999'
    }
  }

  function getTypeLabel(type: string): string {
    switch (type) {
      case 'info': return 'Info'
      case 'success': return 'Éxito'
      case 'warning': return 'Advertencia'
      case 'error': return 'Error'
      default: return 'General'
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <p style={{ color: '#999' }}>No hay notificaciones enviadas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          className="p-3 rounded-lg"
          style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
          whileHover={{ backgroundColor: '#333' }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
                  {notification.title}
                </h4>
                {notification.type && (
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: getTypeColor(notification.type) + '20',
                      color: getTypeColor(notification.type)
                    }}
                  >
                    {getTypeLabel(notification.type)}
                  </span>
                )}
              </div>
              <p className="text-xs mb-2 line-clamp-2" style={{ color: '#ccc' }}>
                {notification.message}
              </p>
              <div className="flex items-center gap-3 text-xs" style={{ color: '#999' }}>
                {notification.userId ? (
                  <span>Usuario: {notification.userId.substring(0, 8)}...</span>
                ) : (
                  <span>Global (todos los usuarios)</span>
                )}
                {notification.createdAt && (
                  <span>• {formatDate(notification.createdAt)}</span>
                )}
              </div>
            </div>

            <motion.button
              onClick={() => onEdit(notification)}
              className="px-3 py-1.5 rounded text-xs font-medium flex-shrink-0"
              style={{ backgroundColor: '#D4AF37', color: '#000000' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

