import { z } from 'zod'

import { TO_CONSULT_ERRORS } from '../../constants/to-consult'
import type { SerumEvolution } from '../../shared/schemas/serum'

export function consultErrorMessage(error: unknown): string {
  return error instanceof z.ZodError ? TO_CONSULT_ERRORS.invalid : TO_CONSULT_ERRORS.queue
}

// « Profil C · fluctuant », lu dans la réponse du serveur ; `null` sans profil.
export function profileLabel(evolution: SerumEvolution): string | null {
  if (evolution.profile === null) return null
  return evolution.label === null
    ? `Profil ${evolution.profile}`
    : `Profil ${evolution.profile} · ${evolution.label}`
}

// Identifiant de la ligne de détail (les tests sériques) d'une ligne du tableau.
export function detailsRowId(rowId: string): string {
  return `consult-details-${rowId}`
}
