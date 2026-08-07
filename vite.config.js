import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 استفاده از مسیر نسبی جهت جلوگیری از 404
})