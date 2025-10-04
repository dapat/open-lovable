import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  transpilePackages: ['@flowgami/openlovable-core-adapter'],
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
}

export default nextConfig
