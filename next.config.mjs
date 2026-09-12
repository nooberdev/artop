/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // La librería de iconos tiene miles de módulos: sin esto, cada página
  // compila el paquete entero en dev (~10.000 módulos, 10+s por página).
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
