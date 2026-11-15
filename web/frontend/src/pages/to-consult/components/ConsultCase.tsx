import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

import { SerumGrid, SerumLegend } from '../../../shared/components/SerumEvolution'
import type { PatientCase } from '../../../shared/utils/cases'
import { profileLabel } from '../utils'

export function ConsultCase({
  item,
  expanded,
  onToggle,
}: {
  item: PatientCase
  expanded: boolean
  onToggle: () => void
}) {
  const detailsId = `consult-case-${item.id}`
  const profile = profileLabel(item.evolution)

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
          {profile === null ? null : (
            <span className="rounded-full bg-destructive-soft px-2 py-0.5 font-medium text-destructive-ink">
              {profile}
            </span>
          )}
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
            asChild
            className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
          >
            <Link to={item.href} aria-label={`Voir la fiche de ${item.name}`}>
              Voir la fiche
            </Link>
          </Button>
        </div>
      </div>

      {expanded ? (
        <div id={detailsId} className="flex flex-col gap-3 bg-background px-5 py-4">
          <SerumLegend />
          <div className="rounded-lg border border-border bg-card">
            <SerumGrid evolution={item.evolution} />
          </div>
        </div>
      ) : null}
    </li>
  )
}
