import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router'

import { ROUTES } from '../../constants/routes'
import { useConsultCount } from '../hooks/useConsultCount'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useLogout } from '../hooks/useLogout'
import { useSignQueue } from '../hooks/useSignQueue'
import { BrandMark } from './BrandMark'
import { HumanValidationBanner } from './DemoNotice'

function itemClass(active: boolean): string {
  return `flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
    active
      ? 'bg-brand-soft text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  }`
}

export function AppShell({ children, section }: { children: ReactNode; section: string }) {
  const { data: user } = useCurrentUser()
  const { data: signQueue } = useSignQueue()
  const consultCount = useConsultCount()
  const { logout, isPending, errorMessage } = useLogout()

  return (
    <div className="min-h-screen bg-background font-sans text-foreground lg:flex">
      <a href="#main-content" className="skip-link">
        Aller au contenu
      </a>
      <aside className="flex shrink-0 flex-col border-b border-border bg-card px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-[236px] lg:border-r lg:border-b-0 lg:px-5 lg:py-8">
        <NavLink to={ROUTES.dashboard} aria-label="Ariane — accueil">
          <BrandMark />
        </NavLink>
        <p className="mt-2 text-xs text-muted-foreground lg:mt-3">La revue, en perspective.</p>
        <p className="eyebrow mt-10 hidden lg:block">Espace de revue</p>
        <nav className="mt-4 flex flex-wrap gap-2 lg:flex-col" aria-label="Navigation principale">
          <NavLink to={ROUTES.dashboard} end className={({ isActive }) => itemClass(isActive)}>
            <span>
              <span aria-hidden="true" className="mr-2">
                ▦
              </span>
              Les dossiers
            </span>
          </NavLink>
          <NavLink to={ROUTES.toSign} className={({ isActive }) => itemClass(isActive)}>
            <span>
              <span aria-hidden="true" className="mr-2">
                ✓
              </span>
              À signer
            </span>
            {signQueue === undefined ? null : (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground">
                {signQueue.remaining}
              </span>
            )}
          </NavLink>
          <NavLink to={ROUTES.toConsult} className={({ isActive }) => itemClass(isActive)}>
            <span>
              <span aria-hidden="true" className="mr-2">
                ◉
              </span>
              À consulter
            </span>
            {consultCount === undefined ? null : (
              <span className="rounded-full bg-destructive-soft px-2 py-0.5 text-xs font-medium text-destructive-ink">
                {consultCount}
              </span>
            )}
          </NavLink>
        </nav>
        <div className="mt-auto hidden rounded-2xl bg-background p-4 lg:block">
          <span aria-hidden="true" className="text-2xl text-primary">
            ◎
          </span>
          <p className="mt-3 font-heading text-sm font-bold">La décision reste humaine.</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Un historique lisible pour accompagner la revue immunologique.
          </p>
        </div>
        <p className="mt-5 hidden text-xs text-muted-foreground lg:block">
          Ariane · Démonstrateur
        </p>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-4 sm:px-8">
          <p className="text-sm text-muted-foreground">
            Revue immunologique{' '}
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span className="text-foreground">{section}</span>
          </p>
          <div className="flex min-w-0 flex-wrap items-center gap-3 text-sm">
            <span className="max-w-64 truncate text-xs text-muted-foreground">{user?.email}</span>
            <Button
              variant="outline"
              type="button"
              onClick={logout}
              disabled={isPending}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-muted disabled:opacity-60"
            >
              Déconnexion
            </Button>
            {errorMessage ? (
              <p role="alert" className="text-sm text-destructive-ink">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8 sm:py-7"
        >
          <HumanValidationBanner />
          <div className="mt-8">{children}</div>
          <footer className="mt-10 border-t border-border py-5 text-xs text-muted-foreground">
            Ariane · Transplantation rénale · Données synthétiques, revue humaine requise
          </footer>
        </main>
      </div>
    </div>
  )
}
