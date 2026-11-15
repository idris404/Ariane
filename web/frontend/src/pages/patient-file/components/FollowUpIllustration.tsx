import { flexRender } from '@tanstack/react-table'
import type { LegacyReactTable } from '@tanstack/react-table/legacy'
import { mockClinical, type PatientFile, type RenalRow } from '../utils'
import { SyntheticDataBadge } from '../../../shared/components/DemoNotice'
import { SurfaceState } from '../../../shared/components/SurfaceState'

export function FollowUpIllustration({
  file,
  table,
}: {
  file: PatientFile
  table: LegacyReactTable<RenalRow>
}) {
  return (
    <details className="panel p-5">
      <summary className="flex min-h-11 cursor-pointer flex-wrap items-center gap-3 font-semibold">
        <span aria-hidden="true">＋</span>Parcours et suivi illustratifs{' '}
        <SyntheticDataBadge simulated />
      </summary>
      <p className="mt-3 mb-5 text-sm text-muted-foreground">
        Exemples fixes issus de la maquette, avec des dates dérivées de la greffe. Ces valeurs,
        traitements et mentions de revue ne sont pas une évaluation de ce dossier.
      </p>
      <div className="flex flex-col gap-5">
        {file.steps.length === 0 ? (
          <SurfaceState state="incomplete" title="Date de greffe non renseignée" />
        ) : (
          <ol className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 rounded-xl border border-border bg-card px-6 py-4">
            {file.steps.map((step, index) => (
              <li key={step.index} className="relative">
                {index < file.steps.length - 1 ? (
                  <span className="absolute top-4 left-8 right-0 hidden xl:block h-px bg-border" />
                ) : null}
                <div className="relative flex items-start gap-3">
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                      step.note === 'J+7'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-brand-soft text-primary'
                    }`}
                  >
                    {step.index}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{step.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {step.dateLabel}
                      {step.note ? ` · ${step.note}` : ''}
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="min-w-0 rounded-xl border border-border bg-card p-5">
            <header className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">01 Données préopératoires</h2>
              <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Archivé
              </span>
            </header>
            <p className="mt-1 text-xs text-muted-foreground">
              {file.preopDateLabel === null
                ? 'Pas de date de greffe dans le dossier'
                : `Bilan du ${file.preopDateLabel} · Avant transplantation`}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Fact label="Néphropathie initiale" value={file.disease} />
              <Fact label="Suppléance rénale" value={file.dialysis} />
              <Fact label="Donneur" value={file.donor} />
            </dl>
            <div className="mt-4 rounded-lg bg-background p-3 text-sm">
              <p>
                Créatinine / DFGe{' '}
                <strong>
                  {mockClinical.preopCreatinine} µmol/L / {mockClinical.preopDfg} mL/min/1,73 m²
                </strong>
              </p>
              <p className="mt-1">
                Groupe / cPRA{' '}
                <strong>
                  {mockClinical.bloodGroup} / {mockClinical.cpraPercent} %
                </strong>
              </p>
              <p className="mt-1">
                Bilan biologique{' '}
                <strong>
                  K+ {mockClinical.potassium} · Hb {mockClinical.hemoglobin}
                </strong>
              </p>
            </div>
          </article>

          <article className="min-w-0 rounded-xl border border-border bg-card p-5">
            <h2 className="text-2xl font-semibold">02 Données postopératoires</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {file.postopDateLabel === null ? 'J+7' : `${file.postopDateLabel} · J+7`}
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Metric
                label="Créatinine"
                value={String(mockClinical.postopCreatinine)}
                unit="µmol/L"
              />
              <Metric label="DFGe" value={String(mockClinical.postopDfg)} unit="mL/min/1,73 m²" />
              <Metric label="Diurèse" value={mockClinical.postopDiuresis} unit="mL / 24 h" />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Fact label="Pression artérielle" value={mockClinical.bloodPressure} />
              <Fact label="Température" value={mockClinical.temperature} />
              <Fact label="Kaliémie" value={mockClinical.postopPotassium} />
              <Fact label="Écho-Doppler du greffon" value={mockClinical.doppler} />
            </dl>
          </article>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <article className="min-w-0 rounded-xl border border-border bg-card p-5">
            <h2 className="text-2xl font-semibold">Évolution de la fonction rénale</h2>
            <div
              className="data-scroll mt-4"
              role="region"
              aria-label="Fonction rénale simulée"
              tabIndex={0}
            >
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Exemples simulés de fonction rénale</caption>
                <thead className="bg-background text-xs text-muted-foreground">
                  {table.getHeaderGroups().map((group) => (
                    <tr key={group.id}>
                      {group.headers.map((header) => (
                        <th scope="col" key={header.id} className="px-3 py-2 font-medium">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={row.original.emphasized ? 'bg-brand-soft' : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3 py-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              DFGe estimé · valeurs fictives calées sur la date de greffe.
            </p>
          </article>

          <article className="min-w-0 rounded-xl border border-border bg-card p-5">
            <h2 className="text-2xl font-semibold">Traitement et vigilance</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {mockClinical.treatments.map((treatment) => (
                <li key={treatment.name}>
                  <p className="font-medium">{treatment.name}</p>
                  <p className="text-xs text-muted-foreground">{treatment.detail}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg border border-warning bg-warning-soft px-3 py-2 text-sm text-warning-foreground">
              Dosage résiduel en attente
            </p>
          </article>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="min-w-0 rounded-xl border border-border bg-card p-5">
            <h2 className="text-2xl font-semibold text-primary">Prochain suivi</h2>
            <p className="mt-2 text-lg font-semibold">
              {file.consultationDateLabel ?? 'Date inconnue'} · {mockClinical.consultationTime}
            </p>
            <p className="text-sm text-muted-foreground">Consultation de néphrologie · J+10</p>
            <p className="mt-2 text-sm">Bilan prévu : {mockClinical.plannedLabs}</p>
          </article>
          <article className="min-w-0 rounded-xl border border-border bg-card p-5">
            <h2 className="text-2xl font-semibold">Revue et traçabilité</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Dernière revue : {file.referringDoctor}
              {file.postopDateLabel ? ` · ${file.postopDateLabel}` : ''}
            </p>
            <p className="mt-3 inline-block rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              Compte rendu à signer
            </p>
          </article>
        </div>
      </div>
    </details>
  )
}

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value ?? 'Non renseigné'}</dd>
    </div>
  )
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-lg bg-background px-3 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{unit}</p>
    </div>
  )
}
