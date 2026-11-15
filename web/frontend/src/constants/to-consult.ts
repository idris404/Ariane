export const consultKeys = {
  all: ['consultations'] as const,
  queue: (page: number, pageSize: number) => ['consultations', 'queue', page, pageSize] as const,
}

// Cas par page de la liste « À consulter » (maximum côté serveur : backend/app/constants/pagination.py).
export const CONSULT_PAGE_SIZE = 10
// La barre latérale ne lit que le total : une page d'un seul cas suffit.
export const CONSULT_COUNT_PAGE_SIZE = 1
export const FIRST_PAGE = 1

export const TO_CONSULT_ERRORS = {
  queue: 'La liste des cas à consulter est indisponible pour le moment.',
  invalid: 'La réponse du serveur est invalide.',
} as const
