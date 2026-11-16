'use client'

import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import { ROUTES } from '../../constants/routes'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { SessionStatusScreen } from './SessionStatusScreen'

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: user, isPending, isError, refetch } = useCurrentUser()

  useEffect(() => {
    if (!isPending && !isError && !user) router.replace(ROUTES.login)
  }, [isError, isPending, router, user])

  if (isPending || isError) {
    return <SessionStatusScreen isError={isError} onRetry={() => void refetch()} />
  }
  return user ? children : null
}

export function GuestGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: user, isPending, isError, refetch } = useCurrentUser()

  useEffect(() => {
    if (!isPending && !isError && user) router.replace(ROUTES.dashboard)
  }, [isError, isPending, router, user])

  if (isPending || isError) {
    return <SessionStatusScreen isError={isError} onRetry={() => void refetch()} />
  }
  return user ? null : children
}
