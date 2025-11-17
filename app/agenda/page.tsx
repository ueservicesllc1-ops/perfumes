'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAvailableSlotsByDate, getAvailableSlots } from '@/lib/firebase/availability'
import { createAppointment } from '@/lib/firebase/appointments'
import type { AvailableSlot } from '@/lib/firebase/availability'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme, getButtonTextColor, getIconColor } from '@/contexts/ThemeContext'
import { onAuthChange } from '@/lib/firebase/auth'
import type { User } from 'firebase/auth'

export default function AgendaPage() {
  const { t } = useLanguage()
  const { currentTheme } = useTheme()
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [allSlots, setAllSlots] = useState<AvailableSlot[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser)
      // Si el usuario está logueado, prellenar email y nombre
      if (authUser) {
        if (authUser.email) {
          setEmail(prev => prev || authUser.email || '')
        }
        if (authUser.displayName) {
          setName(prev => prev || authUser.displayName || '')
        }
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    loadAvailableSlots()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      loadSlotsForDate(selectedDate)
    } else {
      setAvailableTimes([])
      setSelectedTime('')
    }
  }, [selectedDate, allSlots])

  async function loadAvailableSlots() {
    try {
      const slots = await getAvailableSlots()
      setAllSlots(slots)
    } catch (error) {
      console.error('Error loading available slots:', error)
    }
  }

  async function loadSlotsForDate(date: string) {
    setLoading(true)
    try {
      const slots = await getAvailableSlotsByDate(date)
      // Extraer solo la hora (número) de cada slot (formato "HH:00" -> "HH")
      const hours = slots
        .map(slot => {
          // Si el formato es "HH:00", extraer solo "HH"
          const hourMatch = slot.time.match(/^(\d+):/)
          return hourMatch ? parseInt(hourMatch[1], 10) : null
        })
        .filter((hour): hour is number => hour !== null)
      
      // Eliminar duplicados y ordenar
      const uniqueHours = Array.from(new Set(hours)).sort((a, b) => a - b)
      
      // Convertir a strings para mantener consistencia con el estado
      const times = uniqueHours.map(hour => hour.toString())
      setAvailableTimes(times)
      setSelectedTime('')
    } catch (error) {
      console.error('Error loading slots for date:', error)
      setError(t('agenda.errorLoadingSlots'))
      setAvailableTimes([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (!selectedDate || !selectedTime) {
      setError(t('agenda.selectDateAndTime'))
      setSubmitting(false)
      return
    }

    try {
      // Convertir la hora seleccionada (número) al formato "HH:00" para guardar en la BD
      const timeFormatted = `${selectedTime.padStart(2, '0')}:00`
      
      await createAppointment({
        userId: user?.uid || 'guest', // Usar el ID del usuario autenticado si está logueado
        name,
        email,
        phone,
        date: selectedDate,
        time: timeFormatted,
        notes: notes || undefined
      })

      setSuccess(true)
      setName('')
      setEmail('')
      setPhone('')
      setNotes('')
      setSelectedDate('')
      setSelectedTime('')
      setAvailableTimes([])
      
      // Reload slots
      await loadAvailableSlots()
    } catch (error: any) {
      console.error('Error creating appointment:', error)
      setError(error.message || t('agenda.errorScheduling'))
    } finally {
      setSubmitting(false)
    }
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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
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

  const isDateAvailable = (day: number) => {
    if (day === null) return false
    const dateStr = getDateString(day)
    return allSlots.some(slot => slot.date === dateStr && slot.available)
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
    if (isDateAvailable(day)) {
      setSelectedDate(dateStr)
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    setSelectedDate('')
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    setSelectedDate('')
  }

  const monthNames = [
    t('agenda.months.january'), t('agenda.months.february'), t('agenda.months.march'), t('agenda.months.april'),
    t('agenda.months.may'), t('agenda.months.june'), t('agenda.months.july'), t('agenda.months.august'),
    t('agenda.months.september'), t('agenda.months.october'), t('agenda.months.november'), t('agenda.months.december')
  ]

  const dayNames = [
    t('agenda.days.sunday'), t('agenda.days.monday'), t('agenda.days.tuesday'), t('agenda.days.wednesday'),
    t('agenda.days.thursday'), t('agenda.days.friday'), t('agenda.days.saturday')
  ]

  if (success) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: currentTheme.colors.background, color: currentTheme.colors.text }}>
        <Header />
        <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: currentTheme.colors.accent }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.accent }}>
              {t('agenda.appointmentScheduled')}
            </h2>
            <p className="mb-8" style={{ color: currentTheme.colors.text }}>
              {t('agenda.appointmentSuccess')}
            </p>
            <motion.button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 rounded-lg font-medium"
              style={{ backgroundColor: currentTheme.colors.accent, color: getButtonTextColor(currentTheme.colors.accent) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('agenda.scheduleAnother')}
            </motion.button>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
      <Header />
      <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: currentTheme.colors.accent }}>
            {t('agenda.title')}
          </h1>
          <p className="text-sm text-center" style={{ color: currentTheme.colors.textSecondary }}>
            {t('agenda.subtitle')}
          </p>
        </motion.section>

        {/* Calendar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: currentTheme.colors.surface,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg"
                style={{ backgroundColor: currentTheme.colors.background, color: getIconColor(currentTheme.colors.background, currentTheme.colors.accent) }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <h2 className="text-lg font-semibold" style={{ color: currentTheme.colors.accent }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <motion.button
                onClick={goToNextMonth}
                className="p-2 rounded-lg"
                style={{ backgroundColor: currentTheme.colors.background, color: getIconColor(currentTheme.colors.background, currentTheme.colors.accent) }}
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
                  style={{ color: currentTheme.colors.textSecondary }}
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
                
                const available = isDateAvailable(day)
                const selected = isDateSelected(day)
                const past = isDatePast(day)

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    disabled={!available || past}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      !available || past ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
                    }`}
                    style={
                      selected
                        ? {
                            backgroundColor: currentTheme.colors.accent,
                            color: getButtonTextColor(currentTheme.colors.accent),
                            boxShadow: `0 2px 8px ${currentTheme.colors.accent}40`
                          }
                        : available && !past
                        ? {
                            backgroundColor: currentTheme.colors.background,
                            color: getIconColor(currentTheme.colors.background, currentTheme.colors.accent),
                            border: `1px solid ${currentTheme.colors.accent}30`
                          }
                        : {
                            backgroundColor: currentTheme.colors.background,
                            color: currentTheme.colors.textSecondary,
                            border: `1px solid ${currentTheme.colors.border}30`
                          }
                    }
                    whileHover={available && !past ? { scale: 1.1 } : {}}
                    whileTap={available && !past ? { scale: 0.9 } : {}}
                  >
                    {day}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* Available Times */}
        {selectedDate && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold mb-3" style={{ color: currentTheme.colors.accent }}>
              {t('agenda.availableTimes')}
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: currentTheme.colors.accent }}></div>
              </div>
            ) : availableTimes.length === 0 ? (
              <div
                className="rounded-lg p-4 text-center"
                style={{ backgroundColor: currentTheme.colors.surface }}
              >
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  {t('agenda.noTimesAvailable')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map(time => (
                  <motion.button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-all"
                    style={
                      selectedTime === time
                        ? {
                            backgroundColor: currentTheme.colors.accent,
                            color: getButtonTextColor(currentTheme.colors.accent),
                            boxShadow: `0 2px 8px ${currentTheme.colors.accent}40`
                          }
                        : {
                            backgroundColor: currentTheme.colors.surface,
                            color: getIconColor(currentTheme.colors.surface, currentTheme.colors.accent),
                            border: `1px solid ${currentTheme.colors.accent}30`
                          }
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Contact Form */}
        {selectedDate && selectedTime && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.accent }}>
              {t('agenda.contactInfo')}
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.accent }}>
                {t('agenda.fullName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.surface, 
                  color: currentTheme.colors.text,
                  border: `1px solid ${currentTheme.colors.accent}30`
                }}
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.accent }}>
                {t('agenda.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.surface, 
                  color: currentTheme.colors.text,
                  border: `1px solid ${currentTheme.colors.accent}30`
                }}
                placeholder="juan@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.accent }}>
                {t('agenda.phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.surface, 
                  color: currentTheme.colors.text,
                  border: `1px solid ${currentTheme.colors.accent}30`
                }}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: currentTheme.colors.accent }}>
                {t('agenda.notes')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: currentTheme.colors.surface, 
                  color: currentTheme.colors.text,
                  border: `1px solid ${currentTheme.colors.accent}30`,
                  resize: 'vertical'
                }}
                placeholder={t('agenda.notesPlaceholder')}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#ef4444' }}>
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg font-medium transition-all"
              style={{ 
                backgroundColor: submitting ? currentTheme.colors.textSecondary : currentTheme.colors.accent,
                color: submitting ? currentTheme.colors.text : getButtonTextColor(currentTheme.colors.accent),
                opacity: submitting ? 0.6 : 1
              }}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
            >
              {submitting ? t('agenda.scheduling') : t('agenda.confirmAppointment')}
            </motion.button>
          </motion.form>
        )}
      </main>
      <Footer />
    </div>
  )
}
