import withPWA from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
typescript: {
  ignoreBuildErrors: true,
  },
images: {
  unoptimized: true,
  },

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in dev for faster builds
})(baseConfig);

