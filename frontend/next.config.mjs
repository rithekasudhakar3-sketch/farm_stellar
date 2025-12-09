import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const baseConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,

  // ✔ FIX: Set turbopack as an object to avoid errors
  turbopack: {},

  // ✔ You are using custom webpack config → keep it
  webpack: (config) => {
    config.devtool = false;
    return config;
  },
};

export default withPWA({
  dest: "public",
  register: false, // We'll register manually in layout
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable in dev to avoid conflicts
  sw: "service-worker.js", // Use our custom service worker
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        }
      }
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-font-assets",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
        }
      }
    }
  ]
})(baseConfig);
