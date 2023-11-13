import { absoluteUrl } from '@/lib/utils'
import { Metadata } from 'next'
import '../styles/index.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://josebenitez.tech'),
  title: {
    default: 'Outstatic',
    template: '%s | Outstatic'
  },
  description: 'Jose Benitez Blog.',
  openGraph: {
    title: 'Jose Benitez',
    description: 'Always WIP',
    url: absoluteUrl('/'),
    siteName: 'JBLOG',
    images: [
      {
        url: absoluteUrl('/images/og-image.png'),
        width: 1800,
        height: 1600
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  icons: {
    icon: [{ url: '/favicon/favicon-32x32.png' }],
    apple: [{ url: '/favicon/apple-touch-icon.png' }]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
