import { z } from 'zod'

import { serumEvolutionSchema } from './serum'

// Un `Patient` côté serveur (backend/app/patients/schemas.py : PatientRead), réduit aux champs que
// lisent les files de cas (« À signer », « À consulter »).
export const patientCaseSchema = z.object({
  id: z.uuid(),
  patient_id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  birth: z.iso.date().nullable(),
  history: z.array(z.object({ id: z.uuid() })),
  serum_evolution: serumEvolutionSchema,
})

export type PatientCaseResponse = z.infer<typeof patientCaseSchema>
