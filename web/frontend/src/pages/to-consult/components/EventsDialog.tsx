import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { HistoryEventRow } from '../../../shared/utils/cases'

type EventsDialogProps = {
  patientName: string
  // « 7 événements » : le libellé de la colonne, repris sur le bouton.
  label: string
  events: readonly HistoryEventRow[]
}

// Le bouton de la colonne « événements » : il ouvre la liste des événements du patient.
export function EventsDialog({ patientName, label, events }: EventsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="xs"
          aria-label={`${label} de ${patientName}`}
          className="min-h-8 rounded-full px-3 py-0.5 font-normal text-muted-foreground hover:text-foreground"
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Événements de {patientName}</DialogTitle>
          <DialogDescription>
            Événements synthétiques transmis par le serveur, du plus ancien au plus récent.
          </DialogDescription>
        </DialogHeader>
        <ol aria-label="Événements" className="flex flex-col">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-0.5 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
            >
              <time dateTime={event.dateIso} className="text-xs font-medium text-muted-foreground">
                {event.dateLabel}
              </time>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.detail}</p>
            </li>
          ))}
        </ol>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
