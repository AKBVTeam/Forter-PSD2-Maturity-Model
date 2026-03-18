import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Forter-PSD2-Maturity-Model/',
  plugins: [react(), tailwindcss()],
})
