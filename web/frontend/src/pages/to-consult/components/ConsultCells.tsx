import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

import type { SerumEvolution } from '../../../shared/schemas/serum'
import type { PatientCase } from '../../../shared/utils/cases'
import { profileLabel } from '../utils'
import { EventsDialog } from './EventsDialog'

// Cellules du tableau « À consulter » : de la présentation seule, branchée par les colonnes.

export function PatientCell({ item }: { item: PatientCase }) {
  return (
    <span>
      <span className="block font-medium">{item.name}</span>
      <span className="block text-xs text-muted-foreground">{item.patientId}</span>
      <span className="block text-xs text-muted-foreground">{item.detail}</span>
    </span>
  )
}

export function ProfileCell({ evolution }: { evolution: SerumEvolution }) {
  const profile = profileLabel(evolution)
  if (profile === null) return null
  return (
    <span className="rounded-full bg-destructive-soft px-2 py-0.5 text-xs font-medium text-destructive-ink">
      {profile}
    </span>
  )
}

export function EventsCell({ item }: { item: PatientCase }) {
  if (item.events.length === 0) {
    return (
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        {item.historyLabel}
      </span>
    )
  }
  return <EventsDialog patientName={item.name} label={item.historyLabel} events={item.events} />
}

type ActionsCellProps = {
  item: PatientCase
  expanded: boolean
  detailsId: string
  onToggle: () => void
}

export function ActionsCell({ item, expanded, detailsId, onToggle }: ActionsCellProps) {
  return (
    <span className="flex items-center justify-end gap-2">
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
    </span>
  )
}
