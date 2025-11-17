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
  let yPos = 20

  // Título
  doc.setFontSize(22)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.text('ORDEN DE COMPRA', pageWidth / 2, yPos, { align: 'center' })
  yPos += 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text('ARABIYAT PRESTIGE', pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // Línea separadora
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  // Número de orden y fecha
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Número de Orden: ${orderData.orderId}`, 20, yPos)
  yPos += 8
  doc.setFont('helvetica', 'normal')
  const now = new Date()
  doc.text(`Fecha: ${now.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, yPos)
  yPos += 15

  // Información de envío
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('INFORMACIÓN DE ENVÍO Y CONTACTO', 20, yPos)
  yPos += 10
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  
  // Nombre completo
  doc.setFont('helvetica', 'bold')
  doc.text('Nombre Completo:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.fullName, 70, yPos)
  yPos += 8
  
  // Email
  doc.setFont('helvetica', 'bold')
  doc.text('Email:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.email, 70, yPos)
  yPos += 8
  
  // Teléfono
  doc.setFont('helvetica', 'bold')
  doc.text('Teléfono:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.phone, 70, yPos)
  yPos += 8
  
  // Dirección
  doc.setFont('helvetica', 'bold')
  doc.text('Dirección:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const addressLines = doc.splitTextToSize(orderData.shippingInfo.address, pageWidth - 80)
  doc.text(addressLines, 70, yPos)
  yPos += addressLines.length * 7
  
  // Ciudad, Estado, Código Postal
  doc.setFont('helvetica', 'bold')
  doc.text('Ciudad:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.city, 70, yPos)
  yPos += 8
  
  doc.setFont('helvetica', 'bold')
  doc.text('Estado:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.state, 70, yPos)
  yPos += 8
  
  doc.setFont('helvetica', 'bold')
  doc.text('Código Postal:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.zipCode, 70, yPos)
  yPos += 8
  
  // País
  doc.setFont('helvetica', 'bold')
  doc.text('País:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(orderData.shippingInfo.country, 70, yPos)
  yPos += 15

  // Línea separadora
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  // Productos
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('DETALLES DE PRODUCTOS', 20, yPos)
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  orderData.items.forEach((item, index) => {
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }

    // Número y nombre del producto
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}. ${item.name}`, 20, yPos)
    yPos += 7
    
    // Tamaño si existe
    if (item.size) {
      doc.setFont('helvetica', 'normal')
      doc.text(`   Tamaño: ${item.size}`, 20, yPos)
      yPos += 6
    }
    
    // Precio unitario y cantidad
    doc.text(`   Precio Unitario: $${item.price.toFixed(2)}`, 20, yPos)
    yPos += 6
    doc.text(`   Cantidad: ${item.quantity}`, 20, yPos)
    yPos += 6
    
    // Subtotal
    doc.setFont('helvetica', 'bold')
    const subtotal = item.price * item.quantity
    doc.text(`   Subtotal: $${subtotal.toFixed(2)}`, 20, yPos)
    yPos += 10
    
    // Línea separadora entre productos
    if (index < orderData.items.length - 1) {
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.3)
      doc.line(20, yPos, pageWidth - 20, yPos)
      yPos += 8
    }
  })

  // Línea separadora antes del total
  yPos += 5
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(20, yPos, pageWidth - 20, yPos)
  yPos += 10

  // Total
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`TOTAL A PAGAR: $${orderData.total.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' })
  yPos += 15

  // Nota final
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(100, 100, 100)
  doc.text('Gracias por su compra. Esta orden será procesada y enviada a la dirección indicada.', 20, yPos, {
    maxWidth: pageWidth - 40,
    align: 'left'
  })

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

