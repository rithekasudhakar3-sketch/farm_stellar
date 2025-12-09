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
  register: true,
  skipWaiting: true,
})(baseConfig);
