import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultBase =
    command === 'build' ? '/pratika-ferragista-online/' : '/'
  return {
    base: env.VITE_BASE_PATH || defaultBase,
    plugins: [react()],
  }
})
