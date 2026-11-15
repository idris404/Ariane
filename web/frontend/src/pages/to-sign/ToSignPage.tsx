import { IMPORT_EMPTY } from '../../constants/import'
import { MOCK_SIGN_KPI } from '../../constants/to-sign'
import { SyntheticDataBadge } from '../../shared/components/DemoNotice'
import { SurfaceState } from '../../shared/components/SurfaceState'
import { AppShell } from '../../shared/components/AppShell'
import { SignCase } from './components/SignCase'
import { useToSign } from './hooks/useToSign'

function Kpi({ label, value, note }: { label: string; value: number | string; note: string }) {
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </article>
  )
}

export function ToSignPage() {
  const toSign = useToSign()

  return (
    <AppShell section="À signer">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
              Validation assistée
            </p>
            <h1 className="mt-1 text-4xl font-bold">Une dernière lecture, votre signature.</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Cas transmis par le serveur pour revue. Vérifiez les données avant de signer.
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            {toSign.remaining} en attente de signature
          </span>
        </div>

        {toSign.isLoading ? (
          <SurfaceState state="loading" title="Chargement des cas à signer…" />
        ) : null}
        {toSign.errorMessage === null ? null : (
          <SurfaceState state="error" title={toSign.errorMessage} />
        )}
        {toSign.isLoading || toSign.errorMessage !== null ? null : (
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <header className="flex items-center gap-2 border-b border-border px-5 py-4">
              <h2 className="text-2xl font-semibold">Cas à signer</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {toSign.cases.length}
              </span>
            </header>
            {toSign.cases.length === 0 ? (
              <div className="p-5">
                {toSign.isImported ? (
                  <SurfaceState state="empty" title="Aucun cas à signer." />
                ) : (
                  <SurfaceState state="empty" title={IMPORT_EMPTY.title}>
                    {IMPORT_EMPTY.hint}
                  </SurfaceState>
                )}
              </div>
            ) : (
              <ul>
                {toSign.cases.map((item) => (
                  <SignCase
                    key={item.id}
                    item={item}
                    expanded={toSign.expandedId === item.id}
                    pending={toSign.pendingId === item.id}
                    disabled={toSign.pendingId !== null}
                    error={toSign.failedId === item.id ? toSign.signError : null}
                    onToggle={() => toSign.onToggle(item.id)}
                    onSign={() => toSign.onSign(item.id)}
                  />
                ))}
              </ul>
            )}
          </section>
        )}
        <details className="panel p-5">
          <summary className="flex min-h-11 cursor-pointer flex-wrap items-center gap-3 font-semibold">
            <span aria-hidden="true">＋</span>Indicateurs de maquette{' '}
            <SyntheticDataBadge simulated />
          </summary>
          <p className="mt-3 mb-5 text-sm text-muted-foreground">
            Hypothèses illustratives. Aucune performance clinique mesurée.
          </p>
          <div className="grid gap-3 md:grid-cols-4">
            <Kpi
              label="Traités hier"
              value={MOCK_SIGN_KPI.yesterday}
              note={MOCK_SIGN_KPI.yesterdayNote}
            />
            <Kpi
              label="Traités cette semaine"
              value={MOCK_SIGN_KPI.week}
              note={MOCK_SIGN_KPI.weekNote}
            />
            <Kpi
              label="Taux d’accord"
              value={MOCK_SIGN_KPI.agreement}
              note={MOCK_SIGN_KPI.agreementNote}
            />
            <Kpi
              label="Relecture"
              value={MOCK_SIGN_KPI.reviewTime}
              note={MOCK_SIGN_KPI.reviewTimeNote}
            />
          </div>
        </details>
      </div>
    </AppShell>
  )
}
