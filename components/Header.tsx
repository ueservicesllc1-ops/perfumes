'use client'

export default function Header() {
  return (
    <header 
      className="w-full fixed top-0 left-0 right-0 z-50"
      style={{ 
        backgroundColor: '#000000', // Negro
        padding: '0.5rem 1rem',
        minHeight: '40px',
        boxShadow: 'none',
        border: 'none',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
          www.jcsellers.com
        </span>
      </div>
    </header>
  )
}

