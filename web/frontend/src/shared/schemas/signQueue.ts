import { z } from 'zod'

import { patientCaseSchema } from './patientCase'

// Sortie de GET /signatures/queue (backend/app/signatures/schemas.py : SignQueueRead).
export const signQueueSchema = z.object({
  items: z.array(patientCaseSchema),
  remaining: z.number().int(),
})

export type SignQueue = z.infer<typeof signQueueSchema>
