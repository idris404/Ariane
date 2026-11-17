import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import type { HistoryEventRow } from '../../../shared/utils/cases'

// Sous-tableau des événements d'un patient, déplié sous sa ligne (comme la grille des tests).
export function EventsSubTable({
  patientName,
  events,
}: {
  patientName: string
  events: readonly HistoryEventRow[]
}) {
  return (
    <div
      className="data-scroll rounded-lg border border-border bg-card"
      role="region"
      aria-label={`Événements de ${patientName}`}
      tabIndex={0}
    >
      <Table className="text-left">
        <TableCaption className="sr-only">
          Événements synthétiques transmis par le serveur, du plus ancien au plus récent
        </TableCaption>
        <TableHeader className="bg-background text-xs text-muted-foreground">
          <TableRow>
            <TableHead scope="col" className="w-48 px-3 py-2">
              Date
            </TableHead>
            <TableHead scope="col" className="px-3 py-2">
              Événement
            </TableHead>
            <TableHead scope="col" className="px-3 py-2">
              Détail
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="px-3 py-2 align-top text-muted-foreground">
                <time dateTime={event.dateIso}>{event.dateLabel}</time>
              </TableCell>
              <TableCell className="px-3 py-2 align-top font-medium">{event.title}</TableCell>
              <TableCell className="px-3 py-2 align-top text-muted-foreground">{event.detail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
