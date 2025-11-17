'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { addAvailableSlot, updateAvailableSlot } from '@/lib/firebase/availability'
import type { AvailableSlot } from '@/lib/firebase/availability'

interface AdminAvailabilityFormProps {
  slot?: AvailableSlot | null
  onClose: () => void
  onSuccess: () => void
}

export default function AdminAvailabilityForm({
  slot,
  onClose,
  onSuccess
}: AdminAvailabilityFormProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [available, setAvailable] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slot) {
      setDate(slot.date)
      setTime(slot.time)
      setAvailable(slot.available)
    } else {
      // Set default to today
      const today = new Date()
      setDate(today.toISOString().split('T')[0])
      setTime('09:00')
    }
  }, [slot])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (slot?.id) {
        await updateAvailableSlot(slot.id, { date, time, available })
      } else {
        await addAvailableSlot({ date, time, available })
      }
      onSuccess()
    } catch (error: any) {
      console.error('Error saving slot:', error)
      setError(error.message || 'Error al guardar el horario')
    } finally {
      setSubmitting(false)
    }
  }

  // Generate time options
  const timeOptions = []
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeOptions.push(timeStr)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: '#D4AF37' }}>
        {slot ? 'Editar Horario' : 'Nuevo Horario'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 rounded-lg text-sm"
            style={{ 
              backgroundColor: '#2a2a2a', 
              color: '#FFFFFF',
              border: '1px solid #444'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
            Hora
          </label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg text-sm"
            style={{ 
              backgroundColor: '#2a2a2a', 
              color: '#FFFFFF',
              border: '1px solid #444'
            }}
          >
            {timeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: '#D4AF37' }}
            />
            <span className="text-sm" style={{ color: '#F8F5EF' }}>
              Disponible
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#ef4444' }}>
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <motion.button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2 rounded-lg font-medium transition-all"
            style={{ 
              backgroundColor: '#D4AF37', 
              color: '#000000',
              opacity: submitting ? 0.6 : 1
            }}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
          >
            {submitting ? 'Guardando...' : 'Guardar'}
          </motion.button>
          <motion.button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={{ backgroundColor: '#2a2a2a', color: '#D4AF37', border: '1px solid #444' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancelar
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

