'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { signIn, signUp, signInWithGoogle, onAuthChange, logOut, getCurrentUser } from '@/lib/firebase/auth'
import { updateProfile } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { useLanguage } from '@/contexts/LanguageContext'
import { AnimatePresence } from 'framer-motion'
import { getUserOrders } from '@/lib/firebase/orders'
import type { Order } from '@/lib/firebase/orders'
import { getUserAppointments } from '@/lib/firebase/appointments'
import type { Appointment } from '@/lib/firebase/appointments'
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadCount } from '@/lib/firebase/notifications'
import type { Notification } from '@/lib/firebase/notifications'
import PerfumeImage from '@/components/PerfumeImage'

export default function Perfil() {
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showMyInfo, setShowMyInfo] = useState(false)
  const [showMyOrders, setShowMyOrders] = useState(false)
  const [showMyAppointments, setShowMyAppointments] = useState(false)
  const [editingName, setEditingName] = useState('')
  const [savingInfo, setSavingInfo] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingAppointments, setLoadingAppointments] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user)
      if (user) {
        setEditingName(user.displayName || '')
        loadUnreadCount(user.uid)
      } else {
        setUnreadCount(0)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  async function loadUnreadCount(userId: string) {
    try {
      const count = await getUnreadCount(userId)
      setUnreadCount(count)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, displayName || undefined)
      }
      setEmail('')
      setPassword('')
      setDisplayName('')
    } catch (err: any) {
      console.error('Auth error:', err)
      if (err.code === 'auth/user-not-found') {
        setError(t('auth.userNotFound'))
      } else if (err.code === 'auth/wrong-password') {
        setError(t('auth.wrongPassword'))
      } else if (err.code === 'auth/email-already-in-use') {
        setError(t('auth.emailInUse'))
      } else if (err.code === 'auth/weak-password') {
        setError(t('auth.weakPassword'))
      } else if (err.code === 'auth/invalid-email') {
        setError(t('auth.invalidEmail'))
      } else {
        setError(err.message || t('auth.error'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleAuth() {
    setError('')
    setSubmitting(true)
    try {
      await signInWithGoogle()
    } catch (err: any) {
      console.error('Google auth error:', err)
      setError(err.message || t('auth.googleError'))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    try {
      await logOut()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  async function handleSaveInfo() {
    if (!user) return
    
    setSavingInfo(true)
    setError('')
    
    try {
      await updateProfile(user, {
        displayName: editingName || undefined
      })
      setShowMyInfo(false)
      // Actualizar el estado del usuario
      setUser({ ...user, displayName: editingName || null } as User)
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.message || t('profile.updateError'))
    } finally {
      setSavingInfo(false)
    }
  }

  function handleMyInfoClick() {
    if (user) {
      setEditingName(user.displayName || '')
      setShowMyInfo(true)
    }
  }

  async function handleMyOrdersClick() {
    if (!user) return
    
    setShowMyOrders(true)
    setLoadingOrders(true)
    
    try {
      const userOrders = await getUserOrders(user.uid)
      setOrders(userOrders)
    } catch (err: any) {
      console.error('Error loading orders:', err)
      setError(err.message || t('profile.errorLoadingOrders'))
    } finally {
      setLoadingOrders(false)
    }
  }

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
    
    const language = t('orders.order') === 'Order' ? 'en-US' : 'es-ES'
    return d.toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#D4AF37'
      case 'processing': return '#3B82F6'
      case 'shipped': return '#10B981'
      case 'delivered': return '#059669'
      case 'cancelled': return '#EF4444'
      default: return '#999'
    }
  }

  function getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return t('orders.status.pending')
      case 'processing': return t('orders.status.processing')
      case 'shipped': return t('orders.status.shipped')
      case 'delivered': return t('orders.status.delivered')
      case 'cancelled': return t('orders.status.cancelled')
      default: return status
    }
  }

  async function handleMyAppointmentsClick() {
    if (!user) return
    
    setShowMyAppointments(true)
    setLoadingAppointments(true)
    
    try {
      const userAppointments = await getUserAppointments(user.uid)
      setAppointments(userAppointments)
    } catch (err: any) {
      console.error('Error loading appointments:', err)
      setError(err.message || t('profile.errorLoadingAppointments'))
    } finally {
      setLoadingAppointments(false)
    }
  }

  function formatAppointmentDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00')
    const language = t('orders.order') === 'Order' ? 'en-US' : 'es-ES'
    return date.toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function formatAppointmentTime(timeStr: string): string {
    // Formato "HH:MM" -> "HH:MM AM/PM" o mantener formato 24h según idioma
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours, 10)
    const language = t('orders.order') === 'Order' ? 'en-US' : 'es-ES'
    
    if (language === 'en-US') {
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayHour}:${minutes} ${period}`
    } else {
      return `${hours}:${minutes}`
    }
  }

  function getAppointmentStatusColor(status: string): string {
    switch (status) {
      case 'pending': return '#D4AF37'
      case 'confirmed': return '#10B981'
      case 'cancelled': return '#EF4444'
      default: return '#999'
    }
  }

  function getAppointmentStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return t('appointments.status.pending')
      case 'confirmed': return t('appointments.status.confirmed')
      case 'cancelled': return t('appointments.status.cancelled')
      default: return status
    }
  }

  async function handleNotificationsClick() {
    if (!user) return
    
    setShowNotifications(true)
    setLoadingNotifications(true)
    
    try {
      const userNotifications = await getUserNotifications(user.uid)
      setNotifications(userNotifications)
    } catch (err: any) {
      console.error('Error loading notifications:', err)
      setError(err.message || t('profile.errorLoadingNotifications'))
    } finally {
      setLoadingNotifications(false)
    }
  }

  async function handleMarkAsRead(notificationId: string) {
    if (!notificationId) return
    
    try {
      await markNotificationAsRead(notificationId)
      // Actualizar el estado local
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
      // Actualizar contador
      if (user) {
        await loadUnreadCount(user.uid)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async function handleMarkAllAsRead() {
    if (!user) return
    
    try {
      await markAllNotificationsAsRead(user.uid)
      // Actualizar el estado local
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      // Actualizar contador
      await loadUnreadCount(user.uid)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  function formatNotificationDate(date: Date | any): string {
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
    
    const language = t('orders.order') === 'Order' ? 'en-US' : 'es-ES'
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return t('notifications.justNow')
    if (diffMins < 60) {
      return t('notifications.minutesAgo').replace('{count}', diffMins.toString())
    }
    if (diffHours < 24) {
      return t('notifications.hoursAgo').replace('{count}', diffHours.toString())
    }
    if (diffDays < 7) {
      return t('notifications.daysAgo').replace('{count}', diffDays.toString())
    }
    
    return d.toLocaleDateString(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  function getNotificationTypeColor(type: string): string {
    switch (type) {
      case 'info': return '#3B82F6'
      case 'success': return '#10B981'
      case 'warning': return '#F59E0B'
      case 'error': return '#EF4444'
      default: return '#999'
    }
  }

  function getNotificationTypeIcon(type: string) {
    switch (type) {
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
        <Header />
        <main className="max-w-sm mx-auto pt-16 px-4 pb-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
            <p className="mt-4" style={{ color: '#999' }}>{t('auth.loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Si no está autenticado, mostrar formulario de login
  if (!user) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
        <Header />
        <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg p-6"
            style={{ backgroundColor: '#344A3D' }}
          >
            <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#D4AF37' }}>
              {isLogin ? t('auth.login') : t('auth.signup')}
            </h1>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
                    {t('auth.name')}
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: '#182B21', 
                      color: '#F8F5EF',
                      border: '1px solid rgba(212, 175, 55, 0.3)'
                    }}
                    placeholder={t('auth.namePlaceholder')}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{ 
                    backgroundColor: '#182B21', 
                    color: '#F8F5EF',
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}
                  placeholder={t('auth.emailPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{ 
                    backgroundColor: '#182B21', 
                    color: '#F8F5EF',
                    border: '1px solid rgba(212, 175, 55, 0.3)'
                  }}
                  placeholder={t('auth.passwordPlaceholder')}
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
                  backgroundColor: submitting ? '#666' : '#D4AF37',
                  color: '#000000',
                  opacity: submitting ? 0.6 : 1
                }}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? t('auth.processing') : (isLogin ? t('auth.login') : t('auth.signup'))}
              </motion.button>
            </form>

            <div className="my-4 flex items-center">
              <div className="flex-1 border-t" style={{ borderColor: '#6B5D4F' }}></div>
              <span className="px-4 text-sm" style={{ color: '#999' }}>{t('auth.or')}</span>
              <div className="flex-1 border-t" style={{ borderColor: '#6B5D4F' }}></div>
            </div>

            <motion.button
              onClick={handleGoogleAuth}
              disabled={submitting}
              className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              style={{ 
                backgroundColor: '#182B21',
                color: '#F8F5EF',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                opacity: submitting ? 0.6 : 1
              }}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('auth.googleSignIn')}
            </motion.button>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-sm"
                style={{ color: '#D4AF37' }}
              >
                {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  // Si está autenticado, mostrar perfil
  const stats = [
    { 
      label: 'Favoritos', 
      value: '0', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    { 
      label: 'Pedidos', 
      value: '0', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    { 
      label: 'Citas', 
      value: '0', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  const menuItems = [
    { 
      label: t('profile.myInfo'),
      id: 'myInfo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ), 
    },
    { 
      label: t('profile.myOrders'),
      id: 'myOrders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    { 
      label: t('profile.myAppointments'),
      id: 'myAppointments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    { 
      label: t('profile.settings'),
      id: 'settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), 
    },
    { 
      label: t('profile.notifications'),
      id: 'notifications',
      badge: unreadCount > 0 ? unreadCount.toString() : undefined,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ), 
    },
    { 
      label: t('profile.help'),
      id: 'help',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), 
    },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#182B21', color: '#F8F5EF' }}>
      <Header />
      
      <main className="max-w-sm mx-auto pt-16 px-4 pb-24">
        {/* Header del perfil */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <motion.div
            className="rounded-lg p-6 text-center relative overflow-hidden"
            style={{ 
              backgroundColor: '#344A3D',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ 
                backgroundColor: '#182B21',
                border: '3px solid #D4AF37'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#D4AF37' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </motion.div>
            <motion.h1
              className="text-2xl font-bold mb-1"
              style={{ color: '#D4AF37' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {user.displayName || t('auth.user')}
            </motion.h1>
            <motion.p
              className="text-sm mb-4"
              style={{ color: '#999' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {user.email}
            </motion.p>
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ 
                backgroundColor: '#D4AF37',
                color: '#000000'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('auth.logout')}
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="rounded-lg p-4 text-center"
                style={{ 
                  backgroundColor: '#344A3D',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#182B21',
                    color: '#D4AF37'
                  }}
                >
                  {stat.icon}
                </div>
                <p className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: '#999' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Opciones del perfil */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id || index}
                onClick={() => {
                  if (item.id === 'myInfo') {
                    handleMyInfoClick()
                  } else if (item.id === 'myOrders') {
                    handleMyOrdersClick()
                  } else if (item.id === 'myAppointments') {
                    handleMyAppointmentsClick()
                  } else if (item.id === 'notifications') {
                    handleNotificationsClick()
                  }
                }}
                className="w-full rounded-lg p-4 flex items-center justify-between"
                style={{ 
                  backgroundColor: '#344A3D',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ 
                  scale: 1.02,
                  x: 4,
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center relative"
                    style={{ 
                      backgroundColor: '#182B21',
                      color: '#D4AF37'
                    }}
                  >
                    {item.icon}
                    {item.badge && (
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold" style={{ color: '#F8F5EF' }}>
                    {item.label}
                  </span>
                </div>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#999' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />

      {/* Modal de Mi Información */}
      <AnimatePresence>
        {showMyInfo && user && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMyInfo(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm rounded-lg p-6"
                style={{ backgroundColor: '#344A3D' }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                    {t('profile.myInfo')}
                  </h2>
                  <button
                    onClick={() => setShowMyInfo(false)}
                    className="p-2 rounded-lg"
                    style={{ color: '#F8F5EF' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
                      {t('auth.name')}
                    </label>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-sm"
                      style={{ 
                        backgroundColor: '#182B21', 
                        color: '#F8F5EF',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}
                      placeholder={t('auth.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
                      {t('auth.email')}
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-lg text-sm opacity-60"
                      style={{ 
                        backgroundColor: '#182B21', 
                        color: '#F8F5EF',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}
                    />
                    <p className="text-xs mt-1" style={{ color: '#999' }}>
                      {t('profile.emailCannotChange')}
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#ef4444' }}>
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => setShowMyInfo(false)}
                      className="flex-1 px-4 py-3 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: '#182B21',
                        color: '#D4AF37',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('button.cancel')}
                    </motion.button>
                    <motion.button
                      onClick={handleSaveInfo}
                      disabled={savingInfo}
                      className="flex-1 px-4 py-3 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: savingInfo ? '#666' : '#D4AF37',
                        color: '#000000',
                        opacity: savingInfo ? 0.6 : 1
                      }}
                      whileHover={{ scale: savingInfo ? 1 : 1.02 }}
                      whileTap={{ scale: savingInfo ? 1 : 0.98 }}
                    >
                      {savingInfo ? t('auth.processing') : t('button.save')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* Modal de Mis Pedidos */}
        <AnimatePresence>
          {showMyOrders && user && (
            <>
              <motion.div
                className="fixed inset-0 z-50"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMyOrders(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-sm rounded-lg p-6 max-h-[90vh] overflow-y-auto"
                  style={{ backgroundColor: '#344A3D' }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                      {t('profile.myOrders')}
                    </h2>
                    <button
                      onClick={() => setShowMyOrders(false)}
                      className="p-2 rounded-lg"
                      style={{ color: '#F8F5EF' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
                      <p className="mt-4 text-sm" style={{ color: '#999' }}>{t('orders.loading')}</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        className="w-16 h-16 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B5D4F' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm" style={{ color: '#999' }}>{t('orders.noOrders')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <motion.div
                          key={order.id}
                          className="rounded-lg p-4"
                          style={{ backgroundColor: '#182B21' }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
                                {t('orders.order')} #{order.id?.substring(0, 8).toUpperCase()}
                              </p>
                              {order.createdAt && (
                                <p className="text-xs mt-1" style={{ color: '#999' }}>
                                  {formatDate(order.createdAt)}
                                </p>
                              )}
                            </div>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: getStatusColor(order.status) + '20',
                                color: getStatusColor(order.status)
                              }}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </div>

                          <div className="space-y-2 mb-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex gap-2">
                                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0" style={{ backgroundColor: '#344A3D' }}>
                                  {item.imageUrl && (
                                    <PerfumeImage
                                      imageUrl={item.imageUrl}
                                      perfumeName={item.name}
                                      className="h-12"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium line-clamp-1" style={{ color: '#F8F5EF' }}>
                                    {item.name}
                                  </p>
                                  <p className="text-xs" style={{ color: '#999' }}>
                                    {t('orders.quantity')}: {item.quantity} × ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#344A3D' }}>
                            <span className="text-sm font-medium" style={{ color: '#999' }}>
                              {t('cart.total')}:
                            </span>
                            <span className="text-lg font-bold" style={{ color: '#D4AF37' }}>
                              ${order.total.toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Modal de Mis Citas */}
        <AnimatePresence>
          {showMyAppointments && user && (
            <>
              <motion.div
                className="fixed inset-0 z-50"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMyAppointments(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-sm rounded-lg p-6 max-h-[90vh] overflow-y-auto"
                  style={{ backgroundColor: '#344A3D' }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                      {t('profile.myAppointments')}
                    </h2>
                    <button
                      onClick={() => setShowMyAppointments(false)}
                      className="p-2 rounded-lg"
                      style={{ color: '#F8F5EF' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {loadingAppointments ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
                      <p className="mt-4 text-sm" style={{ color: '#999' }}>{t('appointments.loading')}</p>
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        className="w-16 h-16 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B5D4F' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm" style={{ color: '#999' }}>{t('appointments.noAppointments')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          className="rounded-lg p-4"
                          style={{ backgroundColor: '#182B21' }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <p className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
                                {formatAppointmentDate(appointment.date)}
                              </p>
                              <p className="text-xs mt-1" style={{ color: '#999' }}>
                                {formatAppointmentTime(appointment.time)}
                              </p>
                            </div>
                            <span
                              className="px-2 py-1 rounded text-xs font-medium ml-2"
                              style={{
                                backgroundColor: getAppointmentStatusColor(appointment.status) + '20',
                                color: getAppointmentStatusColor(appointment.status)
                              }}
                            >
                              {getAppointmentStatusLabel(appointment.status)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-xs" style={{ color: '#999' }}>{t('agenda.fullName')}</p>
                              <p className="text-sm font-medium" style={{ color: '#F8F5EF' }}>
                                {appointment.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: '#999' }}>{t('agenda.email')}</p>
                              <p className="text-sm" style={{ color: '#F8F5EF' }}>
                                {appointment.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: '#999' }}>{t('agenda.phone')}</p>
                              <p className="text-sm" style={{ color: '#F8F5EF' }}>
                                {appointment.phone}
                              </p>
                            </div>
                            {appointment.notes && (
                              <div>
                                <p className="text-xs" style={{ color: '#999' }}>{t('agenda.notes')}</p>
                                <p className="text-sm" style={{ color: '#F8F5EF' }}>
                                  {appointment.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Modal de Notificaciones */}
        <AnimatePresence>
          {showNotifications && user && (
            <>
              <motion.div
                className="fixed inset-0 z-50"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowNotifications(false)}
              />
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-sm rounded-lg p-6 max-h-[90vh] overflow-y-auto"
                  style={{ backgroundColor: '#344A3D' }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold" style={{ color: '#D4AF37' }}>
                      {t('profile.notifications')}
                    </h2>
                    <div className="flex items-center gap-2">
                      {notifications.filter(n => !n.read).length > 0 && (
                        <motion.button
                          onClick={handleMarkAllAsRead}
                          className="px-3 py-1 rounded text-xs font-medium"
                          style={{ backgroundColor: '#182B21', color: '#D4AF37' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t('notifications.markAllRead')}
                        </motion.button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-2 rounded-lg"
                        style={{ color: '#F8F5EF' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {loadingNotifications ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
                      <p className="mt-4 text-sm" style={{ color: '#999' }}>{t('notifications.loading')}</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        className="w-16 h-16 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: '#6B5D4F' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className="text-sm" style={{ color: '#999' }}>{t('notifications.noNotifications')}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          className={`rounded-lg p-4 relative ${!notification.read ? 'cursor-pointer' : ''}`}
                          style={{ 
                            backgroundColor: notification.read ? '#182B21' : '#2a3a2f',
                            border: notification.read ? '1px solid #344A3D' : `2px solid ${getNotificationTypeColor(notification.type || 'info')}`
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => !notification.read && notification.id && handleMarkAsRead(notification.id)}
                        >
                          {!notification.read && (
                            <div
                              className="absolute top-2 right-2 w-2 h-2 rounded-full"
                              style={{ backgroundColor: getNotificationTypeColor(notification.type || 'info') }}
                            />
                          )}
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ 
                                backgroundColor: getNotificationTypeColor(notification.type || 'info') + '20',
                                color: getNotificationTypeColor(notification.type || 'info')
                              }}
                            >
                              {getNotificationTypeIcon(notification.type || 'info')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
                                  {notification.title}
                                </h3>
                                <span className="text-xs" style={{ color: '#999' }}>
                                  {formatNotificationDate(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm" style={{ color: '#F8F5EF' }}>
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  )
}
