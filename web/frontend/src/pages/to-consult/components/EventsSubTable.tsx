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
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          Événements synthétiques transmis par le serveur, du plus ancien au plus récent
        </caption>
        <thead className="bg-background text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="w-48 px-3 py-2 font-medium">
              Date
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Événement
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Détail
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t border-border">
              <td className="px-3 py-2 align-top text-muted-foreground">
                <time dateTime={event.dateIso}>{event.dateLabel}</time>
              </td>
              <td className="px-3 py-2 align-top font-medium">{event.title}</td>
              <td className="px-3 py-2 align-top text-muted-foreground">{event.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
