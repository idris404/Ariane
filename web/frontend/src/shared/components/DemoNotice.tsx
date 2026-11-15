export function SyntheticDataBadge({ simulated = false }: { simulated?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
      <span aria-hidden="true">◇</span>
      <span>{simulated ? 'Exemples simulés' : 'Données synthétiques'}</span>
    </span>
  )
}

export function HumanValidationBanner() {
  return (
    <aside
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
    </aside>
  )
}
