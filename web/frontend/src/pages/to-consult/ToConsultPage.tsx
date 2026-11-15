import { IMPORT_EMPTY } from '../../constants/import'
import { SurfaceState } from '../../shared/components/SurfaceState'
import { AppShell } from '../../shared/components/AppShell'
import { ConsultTable } from './components/ConsultTable'
import { useToConsult } from './hooks/useToConsult'

export function ToConsultPage() {
  const toConsult = useToConsult()

  return (
    <AppShell section="À consulter">
      <div className="flex flex-col gap-5">
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

        {toConsult.isLoading ? (
          <SurfaceState state="loading" title="Chargement des cas à consulter…" />
        ) : null}
        {toConsult.errorMessage === null ? null : (
          <SurfaceState state="error" title={toConsult.errorMessage} />
        )}
        {toConsult.isLoading || toConsult.errorMessage !== null ? null : (
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <header className="flex items-center gap-2 border-b border-border px-5 py-4">
              <h2 className="text-2xl font-semibold">Cas à consulter</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {toConsult.table.getRowModel().rows.length}
              </span>
            </header>
            <ConsultTable
              table={toConsult.table}
              panels={toConsult.panels}
              empty={
                toConsult.isImported ? (
                  <SurfaceState state="empty" title="Aucun cas à consulter." />
                ) : (
                  <SurfaceState state="empty" title={IMPORT_EMPTY.title}>
                    {IMPORT_EMPTY.hint}
                  </SurfaceState>
                )
              }
            />
            {toConsult.total === 0 ? null : (
              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 text-sm text-muted-foreground">
                <p>
                  Page {toConsult.page}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-border px-3 py-1 disabled:opacity-40"
                    onClick={() => toConsult.table.previousPage()}
                    disabled={!toConsult.table.getCanPreviousPage()}
                  >
                    Précédent
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-border px-3 py-1 disabled:opacity-40"
                    onClick={() => toConsult.table.nextPage()}
                    disabled={!toConsult.table.getCanNextPage()}
                  >
                    Suivant
                  </button>
                </div>
              </footer>
            )}
          </section>
        )}
      </div>
    </AppShell>
  )
}
