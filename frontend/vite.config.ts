import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Zorch-Farms/',

  server: {
    port: 5179,
  },

  plugins: [react()],
})