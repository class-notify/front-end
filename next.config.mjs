/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar linting y TypeScript para detectar errores
  eslint: {
    // Solo ignorar durante builds si es absolutamente necesario
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Solo ignorar errores de build si es crítico
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Configuración adicional para desarrollo
  experimental: {
    // Habilitar features experimentales útiles
    serverComponentsExternalPackages: [],
  },
}

export default nextConfig
