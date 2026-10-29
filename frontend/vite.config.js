import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Nueva importación

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
})