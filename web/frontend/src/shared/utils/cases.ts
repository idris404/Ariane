import type { PatientCaseResponse } from '../schemas/patientCase'
import type { SerumEvolution } from '../schemas/serum'
import { ageInYears, formatLongDate } from './dates'
import { buildFichePath } from './routes'

// Un événement d'historique, prêt à afficher : date ISO (pour `<time>`) et date lisible.
export type HistoryEventRow = {
  id: string
  dateIso: string
  dateLabel: string
  title: string
  detail: string
}

// Une ligne des files de cas (« À signer », « À consulter »), prête à afficher.
export type PatientCase = {
  id: string
  patientId: string
  name: string
  detail: string
  historyLabel: string
  events: HistoryEventRow[]
  evolution: SerumEvolution
  href: string
}

function historyLabel(count: number): string {
  if (count === 0) return 'Aucun événement'
  return count === 1 ? '1 événement' : `${count} événements`
}

export function toPatientCase(item: PatientCaseResponse, today: Date): PatientCase {
  const tests = item.serum_evolution.years.length
  const age = item.birth === null ? null : `${ageInYears(item.birth, today)} ans`
  const testsLabel = tests === 1 ? '1 prélèvement' : `${tests} prélèvements`
  return {
    id: item.id,
    patientId: item.patient_id,
    name: `${item.firstname} ${item.lastname}`,
    detail: age === null ? testsLabel : `${age} · ${testsLabel}`,
    historyLabel: historyLabel(item.history.length),
    events: item.history.map((event) => ({
      id: event.id,
      dateIso: event.occurred_on,
      dateLabel: formatLongDate(event.occurred_on),
      title: event.title,
      detail: event.detail,
    })),
    evolution: item.serum_evolution,
    href: buildFichePath(item.id),
  }
}
