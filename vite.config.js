import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true, // This enables network access
    port: 5173  // Optional: specify port
  },
  plugins: [react()],
})
