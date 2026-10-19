import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Raise the warning threshold slightly; real gains come from manual chunking
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // rolldown-vite requires manualChunks as a function
        manualChunks(id) {
          if (id.includes("node_modules/react-activity-calendar") || id.includes("node_modules/react-github-calendar")) {
            return "vendor-charts";
          }
          if (id.includes("node_modules/socket.io-client") || id.includes("node_modules/engine.io-client")) {
            return "vendor-socket";
          }
          if (id.includes("node_modules/@reduxjs") || id.includes("node_modules/react-redux") || id.includes("node_modules/redux")) {
            return "vendor-redux";
          }
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "vendor-react";
          }
        },
      },
    },
  },
})
