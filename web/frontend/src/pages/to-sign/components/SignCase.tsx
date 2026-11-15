import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

import { SerumGrid, SerumLegend } from '../../../shared/components/SerumEvolution'
import type { SignCase as SignCaseView } from '../utils'

export function SignCase({
  item,
  expanded,
  pending,
  disabled,
  error,
  onToggle,
  onSign,
}: {
  item: SignCaseView
  expanded: boolean
  pending: boolean
  disabled: boolean
  error: string | null
  onToggle: () => void
  onSign: () => void
}) {
  const detailsId = `sign-case-${item.id}`

  return (
    <li className="border-t border-border first:border-t-0">
      <div className="grid items-center gap-4 px-5 py-3 md:grid-cols-[minmax(0,1fr)_16rem_auto]">
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-2">
            <span className="font-medium">{item.name}</span>
            <span className="text-xs text-muted-foreground">{item.patientId}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">
            Profil A · constant
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
            {item.historyLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={detailsId}
            className="w-36 rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
          >
            {expanded ? 'Masquer les tests' : 'Voir les tests'}
          </Button>
          <Button
            type="button"
            onClick={onSign}
            disabled={disabled}
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {pending ? 'Signature…' : 'Signer'}
          </Button>
        </div>
      </div>

      {error === null ? null : (
        <p role="alert" className="px-5 pb-3 text-sm text-destructive-ink">
          {error}
        </p>
      )}

      {expanded ? (
        <div id={detailsId} className="flex flex-col gap-3 bg-background px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <SerumLegend />
            <Link to={item.href} className="text-sm font-medium text-primary">
              Ouvrir la fiche
            </Link>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <SerumGrid evolution={item.evolution} />
          </div>
        </div>
      ) : null}
    </li>
  )
}
