// Configuración de Backblaze B2
export const b2Config = {
  keyId: '005c2b526be0baa0000000022',
  applicationKey: 'K0050th3Izw948pBo5EwyO0uYP4kEdg',
  bucketName: 'arabiyat', // Cambiado de 'arabikey' a 'arabiyat'
  bucketId: 'dcd2cbc5c2468bee90ab0a1a',
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  region: 'us-east-005',
}

// URL pública de B2
export const getB2PublicUrl = (path: string): string => {
  // URL pública de B2: https://{bucketName}.s3.{region}.backblazeb2.com/{path}
  return `https://${b2Config.bucketName}.s3.${b2Config.region}.backblazeb2.com/${path}`
}

// URL base para las imágenes (usando el proxy)
export const getImageUrl = (path: string) => {
  return `/api/b2/image?path=${encodeURIComponent(path)}`
}

// URL para subir imágenes (usando el proxy)
export const getUploadUrl = () => {
  return '/api/b2/upload'
}

