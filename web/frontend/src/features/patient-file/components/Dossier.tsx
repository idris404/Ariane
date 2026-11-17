import type { LegacyReactTable } from '@tanstack/react-table/legacy'

import { Button } from '@/components/ui/button'

import { mockClinical, type PatientFile, type RenalRow } from '../utils'
import { RecipientTimeline } from '../../../shared/components/RecipientTimeline'
import { ReviewLimits } from './ReviewLimits'
import { FollowUpIllustration } from './FollowUpIllustration'
import { SerumProfile } from '../../../shared/components/SerumEvolution'

export function Dossier({ file, table }: { file: PatientFile; table: LegacyReactTable<RenalRow> }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
            Dossier de transplantation rénale
          </p>
          <h1 className="mt-1 text-4xl font-bold">Fiche patient</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled
            variant="outline"
            title="Export non disponible dans ce démonstrateur"
          >
            Exporter le dossier
          </Button>
          <Button
            type="button"
            disabled
            title="Modification non disponible dans ce démonstrateur"
          >
            Modifier le dossier
          </Button>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">{file.fullName}</h2>
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                {file.statusLabel}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{file.summary}</p>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Groupe sanguin · simulé</dt>
              <dd className="font-medium">{mockClinical.bloodGroup}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{file.organLabel}</dt>
              <dd className="font-medium">{file.graftDateLabel ?? 'Date inconnue'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Référent · simulé</dt>
              <dd className="font-medium">{file.referringDoctor}</dd>
            </div>
          </dl>
        </div>
      </section>

      <nav
        aria-label="Sections du dossier"
        className="flex flex-wrap gap-3 text-sm font-semibold text-primary"
      >
        <Button asChild variant="outline"><a href="#recipient-timeline">↓ Historique du receveur</a></Button>
        <Button asChild variant="outline"><a href="#serum-history">↓ Évolution sérique</a></Button>
        <Button asChild variant="outline"><a href="#review-limits">↓ Limites et incertitudes</a></Button>
      </nav>
      <RecipientTimeline history={file.history} />
      <SerumProfile evolution={file.serumEvolution} />
      <ReviewLimits />
      <FollowUpIllustration file={file} table={table} />
    </div>
  )
}
