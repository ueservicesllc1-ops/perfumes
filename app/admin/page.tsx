'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signInWithGoogle, getCurrentUser, logOut } from '@/lib/firebase/auth'
import { getAllPerfumes } from '@/lib/firebase/perfumes'
import { getAllVideos } from '@/lib/firebase/videos'
import type { Perfume } from '@/lib/firebase/perfumes'
import type { Video } from '@/lib/firebase/videos'
import AdminProductList from '@/components/admin/AdminProductList'
import AdminProductForm from '@/components/admin/AdminProductForm'
import AdminVideoList from '@/components/admin/AdminVideoList'
import AdminVideoForm from '@/components/admin/AdminVideoForm'

type AdminSection = 'menu' | 'products' | 'videos'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authenticating, setAuthenticating] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [section, setSection] = useState<AdminSection>('menu')
  const [perfumes, setPerfumes] = useState<Perfume[]>([])
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showVideoForm, setShowVideoForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      if (section === 'products') {
        loadPerfumes()
      } else if (section === 'videos') {
        loadVideos()
      }
    }
  }, [user, section])

  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthenticating(true)
    setError('')

    try {
      const userCredential = await signIn(email, password)
      setUser(userCredential)
      setEmail('')
      setPassword('')
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión')
    } finally {
      setAuthenticating(false)
    }
  }

  async function handleGoogleLogin() {
    setAuthenticating(true)
    setError('')

    try {
      const userCredential = await signInWithGoogle()
      setUser(userCredential)
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión con Google')
    } finally {
      setAuthenticating(false)
    }
  }

  async function handleLogout() {
    try {
      await logOut()
      setUser(null)
      setPerfumes([])
      setSelectedPerfume(null)
      setShowProductForm(false)
      setVideos([])
      setSelectedVideo(null)
      setShowVideoForm(false)
      setSection('menu')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  async function loadPerfumes() {
    try {
      const data = await getAllPerfumes()
      setPerfumes(data)
    } catch (error) {
      console.error('Error cargando perfumes:', error)
    }
  }

  async function loadVideos() {
    try {
      const data = await getAllVideos()
      setVideos(data)
    } catch (error) {
      console.error('Error cargando videos:', error)
    }
  }

  function handleEditProduct(perfume: Perfume) {
    setSelectedPerfume(perfume)
    setShowProductForm(true)
  }

  function handleNewProduct() {
    setSelectedPerfume(null)
    setShowProductForm(true)
  }

  function handleProductFormClose() {
    setShowProductForm(false)
    setSelectedPerfume(null)
  }

  function handleProductFormSuccess() {
    loadPerfumes()
    handleProductFormClose()
  }

  function handleEditVideo(video: Video) {
    setSelectedVideo(video)
    setShowVideoForm(true)
  }

  function handleNewVideo() {
    setSelectedVideo(null)
    setShowVideoForm(true)
  }

  function handleVideoFormClose() {
    setShowVideoForm(false)
    setSelectedVideo(null)
  }

  function handleVideoFormSuccess() {
    loadVideos()
    handleVideoFormClose()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#172621' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#D4AF37' }}></div>
          <p className="mt-4" style={{ color: '#D4AF37' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#172621' }}>
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#D4AF37' }}>Panel de Administración</h1>
            <p className="text-sm" style={{ color: '#999' }}>Inicia sesión para gestionar productos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#ef4444' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444' }}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#D4AF37' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#2a2a2a', color: '#FFFFFF', border: '1px solid #444' }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authenticating}
              className="w-full py-3 rounded-lg font-medium transition-all active:scale-95"
              style={{ 
                backgroundColor: '#D4AF37', 
                color: '#000000',
                opacity: authenticating ? 0.6 : 1
              }}
            >
              {authenticating ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#444' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span style={{ color: '#999', backgroundColor: '#172621', padding: '0 1rem' }}>
                  O continúa con
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={authenticating}
              className="w-full mt-4 py-3 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-3"
              style={{ 
                backgroundColor: '#2a2a2a', 
                color: '#FFFFFF',
                border: '1px solid #444',
                opacity: authenticating ? 0.6 : 1
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {authenticating ? 'Iniciando sesión...' : 'Continuar con Google'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#172621', color: '#FFFFFF' }}>
      {/* Header - Mobile Optimized */}
      <div className="sticky top-0 z-50 px-4 py-3" style={{ backgroundColor: '#000000', borderBottom: '1px solid #D4AF37' }}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate" style={{ color: '#D4AF37' }}>Admin</h1>
            <p className="text-xs truncate" style={{ color: '#999' }}>{user.email}</p>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {section !== 'menu' && (
              <button
                onClick={() => {
                  setSection('menu')
                  setShowProductForm(false)
                  setShowVideoForm(false)
                  setSelectedPerfume(null)
                  setSelectedVideo(null)
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{ backgroundColor: '#2a2a2a', color: '#D4AF37', border: '1px solid #444' }}
              >
                ← Menú
              </button>
            )}
            {section === 'products' && !showProductForm && (
              <button
                onClick={handleNewProduct}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{ backgroundColor: '#D4AF37', color: '#000000' }}
              >
                + Nuevo
              </button>
            )}
            {section === 'videos' && !showVideoForm && (
              <button
                onClick={handleNewVideo}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{ backgroundColor: '#D4AF37', color: '#000000' }}
              >
                + Nuevo
              </button>
            )}
            {(showProductForm || showVideoForm) && (
              <button
                onClick={showProductForm ? handleProductFormClose : handleVideoFormClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{ backgroundColor: '#2a2a2a', color: '#D4AF37', border: '1px solid #444' }}
              >
                ←
              </button>
            )}
            {section === 'menu' && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95"
                style={{ backgroundColor: '#2a2a2a', color: '#D4AF37', border: '1px solid #444' }}
              >
                Salir
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content - Mobile Optimized */}
      <div className="px-4 py-4">
        {section === 'menu' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6 text-center" style={{ color: '#D4AF37' }}>
              ¿Qué deseas gestionar?
            </h2>
            <button
              onClick={() => setSection('products')}
              className="w-full py-6 rounded-lg font-medium transition-all active:scale-95 flex flex-col items-center justify-center gap-3"
              style={{ 
                backgroundColor: '#2a2a2a', 
                border: '2px solid #D4AF37',
                color: '#D4AF37'
              }}
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-lg">Productos</span>
            </button>
            <button
              onClick={() => setSection('videos')}
              className="w-full py-6 rounded-lg font-medium transition-all active:scale-95 flex flex-col items-center justify-center gap-3"
              style={{ 
                backgroundColor: '#2a2a2a', 
                border: '2px solid #D4AF37',
                color: '#D4AF37'
              }}
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-lg">Videos</span>
            </button>
          </div>
        ) : section === 'products' ? (
          showProductForm ? (
            <AdminProductForm
              perfume={selectedPerfume}
              onClose={handleProductFormClose}
              onSuccess={handleProductFormSuccess}
            />
          ) : (
            <AdminProductList
              perfumes={perfumes}
              onEdit={handleEditProduct}
              onRefresh={loadPerfumes}
            />
          )
        ) : section === 'videos' ? (
          showVideoForm ? (
            <AdminVideoForm
              video={selectedVideo}
              onClose={handleVideoFormClose}
              onSuccess={handleVideoFormSuccess}
            />
          ) : (
            <AdminVideoList
              videos={videos}
              onEdit={handleEditVideo}
              onRefresh={loadVideos}
            />
          )
        ) : null}
      </div>
    </div>
  )
}

