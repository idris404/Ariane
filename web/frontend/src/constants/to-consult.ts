export const consultKeys = {
  all: ['consultations'] as const,
  queue: (page: number, pageSize: number) => ['consultations', 'queue', page, pageSize] as const,
}

// Cas par page de la liste « À consulter » (maximum côté serveur : backend/app/constants/pagination.py).
export const CONSULT_PAGE_SIZE = 5
// La barre latérale ne lit que le total : une page d'un seul cas suffit.
export const CONSULT_COUNT_PAGE_SIZE = 1
export const FIRST_PAGE = 1

// Identifiant de la colonne des boutons (alignée à droite dans le tableau).
export const ACTIONS_COLUMN_ID = 'actions'

// Volet déplié sous une ligne du tableau : un seul à la fois par ligne (les tests sériques ou les
// événements d'historique).
export const CONSULT_PANELS = { tests: 'tests', events: 'events' } as const
export type ConsultPanel = (typeof CONSULT_PANELS)[keyof typeof CONSULT_PANELS]

export const TO_CONSULT_ERRORS = {
  queue: 'La liste des cas à consulter est indisponible pour le moment.',
  invalid: 'La réponse du serveur est invalide.',
} as const
