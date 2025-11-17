'use client'

import { ReactNode } from 'react'

interface ThemedComponentProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  [key: string]: any
}

/**
 * Componente wrapper que aplica clases dinámicas según el tema
 * Usa variables CSS para que los cambios sean instantáneos
 */
export default function ThemedComponent({ 
  children, 
  className = '', 
  as: Component = 'div',
  ...props 
}: ThemedComponentProps) {
  // Las clases se aplican usando variables CSS, no necesitamos cambiar clases aquí
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}


