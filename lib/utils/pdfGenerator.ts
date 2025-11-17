import { CartItem } from '@/contexts/CartContext'
import type { Order } from '@/lib/firebase/orders'

// Función para generar PDF usando jsPDF (se instalará dinámicamente)
export async function generateOrderPDF(orderData: {
  orderId: string
  items: CartItem[]
  total: number
  shippingInfo: Order['shippingInfo']
}): Promise<Blob> {
  // Cargar jsPDF dinámicamente
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  // Colores de la marca
  const goldColor = { r: 212, g: 175, b: 55 } // #D4AF37
  const darkGreenColor = { r: 24, g: 43, b: 33 } // #182B21
  const cardColor = { r: 52, g: 74, b: 61 } // #344A3D
  const lightTextColor = { r: 248, g: 245, b: 239 } // #F8F5EF
  const grayColor = { r: 107, g: 93, b: 79 } // #6B5D4F
  
  let yPos = 0

  // ========== ENCABEZADO CON FONDO DORADO ==========
  doc.setFillColor(goldColor.r, goldColor.g, goldColor.b)
  doc.rect(0, 0, pageWidth, 50, 'F')
  
  // Logo/Título principal
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('ARABIYAT', pageWidth / 2, 20, { align: 'center' })
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.text('PRESTIGE', pageWidth / 2, 30, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.text('ORDEN DE COMPRA', pageWidth / 2, 42, { align: 'center' })
  
  yPos = 60

  // ========== INFORMACIÓN DE ORDEN ==========
  doc.setFillColor(cardColor.r, cardColor.g, cardColor.b)
  doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'F')
  
  doc.setTextColor(lightTextColor.r, lightTextColor.g, lightTextColor.b)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('NÚMERO DE ORDEN', 20, yPos + 10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(goldColor.r, goldColor.g, goldColor.b)
  doc.setFontSize(14)
  doc.text(orderData.orderId, 20, yPos + 20)
  
  const now = new Date()
  const dateStr = now.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })
  const timeStr = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  doc.setFontSize(9)
  doc.setTextColor(lightTextColor.r, lightTextColor.g, lightTextColor.b)
  doc.text(`Fecha: ${dateStr}`, pageWidth - 20, yPos + 10, { align: 'right' })
  doc.text(`Hora: ${timeStr}`, pageWidth - 20, yPos + 18, { align: 'right' })
  
  yPos += 45

  // ========== INFORMACIÓN DE ENVÍO ==========
  doc.setFillColor(darkGreenColor.r, darkGreenColor.g, darkGreenColor.b)
  doc.roundedRect(15, yPos, pageWidth - 30, 5, 3, 3, 'F')
  doc.setTextColor(goldColor.r, goldColor.g, goldColor.b)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('📦 INFORMACIÓN DE ENVÍO', 20, yPos + 3.5)
  yPos += 10

  doc.setFillColor(245, 245, 245)
  doc.roundedRect(15, yPos, pageWidth - 30, 75, 3, 3, 'F')
  
  doc.setTextColor(40, 40, 40)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  
  let infoY = yPos + 8
  
  // Nombre
  doc.text('Nombre:', 20, infoY)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.fullName, 60, infoY)
  infoY += 8
  
  // Email
  doc.setFont('helvetica', 'bold')
  doc.text('Email:', 20, infoY)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.email, 60, infoY)
  infoY += 8
  
  // Teléfono
  doc.setFont('helvetica', 'bold')
  doc.text('Teléfono:', 20, infoY)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.phone, 60, infoY)
  infoY += 8
  
  // Dirección
  doc.setFont('helvetica', 'bold')
  doc.text('Dirección:', 20, infoY)
  doc.setFont('helvetica', 'normal')
  const addressLines = doc.splitTextToSize(orderData.shippingInfo.address, pageWidth - 80)
  doc.text(addressLines, 60, infoY)
  infoY += addressLines.length * 6
  
  // Ciudad, Estado, Código Postal
  doc.setFont('helvetica', 'bold')
  doc.text('Ciudad:', 20, infoY)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.city, 60, infoY)
  infoY += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Estado:', 20, infoY)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.state, 60, infoY)
  infoY += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('Código Postal:', 20, infoY)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.zipCode, 60, infoY)
  infoY += 7
  
  doc.setFont('helvetica', 'bold')
  doc.text('País:', 20, infoY)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.country, 60, infoY)
  
  yPos += 85

  // ========== PRODUCTOS ==========
  doc.setFillColor(darkGreenColor.r, darkGreenColor.g, darkGreenColor.b)
  doc.roundedRect(15, yPos, pageWidth - 30, 5, 3, 3, 'F')
  doc.setTextColor(goldColor.r, goldColor.g, goldColor.b)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('🛍️ PRODUCTOS', 20, yPos + 3.5)
  yPos += 10

  orderData.items.forEach((item, index) => {
    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = 20
    }

    // Caja para cada producto
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'F')
    
    // Borde dorado
    doc.setDrawColor(goldColor.r, goldColor.g, goldColor.b)
    doc.setLineWidth(0.5)
    doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'D')
    
    // Número y nombre del producto
    doc.setTextColor(darkGreenColor.r, darkGreenColor.g, darkGreenColor.b)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}. ${item.name}`, 20, yPos + 8)
    
    // Detalles del producto
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    
    let detailY = yPos + 16
    
    if (item.size) {
      doc.text(`Tamaño: ${item.size}`, 20, detailY)
      detailY += 6
    }
    
    doc.text(`Precio Unitario: $${item.price.toFixed(2)}`, 20, detailY)
    detailY += 6
    doc.text(`Cantidad: ${item.quantity}`, 20, detailY)
    
    // Subtotal a la derecha
    const subtotal = item.price * item.quantity
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(goldColor.r, goldColor.g, goldColor.b)
    doc.setFontSize(11)
    doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 20, yPos + 20, { align: 'right' })
    
    yPos += 40
  })

  // ========== TOTAL ==========
  yPos += 5
  
  // Fondo dorado para el total
  doc.setFillColor(goldColor.r, goldColor.g, goldColor.b)
  doc.roundedRect(15, yPos, pageWidth - 30, 20, 3, 3, 'F')
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL A PAGAR', 20, yPos + 12)
  doc.setFontSize(18)
  doc.text(`$${orderData.total.toFixed(2)}`, pageWidth - 20, yPos + 12, { align: 'right' })
  
  yPos += 30

  // ========== NOTA FINAL ==========
  if (yPos < pageHeight - 30) {
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(15, yPos, pageWidth - 30, 20, 3, 3, 'F')
    
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text('Gracias por su compra. Esta orden será procesada y enviada a la dirección indicada.', 20, yPos + 10, {
      maxWidth: pageWidth - 40,
      align: 'left'
    })
    
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.setFontSize(8)
    doc.text('www.jcsellers.com', pageWidth / 2, yPos + 18, { align: 'center' })
  }

  // Generar blob
  const pdfBlob = doc.output('blob')
  return pdfBlob
}

// Función para crear mensaje de WhatsApp con los datos de la orden
export function createWhatsAppMessage(orderData: {
  orderId: string
  items: CartItem[]
  total: number
  shippingInfo: Order['shippingInfo']
  pdfUrl?: string | null
}): string {
  let message = `*ORDEN DE COMPRA - ARABIYAT*\n\n`
  message += `📋 *Número de Orden:* ${orderData.orderId}\n`
  message += `📅 *Fecha:* ${new Date().toLocaleDateString('es-ES')}\n\n`
  
  message += `👤 *INFORMACIÓN DE ENVÍO*\n`
  message += `Nombre: ${orderData.shippingInfo.fullName}\n`
  message += `Email: ${orderData.shippingInfo.email}\n`
  message += `Teléfono: ${orderData.shippingInfo.phone}\n`
  message += `Dirección: ${orderData.shippingInfo.address}\n`
  message += `${orderData.shippingInfo.city}, ${orderData.shippingInfo.state} ${orderData.shippingInfo.zipCode}\n`
  message += `País: ${orderData.shippingInfo.country}\n\n`
  
  message += `🛍️ *PRODUCTOS*\n`
  orderData.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    if (item.size) {
      message += `   Tamaño: ${item.size}\n`
    }
    message += `   Cantidad: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}\n\n`
  })
  
  message += `💰 *TOTAL: $${orderData.total.toFixed(2)}*\n\n`
  
  if (orderData.pdfUrl) {
    message += `📄 *PDF DE LA ORDEN:*\n`
    message += `${orderData.pdfUrl}\n\n`
    message += `Haga clic en el enlace para descargar el PDF completo con todos los detalles de la orden.\n\n`
  } else {
    message += `📄 *NOTA:* No se pudo generar el PDF, pero todos los detalles están en este mensaje.\n\n`
  }
  
  message += `_Gracias por su compra. Nos pondremos en contacto pronto._`
  
  return encodeURIComponent(message)
}

// Función para abrir WhatsApp con el mensaje
export function openWhatsApp(phoneNumber: string, message: string) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
  
  // Abrir WhatsApp en nueva pestaña/ventana
  // Como esta función se llama desde la página de confirmación (ya cargada),
  // no debería haber problemas con bloqueadores de popups
  try {
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    
    // Si window.open fue bloqueado, intentar con un pequeño delay
    // Esto puede ayudar en algunos navegadores
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Intentar de nuevo después de un breve delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      }, 100)
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error)
    // Como último recurso, intentar abrir directamente
    // Nota: Esto redirigirá la página actual, pero es mejor que no abrir nada
    try {
      window.location.href = whatsappUrl
    } catch (fallbackError) {
      console.error('Error with fallback WhatsApp opening:', fallbackError)
    }
  }
}

