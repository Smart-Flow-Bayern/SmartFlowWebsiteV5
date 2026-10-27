import type { MetadataRoute } from 'next'
import { colors } from '@/lib/brand/tokens'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Smart Flow',
    short_name: 'Smart Flow',
    start_url: '/',
    display: 'standalone',
    background_color: colors.ground,
    theme_color: colors.ground,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
