'use client'

import { useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeUpdater() {
  const { currentTheme } = useTheme()

  useEffect(() => {
    // Aplicar variables CSS al root
    const root = document.documentElement
    root.style.setProperty('--theme-primary', currentTheme.colors.primary)
    root.style.setProperty('--theme-secondary', currentTheme.colors.secondary)
    root.style.setProperty('--theme-background', currentTheme.colors.background)
    root.style.setProperty('--theme-surface', currentTheme.colors.surface)
    root.style.setProperty('--theme-text', currentTheme.colors.text)
    root.style.setProperty('--theme-text-secondary', currentTheme.colors.textSecondary)
    root.style.setProperty('--theme-accent', currentTheme.colors.accent)
    root.style.setProperty('--theme-border', currentTheme.colors.border)
    root.style.setProperty('--theme-header', currentTheme.colors.header)
    root.style.setProperty('--theme-footer', currentTheme.colors.footer)
    
    // Actualizar el body background
    document.body.style.backgroundColor = currentTheme.colors.background
  }, [currentTheme])

  return null
}

