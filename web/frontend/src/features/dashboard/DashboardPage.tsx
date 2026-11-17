import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'

import { MOCK_KPI } from '../../constants/dashboard'
import { IMPORT_EMPTY } from '../../constants/import'
import { GENDER_LABELS } from '../../constants/patient-file'
import { PAGE_SIZE_OPTIONS } from '../../constants/pagination'
import { SyntheticDataBadge } from '../../shared/components/DemoNotice'
import { SurfaceState } from '../../shared/components/SurfaceState'
import { AppShell } from '../../shared/components/AppShell'
import { ImportDialog } from './components/ImportDialog'
import { usePatientList } from './hooks/usePatientList'

function Kpi({
  label,
  value,
  note,
  noteClass,
}: {
  label: string
  value: number
  note: string
  noteClass: string
}) {
  return (
    <Card role="article" className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className={`mt-1 text-xs ${noteClass}`}>{note}</p>
    </Card>
  )
}

export function DashboardPage() {
  const list = usePatientList()
  const from = list.total === 0 ? 0 : (list.page - 1) * list.pageSize + 1
  const to = Math.min(list.page * list.pageSize, list.total)

  return (
    <AppShell section="Vue d’ensemble">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
              Suivi des greffes rénales
            </p>
            <h1 className="mt-1 text-4xl font-bold">Le contexte, avant la revue.</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ouvrez un dossier synthétique pour parcourir son historique et les résultats
              disponibles.
            </p>
          </div>
          <ImportDialog />
        </div>

        <section className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
          <header className="flex shrink-0 items-center justify-between gap-3 px-5 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold">Liste des patients</h2>
              <Badge variant="secondary">{list.total}</Badge>
            </div>
            <Button
              type="button"
              disabled
              variant="outline"
              size="sm"
              title="Export non disponible dans ce démonstrateur"
            >
              Exporter
            </Button>
          </header>

          <div className="mt-4 flex shrink-0 flex-wrap items-center gap-2 px-5">
            <label className="sr-only" htmlFor="patient-search">
              Rechercher un patient
            </label>
            <Input
              id="patient-search"
              value={list.draft}
              onChange={(event) => list.onSearchChange(event.target.value)}
              placeholder="Rechercher un identifiant, un nom…"
              className="min-w-0 basis-full sm:basis-64 flex-1"
            />
            <label className="sr-only" htmlFor="patient-gender">
              Sexe
            </label>
            <Select value={list.gender ?? 'all'} onValueChange={(value) => list.onGenderChange(value === 'all' ? '' : value)}>
              <SelectTrigger id="patient-gender" className="w-[10rem]"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Tous les sexes</SelectItem><SelectItem value="F">{GENDER_LABELS.F}</SelectItem><SelectItem value="M">{GENDER_LABELS.M}</SelectItem></SelectContent>
            </Select>
            <span className="flex flex-wrap items-center gap-2">
              <Select disabled value="all"><SelectTrigger aria-label="Type de suppléance" className="w-[11rem] text-muted-foreground"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Toute suppléance</SelectItem></SelectContent></Select>
              <Select disabled value="all"><SelectTrigger aria-label="Statut du dossier" className="w-[10rem] text-muted-foreground"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem></SelectContent></Select>
            </span>
          </div>

          <div
            className="data-scroll mt-4 min-h-0"
            role="region"
            aria-label="Liste des patients"
            tabIndex={0}
          >
            {list.isLoading ? (
              <SurfaceState state="loading" title="Chargement des patients…" />
            ) : null}
            {list.errorMessage ? <SurfaceState state="error" title={list.errorMessage} /> : null}
            {list.errorMessage === null && !list.isLoading && list.total === 0 ? (
              list.isImported ? (
                <SurfaceState state="empty" title="Aucun patient ne correspond à cette recherche." />
              ) : (
                <SurfaceState state="empty" title={IMPORT_EMPTY.title}>
                  {IMPORT_EMPTY.hint}
                </SurfaceState>
              )
            ) : null}

            {list.errorMessage === null && list.total > 0 ? (
              <Table className="text-left">
                <TableCaption className="sr-only">
                  Dossiers synthétiques disponibles pour la revue
                </TableCaption>
                <TableHeader className="sticky top-0 z-10 bg-background text-xs text-muted-foreground">
                  {list.table.getHeaderGroups().map((group) => (
                    <TableRow key={group.id}>
                      {group.headers.map((header) => (
                        <TableHead scope="col" key={header.id} className="px-5 py-2">
                          {header.column.getCanSort() ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="-ml-3 font-medium"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getIsSorted() === 'asc' ? ' ↑' : null}
                              {header.column.getIsSorted() === 'desc' ? ' ↓' : null}
                            </Button>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {list.table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-5 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </div>

          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 text-sm text-muted-foreground">
            <p>
              {from}–{to} sur {list.total}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="page-size">Afficher</label>
              <Select value={String(list.pageSize)} onValueChange={(value) => list.onPageSizeChange(Number(value))}>
                <SelectTrigger id="page-size" className="h-9 w-[8.5rem]"><SelectValue /></SelectTrigger>
                <SelectContent>{PAGE_SIZE_OPTIONS.map((size) => <SelectItem key={size} value={String(size)}>{size} par page</SelectItem>)}</SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => list.table.previousPage()}
                disabled={!list.table.getCanPreviousPage()}
              >
                Précédent
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => list.table.nextPage()}
                disabled={!list.table.getCanNextPage()}
              >
                Suivant
              </Button>
            </div>
          </footer>
        </section>

        <Collapsible className="panel p-5">
          <CollapsibleTrigger asChild><Button variant="ghost" className="group -ml-3 min-h-11 flex-wrap justify-start font-semibold"><span aria-hidden="true" className="transition-transform group-data-[state=open]:rotate-45">＋</span>Illustrations du suivi <SyntheticDataBadge simulated /></Button></CollapsibleTrigger>
          <CollapsibleContent>
          <p className="mt-3 mb-5 text-sm text-muted-foreground">
            Chiffres et dossiers fixes de la maquette. Ils ne décrivent pas la liste ci-dessus et ne
            mesurent aucune performance clinique.
          </p>
          <div className="grid gap-3 md:grid-cols-4">
            <Kpi
              label="Patients en attente"
              value={MOCK_KPI.waiting}
              note={MOCK_KPI.waitingNote}
              noteClass="text-muted-foreground"
            />
            <Kpi
              label="Dossiers à valider"
              value={MOCK_KPI.toValidate}
              note={MOCK_KPI.toValidateNote}
              noteClass="text-muted-foreground"
            />
            <Kpi
              label="Résultats douteux"
              value={MOCK_KPI.doubtful}
              note={MOCK_KPI.doubtfulNote}
              noteClass="text-warning-foreground"
            />
            <Kpi
              label="Dossiers à jour"
              value={MOCK_KPI.upToDate}
              note={MOCK_KPI.upToDateNote}
              noteClass="text-accent-foreground"
            />
          </div>

          <div className="mt-5">
            {' '}
            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-xl border border-border bg-card p-5">
                <header className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Validation</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {MOCK_KPI.toValidate}
                    </span>
                  </div>
                </header>
                <p className="mt-2 text-sm text-muted-foreground">
                  Les dossiers prêts pour votre revue médicale.
                </p>
                <ul className="mt-4 divide-y divide-border text-sm">
                  <li className="flex items-center justify-between py-3">
                    <span>
                      <span className="block font-medium">PT-2026-0148</span>
                      <span className="text-xs text-muted-foreground">
                        Bilan pré-greffe complet
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">Reçu à 09:42</span>
                  </li>
                  <li className="flex items-center justify-between py-3">
                    <span>
                      <span className="block font-medium">PT-2026-0144</span>
                      <span className="text-xs text-muted-foreground">
                        Mise à jour du dossier clinique
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">Reçu à 08:15</span>
                  </li>
                </ul>
              </article>
              <article className="rounded-xl border border-warning bg-card p-5">
                <header className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Résultats douteux</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-warning-soft px-2 py-0.5 text-xs text-warning-foreground">
                      {MOCK_KPI.doubtful}
                    </span>
                  </div>
                </header>
                <p className="mt-2 text-sm text-muted-foreground">
                  Une interprétation biologique est nécessaire.
                </p>
                <ul className="mt-4 divide-y divide-border text-sm">
                  <li className="flex items-center justify-between py-3">
                    <span>
                      <span className="block font-medium">PT-2026-0147</span>
                      <span className="text-xs text-muted-foreground">
                        Sérologie CMV · Résultat équivoque
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center justify-between py-3">
                    <span>
                      <span className="block font-medium">PT-2026-0142</span>
                      <span className="text-xs text-muted-foreground">
                        Typage HLA · Discordance à vérifier
                      </span>
                    </span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </AppShell>
  )
}
