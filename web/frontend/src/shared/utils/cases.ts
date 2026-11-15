import type { PatientCaseResponse } from '../schemas/patientCase'
import type { SerumEvolution } from '../schemas/serum'
import { ageInYears } from './dates'
import { buildFichePath } from './routes'

// Une ligne des files de cas (« À signer », « À consulter »), prête à afficher.
export type PatientCase = {
  id: string
  patientId: string
  name: string
  detail: string
  historyLabel: string
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
    evolution: item.serum_evolution,
    href: buildFichePath(item.id),
  }
}
