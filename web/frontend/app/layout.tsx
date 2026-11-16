import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Providers } from '@/core/providers'
import '@/index.css'

// oxlint-disable-next-line react/only-export-components -- Next.js layouts export metadata by design.
export const metadata: Metadata = {
  title: {
    default: 'Ariane · Rendre du temps à l’expertise biologique',
    template: '%s · Ariane',
  },
  description:
    'Démonstrateur de revue immunologique construit sur des données synthétiques, avec validation humaine obligatoire.',
  metadataBase: new URL('https://github.com/idris404/Ariane'),
  openGraph: {
    title: 'Ariane · Rendre du temps à l’expertise biologique',
    description:
      'Prix de la meilleure solution pour les patients — AI for Health 2026.',
    images: ['/showcase/signing-queue-full.png'],
  },
  icons: { icon: '/brand/ariane-symbol.png' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
