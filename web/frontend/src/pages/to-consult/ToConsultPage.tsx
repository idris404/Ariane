import { SurfaceState } from '../../shared/components/SurfaceState'
import { AppShell } from '../../shared/components/AppShell'
import { ConsultCase } from './components/ConsultCase'
import { useToConsult } from './hooks/useToConsult'

export function ToConsultPage() {
  const toConsult = useToConsult()

  return (
    <AppShell section="À consulter">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
              Revue approfondie
            </p>
            <h1 className="mt-1 text-4xl font-bold">Des suivis fluctuants, à lire de près.</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Cas au suivi sérique fluctuant transmis par le serveur. Ouvrez la fiche pour examiner
              les données.
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            {toConsult.total} à consulter
          </span>
        </div>

        {toConsult.isLoading ? (
          <SurfaceState state="loading" title="Chargement des cas à consulter…" />
        ) : null}
        {toConsult.errorMessage === null ? null : (
          <SurfaceState state="error" title={toConsult.errorMessage} />
        )}
        {!toConsult.isLoading && toConsult.errorMessage === null && toConsult.cases.length === 0 ? (
          <SurfaceState state="empty" title="Aucun cas à consulter." />
        ) : null}

        {toConsult.cases.length === 0 ? null : (
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <header className="flex items-center gap-2 border-b border-border px-5 py-4">
              <h2 className="text-2xl font-semibold">Cas à consulter</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {toConsult.cases.length}
              </span>
            </header>
            <ul>
              {toConsult.cases.map((item) => (
                <ConsultCase
                  key={item.id}
                  item={item}
                  expanded={toConsult.expandedId === item.id}
                  onToggle={() => toConsult.onToggle(item.id)}
                />
              ))}
            </ul>
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 text-sm text-muted-foreground">
              <p>
                {toConsult.from}–{toConsult.to} sur {toConsult.total}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-1 disabled:opacity-40"
                  onClick={toConsult.onPrevious}
                  disabled={!toConsult.canPrevious}
                >
                  Précédent
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-1 disabled:opacity-40"
                  onClick={toConsult.onNext}
                  disabled={!toConsult.canNext}
                >
                  Suivant
                </button>
              </div>
            </footer>
          </section>
        )}
      </div>
    </AppShell>
  )
}
