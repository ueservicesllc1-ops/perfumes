'use client'

import { useRouter } from 'next/navigation'
import { RectangleStackIcon, StarIcon, TicketIcon } from '@heroicons/react/24/outline'

export default function ActionButtons() {
  const router = useRouter()
  
  return (
    <div className="w-full px-4 py-4" style={{ backgroundColor: '#172621', marginTop: '-20px' }}>
      <div className="max-w-sm mx-auto grid grid-cols-3 gap-3">
        {/* Botón Colección */}
        <button 
          onClick={() => router.push('/catalogo')}
          className="rounded-lg p-4 flex flex-col items-center justify-center space-y-2 transition-all active:scale-95" 
          style={{ 
            backgroundColor: '#2a2a2a', 
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          <RectangleStackIcon 
            className="w-7 h-7"
            style={{ color: '#D4AF37', strokeWidth: 2 }}
          />
          <span className="text-xs font-medium tracking-wide uppercase" style={{ color: '#D4AF37', letterSpacing: '0.08em' }}>
            Colección
          </span>
        </button>

        {/* Botón Nuevo */}
        <button className="rounded-lg p-4 flex flex-col items-center justify-center space-y-2 transition-all active:scale-95" style={{ 
          backgroundColor: '#2a2a2a', 
          border: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <StarIcon 
            className="w-7 h-7"
            style={{ color: '#D4AF37', strokeWidth: 2 }}
          />
          <span className="text-xs font-medium tracking-wide uppercase" style={{ color: '#D4AF37', letterSpacing: '0.08em' }}>
            Nuevo
          </span>
        </button>

        {/* Botón Ofertas */}
        <button className="rounded-lg p-4 flex flex-col items-center justify-center space-y-2 transition-all active:scale-95" style={{ 
          backgroundColor: '#2a2a2a', 
          border: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <TicketIcon 
            className="w-7 h-7"
            style={{ color: '#D4AF37', strokeWidth: 2 }}
          />
          <span className="text-xs font-medium tracking-wide uppercase" style={{ color: '#D4AF37', letterSpacing: '0.08em' }}>
            Ofertas
          </span>
        </button>
      </div>
    </div>
  )
}

