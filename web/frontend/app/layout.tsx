import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Providers } from '@/core/providers'
import '@/index.css'

// oxlint-disable-next-line react/only-export-components -- Next.js layouts export metadata by design.
export const metadata: Metadata = {
  title: {
    default: 'Ariane · Clear the backlog, keep the expertise',
    template: '%s · Ariane',
  },
  description:
    'Ariane prepares immunological review work to help teams clear accumulated backlog while keeping human validation mandatory.',
  metadataBase: new URL('https://arianex.vercel.app'),
  openGraph: {
    title: 'Ariane · Clear the backlog, keep the expertise',
    description:
      'Best Patient Solution — operational target: move from six months of accumulated backlog toward one month, to be confirmed in a pilot.',
    images: ['/showcase/signing-queue-full.png'],
  },
  icons: { icon: '/brand/ariane-symbol.png' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
