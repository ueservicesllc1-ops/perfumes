'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { addAvailableSlot, updateAvailableSlot } from '@/lib/firebase/availability'
import type { AvailableSlot } from '@/lib/firebase/availability'

interface AdminAvailabilityListProps {
  slots: AvailableSlot[]
  onEdit: (slot: AvailableSlot) => void
  onDelete: (id: string) => void
  onRefresh: () => void
  onNewSlot: (date?: string) => void
}

export default function AdminAvailabilityList({
  slots,
  onEdit,
  onDelete,
  onRefresh,
  onNewSlot
}: AdminAvailabilityListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Generate hourly time slots (9, 10, 11, 12, etc.)
  const generateTimeSlots = () => {
    const hours: string[] = []
    for (let hour = 9; hour < 18; hour++) {
      hours.push(hour.toString())
    }
    return hours
  }

  const allTimeSlots = generateTimeSlots()

  // Convert hour to time format for storage (e.g., "9" -> "09:00")
  const hourToTime = (hour: string) => {
    return `${hour.padStart(2, '0')}:00`
  }

  // Convert time to hour format (e.g., "09:00" -> "9")
  const timeToHour = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    return hour.toString()
  }

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days: (number | null)[] = []
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const date = new Date(year, month, day)
    return date.toISOString().split('T')[0]
  }

  const isDateHasSlots = (day: number) => {
    if (day === null) return false
    const dateStr = getDateString(day)
    return slots.some(slot => slot.date === dateStr)
  }

  const isDateSelected = (day: number) => {
    if (day === null) return false
    const dateStr = getDateString(day)
    return selectedDate === dateStr
  }

  const isDatePast = (day: number) => {
    if (day === null) return false
    const dateStr = getDateString(day)
    const date = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleDateClick = (day: number) => {
    if (day === null || isDatePast(day)) return
    const dateStr = getDateString(day)
    setSelectedDate(dateStr)
    
    // Load existing times for this date (both available and unavailable)
    const existingSlots = slots.filter(slot => slot.date === dateStr)
    // Only show available slots as selected
    const availableSlots = existingSlots.filter(slot => slot.available)
    const existingHours = availableSlots.map(slot => timeToHour(slot.time))
    // Remove duplicates and sort numerically
    const uniqueHours = Array.from(new Set(existingHours))
      .map(h => parseInt(h, 10))
      .sort((a, b) => a - b)
      .map(h => h.toString())
    setSelectedTimes(uniqueHours)
  }

  const toggleTime = (time: string) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time)
      } else {
        return [...prev, time].sort()
      }
    })
  }

  const isTimeSelected = (time: string) => {
    return selectedTimes.includes(time)
  }

  const isTimeExisting = (hour: string) => {
    if (!selectedDate) return false
    const time = hourToTime(hour)
    return slots.some(slot => slot.date === selectedDate && slot.time === time)
  }

  const isTimeAvailable = (hour: string) => {
    if (!selectedDate) return false
    const time = hourToTime(hour)
    const slot = slots.find(slot => slot.date === selectedDate && slot.time === time)
    return slot ? slot.available : false
  }

  const getSlotId = (hour: string) => {
    if (!selectedDate) return null
    const time = hourToTime(hour)
    const slot = slots.find(slot => slot.date === selectedDate && slot.time === time)
    return slot?.id || null
  }

  async function handleSaveTimes() {
    if (!selectedDate) {
      alert('Por favor selecciona una fecha')
      return
    }

    setSaving(true)
    try {
      // Get existing slots for this date
      const existingSlots = slots.filter(slot => slot.date === selectedDate)
      const existingTimes = existingSlots.map(slot => slot.time)

      // Convert selected hours to times
      const selectedTimesConverted = selectedTimes.map(hour => hourToTime(hour))

      // Process all time slots (9-17)
      for (const hour of allTimeSlots) {
        const time = hourToTime(hour)
        const slotId = getSlotId(hour)
        const isSelected = selectedTimes.includes(hour)
        const exists = existingTimes.includes(time)

        if (isSelected) {
          // Activate or create slot
          if (exists && slotId) {
            // Update existing slot to available
            const existingSlot = existingSlots.find(s => s.id === slotId)
            if (existingSlot && !existingSlot.available) {
              await updateAvailableSlot(slotId, { available: true })
            }
          } else {
            // Create new slot
            await addAvailableSlot({
              date: selectedDate,
              time,
              available: true
            })
          }
        } else {
          // Deactivate slot (don't delete, just mark as unavailable)
          if (exists && slotId) {
            const existingSlot = existingSlots.find(s => s.id === slotId)
            if (existingSlot && existingSlot.available) {
              await updateAvailableSlot(slotId, { available: false })
            }
          }
        }
      }

      await onRefresh()
      alert('Horarios actualizados exitosamente')
    } catch (error) {
      console.error('Error saving times:', error)
      alert('Error al actualizar los horarios')
    } finally {
      setSaving(false)
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    setSelectedDate('')
    setSelectedTimes([])
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    setSelectedDate('')
    setSelectedTimes([])
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg p-4"
        style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
      >
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <h2 className="text-lg font-semibold" style={{ color: '#D4AF37' }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <motion.button
            onClick={goToNextMonth}
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#1a1a1a', color: '#D4AF37' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium py-2"
              style={{ color: '#999' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square" />
            }
            
            const hasSlots = isDateHasSlots(day)
            const selected = isDateSelected(day)
            const past = isDatePast(day)

            return (
              <motion.button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={past}
                className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                  past ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
                }`}
                style={
                  selected
                    ? {
                        backgroundColor: '#D4AF37',
                        color: '#000000',
                        boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                      }
                    : hasSlots && !past
                    ? {
                        backgroundColor: '#1a1a1a',
                        color: '#D4AF37',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }
                    : {
                        backgroundColor: '#1a1a1a',
                        color: '#666',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                }
                whileHover={!past ? { scale: 1.1 } : {}}
                whileTap={!past ? { scale: 0.9 } : {}}
              >
                {day}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Time Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="rounded-lg p-4" style={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#D4AF37' }}>
              {formatDate(selectedDate)}
            </h3>
            <p className="text-xs mb-4" style={{ color: '#999' }}>
              Selecciona las horas disponibles para esta fecha
            </p>

            {/* Time Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {allTimeSlots.map(hour => {
                const isSelected = isTimeSelected(hour)
                const isExisting = isTimeExisting(hour)
                const isAvailable = isTimeAvailable(hour)

                return (
                  <motion.button
                    key={hour}
                    type="button"
                    onClick={() => toggleTime(hour)}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-all"
                    style={
                      isSelected
                        ? {
                            backgroundColor: '#D4AF37',
                            color: '#000000',
                            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                          }
                        : isExisting && !isAvailable
                        ? {
                            backgroundColor: '#1a1a1a',
                            color: '#666',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            opacity: 0.5,
                            textDecoration: 'line-through'
                          }
                        : {
                            backgroundColor: '#1a1a1a',
                            color: '#D4AF37',
                            border: '1px solid rgba(212, 175, 55, 0.3)'
                          }
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {hour}
                  </motion.button>
                )
              })}
            </div>

            {/* Save Button */}
            <motion.button
              onClick={handleSaveTimes}
              disabled={saving}
              className="w-full py-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: saving ? '#666' : '#D4AF37',
                color: '#000000',
                opacity: saving ? 0.6 : 1
              }}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
            >
              {saving ? 'Actualizando...' : 'Actualizar Citas'}
            </motion.button>
            {selectedTimes.length > 0 && (
              <p className="text-xs text-center mt-2" style={{ color: '#999' }}>
                {selectedTimes.length} hora{selectedTimes.length !== 1 ? 's' : ''} activa{selectedTimes.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {!selectedDate && slots.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color: '#999' }}>No hay horarios disponibles configurados</p>
          <p className="text-xs mt-2" style={{ color: '#666' }}>
            Selecciona una fecha en el calendario para agregar horarios
          </p>
        </div>
      )}
    </div>
  )
}
