/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  webpack: (config) => {
    // Disable source maps to prevent "Invalid source map" warnings/errors
    config.devtool = false;
    return config;
  },
}

export default nextConfig
