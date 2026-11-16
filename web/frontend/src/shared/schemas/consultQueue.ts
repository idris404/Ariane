import { z } from 'zod'

import { patientCaseSchema } from './patientCase'

// Sortie de GET /consultations/queue (backend/app/core/pagination.py : Page[PatientRead]).
export const consultQueueSchema = z.object({
  items: z.array(patientCaseSchema),
  total: z.number().int(),
  page: z.number().int(),
  page_size: z.number().int(),
})

export type ConsultQueue = z.infer<typeof consultQueueSchema>
