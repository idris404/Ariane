import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
export function SyntheticDataBadge({ simulated = false }: { simulated?: boolean }) {
  return (
    <Badge variant="secondary" className="gap-2 px-3 py-1 font-semibold">
      <span aria-hidden="true">◇</span>
      <span>{simulated ? 'Exemples simulés' : 'Données synthétiques'}</span>
    </Badge>
  )
}

export function HumanValidationBanner() {
  return (
    <Alert
      role="note"
      aria-label="Cadre de démonstration"
      className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border bg-card px-4 py-3 text-sm"
    >
      <SyntheticDataBadge />
      <p className="font-medium">
        <span aria-hidden="true" className="mr-2 text-primary">
          ◎
        </span>
        <span>Validation humaine obligatoire</span>
      </p>
      <p className="text-xs text-muted-foreground">
        Démonstrateur · sans décision autonome · non validé cliniquement
      </p>
    </Alert>
  )
}
