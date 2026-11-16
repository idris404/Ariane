import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Providers } from '@/core/providers'
import '@/index.css'

// oxlint-disable-next-line react/only-export-components -- Next.js layouts export metadata by design.
export const metadata: Metadata = {
  title: {
    default: 'Ariane · Rattraper le retard, garder l’expertise',
    template: '%s · Ariane',
  },
  description:
    'Ariane prépare la revue immunologique pour aider les équipes à résorber le retard accumulé, avec validation humaine obligatoire.',
  metadataBase: new URL('https://github.com/idris404/Ariane'),
  openGraph: {
    title: 'Ariane · Rattraper le retard, garder l’expertise',
    description:
      'Prix de la meilleure solution pour les patients — objectif opérationnel : ramener six mois de file accumulée vers un mois, à confirmer en pilote.',
    images: ['/showcase/signing-queue-full.png'],
  },
  icons: { icon: '/brand/ariane-symbol.png' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
