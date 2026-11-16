import type { PatientResponse } from '../../features/patient-file/schemas'
import { formatLongDate } from '../utils/dates'
import { SurfaceState } from './SurfaceState'

export function RecipientTimeline({ history }: { history: PatientResponse['history'] }) {
  return (
    <section
      id="recipient-timeline"
      aria-labelledby="timeline-title"
      className="panel scroll-mt-6 p-5 sm:p-6"
    >
      <p className="eyebrow">Le dossier dans le temps</p>
      <h2 id="timeline-title" className="mt-2">
        Historique du receveur
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Événements synthétiques transmis par le serveur.
      </p>
      {history.length === 0 ? (
        <div className="mt-5">
          <SurfaceState state="incomplete" title="Historique non renseigné">
            Aucun événement transmis. Cela ne confirme pas l’absence d’antécédents.
          </SurfaceState>
        </div>
      ) : (
        <ol className="mt-6 ml-2 border-l border-border">
          {history.map((event) => (
            <li key={event.id} className="relative pb-7 pl-7 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-1 -left-1.5 size-3 rounded-full border-2 border-primary bg-card"
              />
              <time
                dateTime={event.occurred_on}
                className="text-xs font-medium text-muted-foreground"
              >
                {formatLongDate(event.occurred_on)}
              </time>
              <h3 className="mt-1 text-lg font-semibold">{event.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
