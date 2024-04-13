import { sentryVitePlugin } from "@sentry/vite-plugin";
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    // conditionally enable the Sentry plugin based on the CI environment variable
    ...(process.env.CI ? [
      sentryVitePlugin({
      org: "antarctica",
      project: "zap",
      telemetry: process.env.CI !== undefined,
    })]:
      []
  ),
],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    sourcemap: true
  }
})
