'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { addAvailableSlot } from '@/lib/firebase/availability'
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

  // Generate hourly time ranges (9-10, 10-11, 11-12, etc.)
  const generateTimeSlots = () => {
    const ranges: string[] = []
    for (let hour = 9; hour < 18; hour++) {
      const range = `${hour}-${hour + 1}`
      ranges.push(range)
    }
    return ranges
  }

  const allTimeSlots = generateTimeSlots()

  // Convert range to time format for storage (e.g., "9-10" -> "09:00")
  const rangeToTime = (range: string) => {
    const hour = parseInt(range.split('-')[0])
    return `${hour.toString().padStart(2, '0')}:00`
  }

  // Convert time to range format (e.g., "09:00" -> "9-10")
  const timeToRange = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    return `${hour}-${hour + 1}`
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
    
    // Load existing times for this date and convert to ranges
    const existingSlots = slots.filter(slot => slot.date === dateStr && slot.available)
    const existingRanges = existingSlots.map(slot => timeToRange(slot.time))
    // Remove duplicates and sort
    setSelectedTimes(Array.from(new Set(existingRanges)).sort())
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

  const isTimeExisting = (range: string) => {
    if (!selectedDate) return false
    const time = rangeToTime(range)
    return slots.some(slot => slot.date === selectedDate && slot.time === time)
  }

  async function handleSaveTimes() {
    if (!selectedDate || selectedTimes.length === 0) return

    setSaving(true)
    try {
      // Get existing slots for this date
      const existingSlots = slots.filter(slot => slot.date === selectedDate)
      const existingRanges = existingSlots.map(slot => timeToRange(slot.time))
      const existingTimes = existingSlots.map(slot => slot.time)

      // Convert selected ranges to times
      const selectedTimesConverted = selectedTimes.map(range => rangeToTime(range))

      // Add new slots
      for (const range of selectedTimes) {
        const time = rangeToTime(range)
        if (!existingTimes.includes(time)) {
          await addAvailableSlot({
            date: selectedDate,
            time,
            available: true
          })
        }
      }

      // Delete slots that are no longer selected
      for (const slot of existingSlots) {
        const slotRange = timeToRange(slot.time)
        if (!selectedTimes.includes(slotRange) && slot.id) {
          await onDelete(slot.id)
        }
      }

      await onRefresh()
      alert('Horarios guardados exitosamente')
    } catch (error) {
      console.error('Error saving times:', error)
      alert('Error al guardar los horarios')
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
              {allTimeSlots.map(range => {
                const isSelected = isTimeSelected(range)
                const isExisting = isTimeExisting(range)

                return (
                  <motion.button
                    key={range}
                    type="button"
                    onClick={() => toggleTime(range)}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-all"
                    style={
                      isSelected
                        ? {
                            backgroundColor: '#D4AF37',
                            color: '#000000',
                            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
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
                    {range}
                  </motion.button>
                )
              })}
            </div>

            {/* Save Button */}
            <motion.button
              onClick={handleSaveTimes}
              disabled={saving || selectedTimes.length === 0}
              className="w-full py-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: saving || selectedTimes.length === 0 ? '#666' : '#D4AF37',
                color: '#000000',
                opacity: saving || selectedTimes.length === 0 ? 0.6 : 1
              }}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
            >
              {saving ? 'Guardando...' : `Guardar ${selectedTimes.length} hora${selectedTimes.length !== 1 ? 's' : ''}`}
            </motion.button>
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
