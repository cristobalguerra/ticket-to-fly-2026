import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Política de seguridad de contenido. GitHub Pages no permite cabeceras
// propias, así que va como <meta> y solo en el build (en desarrollo Vite
// inyecta scripts en línea que la política bloquearía).
const CSP = [
  "default-src 'self'",
  // apis.google.com: lo carga Firebase para la ventana de inicio de sesión.
  "script-src 'self' https://apis.google.com",
  // React escribe estilos en línea (atributo style) y la hoja de Google Fonts es externa.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // Las portadas de proyecto se guardan como data: URI.
  "img-src 'self' data: blob:",
  "connect-src 'self' https://firestore.googleapis.com https://*.googleapis.com",
  "worker-src 'self' blob:",
  "frame-src https://*.firebaseapp.com https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

function csp(): Plugin {
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml: () => [
      { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
      { tag: 'meta', attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' }, injectTo: 'head-prepend' },
    ],
  }
}

export default defineConfig(() => ({
  plugins: [react(), tailwindcss(), csp()],
  base: '/',
}))
