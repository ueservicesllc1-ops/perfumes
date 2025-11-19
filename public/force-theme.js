// Script para forzar la nueva paleta Modern Elegance
(function() {
  if (typeof document !== 'undefined') {
    // Limpiar localStorage de temas
    localStorage.removeItem('arabiyat-theme-palette');
    
    // Aplicar la nueva paleta directamente
    document.documentElement.setAttribute('data-theme', 'modernElegance');
    
    // Aplicar estilos directamente
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', '#0A0E1A');
    root.style.setProperty('--theme-surface', '#1A1F2E');
    root.style.setProperty('--theme-surface-secondary', '#141920');
    root.style.setProperty('--theme-text', '#FFFFFF');
    root.style.setProperty('--theme-text-secondary', '#B0B8C8');
    root.style.setProperty('--theme-accent', '#FF6B9D');
    root.style.setProperty('--theme-accent-2', '#00D4FF');
    root.style.setProperty('--theme-border', 'rgba(255, 107, 157, 0.3)');
    root.style.setProperty('--theme-gradient-start', '#1A1F2E');
    root.style.setProperty('--theme-gradient-end', '#0A0E1A');
    root.style.setProperty('--theme-glow', 'rgba(255, 107, 157, 0.2)');
    
    // Cambiar el fondo del body
    document.body.style.background = 'linear-gradient(135deg, #1A1F2E 0%, #0A0E1A 100%)';
    document.body.style.backgroundAttachment = 'fixed';
    
    console.log('✅ Nueva paleta Modern Elegance aplicada!');
  }
})();



