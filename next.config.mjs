/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Turbopack disabled due to Windows compatibility issues in Next.js 16.0.1
  // Re-enable when Turbopack stability improves on Windows
  experimental: {
    turbopack: false,
  },
};

export default nextConfig;
