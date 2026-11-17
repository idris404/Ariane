import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { SerumEvolution } from '../schemas/serum'
import { SurfaceState } from './SurfaceState'

const profileTone = {
  A: 'bg-accent text-accent-foreground',
  B: 'bg-warning-soft text-warning-foreground',
  C: 'bg-destructive-soft text-destructive-ink',
} as const

function Result({ output, value }: { output: 0 | 1; value: number }) {
  const positive = output === 1
  return (
    <span
      className={`font-medium tabular-nums ${positive ? 'text-destructive-ink' : 'text-accent-foreground'}`}
    >
      {value.toLocaleString('fr-FR')}
      <span className="mt-1 block text-xs">
        <span aria-hidden="true">{positive ? '+ ' : '− '}</span>
        {positive ? 'Positif' : 'Négatif'}
      </span>
    </span>
  )
}

export function SerumGrid({ evolution }: { evolution: SerumEvolution }) {
  const headers = [
    ...new Map(
      evolution.years.flatMap((year) => year.antigens).map((antigen) => [antigen.code, antigen]),
    ).values(),
  ]

  if (evolution.years.length === 0) {
    return (
      <SurfaceState state="empty" title="Aucun prélèvement sérique transmis">
        Un historique vide ne constitue pas un résultat négatif.
      </SurfaceState>
    )
  }
  return (
    <div
      className="data-scroll"
      role="region"
      aria-label="Résultats sériques par année"
      tabIndex={0}
    >
      <Table className="text-left">
        <TableCaption className="sr-only">
          Valeurs et interprétations sériques fournies par le serveur
        </TableCaption>
        <TableHeader className="bg-background text-xs text-muted-foreground">
          <TableRow>
            <TableHead scope="col" className="w-20 px-3 py-2">
              Année
            </TableHead>
            {headers.map((antigen) => (
              <TableHead scope="col" key={antigen.code} className="px-3 py-2 text-center">
                {antigen.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {evolution.years.map((year) => (
            <TableRow key={year.test_date}>
              <TableHead scope="row" className="px-3 py-3 text-left font-medium text-foreground">
                {year.year}
              </TableHead>
              {headers.map((header) => {
                const antigen = year.antigens.find((point) => point.code === header.code)
                return (
                  <TableCell key={header.code} className="px-3 py-3 text-center">
                    {antigen ? (
                      <Result output={antigen.output} value={antigen.value} />
                    ) : (
                      <span className="text-xs text-muted-foreground">— Non transmis</span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function SerumLegend() {
  return (
    <p className="flex flex-wrap items-center gap-4 text-xs font-medium">
      <span className="text-accent-foreground">− Négatif</span>
      <span className="text-destructive-ink">+ Positif</span>
    </p>
  )
}

export function SerumProfile({ evolution }: { evolution: SerumEvolution }) {
  const tone = evolution.profile === null ? null : profileTone[evolution.profile]

  return (
    <section id="serum-history" className="scroll-mt-6 rounded-xl border border-border bg-card p-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
            Profil sérique
          </p>
          <h2 className="mt-1 text-2xl font-semibold">Évolution des antigènes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Valeurs et libellés du serveur. Interprétations simulées à vérifier lors de la revue.
          </p>
        </div>
        {evolution.profile !== null && evolution.label !== null && tone !== null ? (
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${tone}`}>
            <span className="text-3xl font-semibold">{evolution.profile}</span>
            <span>
              <span className="block text-xs font-medium tracking-[0.14em] uppercase">Profil</span>
              <span className="block text-lg font-semibold capitalize">{evolution.label}</span>
            </span>
          </div>
        ) : (
          <span className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            Profil non renseigné
          </span>
        )}
      </header>

      <div className="mt-4">
        <SerumLegend />
      </div>
      <div className="mt-4">
        <SerumGrid evolution={evolution} />
      </div>
    </section>
  )
}
