import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import type { PluginOption } from "vite";

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    VitePWA({
      injectRegister: "script",
      registerType: "autoUpdate",
      base: "/",
      // includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Convy Notes",
        short_name: "Convy",
        description: "A modern note-taking app that works offline",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Cache all static assets during build
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: null,
        navigateFallbackAllowlist: [/^\/note\//],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // Cache all navigation requests (HTML) including note pages
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
          },
          {
            // Cache all static assets
            urlPattern: /\.(js|css|woff2?|png|svg|jpg|jpeg|gif|ico)$/i,
            handler: "CacheFirst",
          },
        ],
      },
      // Enable service worker on development
      devOptions: {
        enabled: true,
        type: "module",
      },
    }) as PluginOption,
  ],
});
