import type { MetadataRoute } from 'next'
import { resolveUrl } from '~/lib/routing/resolvers'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/'],
      },
    ],
    sitemap: resolveUrl('sitemap.xml'),
  }
}
