import { z } from 'zod'

import { serumEvolutionSchema } from './serum'

// Un événement de `PatientRead.history` (backend/app/patient_history/) : synthétique, sans dérivation.
export const historyEventSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  detail: z.string(),
  occurred_on: z.iso.date(),
})

// Un `Patient` côté serveur (backend/app/patients/schemas.py : PatientRead), réduit aux champs que
// lisent les files de cas (« À signer », « À consulter »).
export const patientCaseSchema = z.object({
  id: z.uuid(),
  patient_id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  birth: z.iso.date().nullable(),
  history: z.array(historyEventSchema),
  serum_evolution: serumEvolutionSchema,
})

export type PatientCaseResponse = z.infer<typeof patientCaseSchema>
