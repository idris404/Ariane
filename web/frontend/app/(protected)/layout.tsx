'use client'

import type { ReactNode } from 'react'

import { AuthGate } from '@/shared/components/AuthGate'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>
}
