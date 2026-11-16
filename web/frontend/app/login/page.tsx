'use client'

import { LoginPage } from '@/features/login/LoginPage'
import { GuestGate } from '@/shared/components/AuthGate'

export default function Page() {
  return (
    <GuestGate>
      <LoginPage />
    </GuestGate>
  )
}
