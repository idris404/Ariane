import type { Page } from '@playwright/test'
import { IMPORT_STORAGE_KEY, IMPORT_STORAGE_VALUE } from '../src/constants/import'
import { CONSULT_PAGE_SIZE } from '../src/constants/to-consult'

// Presentation tests only. Values copied from backend/app/conftest.py
// (make_patient, make_serum_test, make_history_event) and test_evolution.py.
// IDs are fixed; no random or real patient data. No clinical inference.
export const patientId = '11111111-1111-4111-8111-111111111111'
export const patient = {
  id: patientId,
  patient_id: 'SYN-UI-001',
  firstname: 'Ada',
  lastname: 'Test',
  birth: '1985-03-02',
  gender: 'F',
  city: 'Lille',
  country: 'France',
  created_at: '2026-01-01T00:00:00Z',
  serum_tests: [],
  history: [
    {
      id: '22222222-2222-4222-8222-222222222222',
      patient_id: 'SYN-UI-001',
      kind: 'graft',
      title: 'Greffe rénale',
      detail: 'Donneur décédé · ABO compatible · exemple fictif',
      occurred_on: '2015-08-18',
    },
  ],
  serum_evolution: {
    profile: 'C',
    label: 'fluctuant',
    years: [
      {
        year: 2017,
        test_date: '2017-12-09',
        antigens: [
          { code: 'b12', label: 'B12', value: 40, output: 0 },
          { code: 'b13', label: 'B13', value: 190, output: 0 },
          { code: 'dr53', label: 'DR53', value: 291, output: 0 },
          { code: 'dr51', label: 'DR51', value: 177, output: 0 },
          { code: 'dq10', label: 'DQ10', value: 1870, output: 1 },
        ],
      },
    ],
  },
}

// Cas au profil fluctuant de la file « À consulter » : une page pleine et deux cas de plus. Le
// premier est le patient détaillé ci-dessus, pour que « Voir la fiche » mène à une fiche existante.
export const consultCaseCount = CONSULT_PAGE_SIZE + 2
// Historique : 1 événement (le patient détaillé), 2 pour le deuxième cas, aucun pour le troisième.
const secondEvent = {
  id: '33333333-3333-4333-8333-333333333333',
  patient_id: 'SYN-UI-001',
  kind: 'postop',
  title: 'Suivi postopératoire',
  detail: 'Contrôle à sept jours · exemple fictif',
  occurred_on: '2015-08-25',
}
function consultHistory(index: number) {
  if (index === 1) return [...patient.history, secondEvent]
  return index === 2 ? [] : patient.history
}
export const consultPatients = Array.from({ length: consultCaseCount }, (_, index) => ({
  ...patient,
  id: index === 0 ? patientId : `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  patient_id: `SYN-UI-C${String(index + 1).padStart(2, '0')}`,
  firstname: 'Cas',
  lastname: `Fluctuant ${index + 1}`,
  history: consultHistory(index),
}))

const user = {
  id: patientId,
  email: 'reviewer@example.test',
  is_active: true,
  is_superuser: false,
  is_verified: true,
}
export async function mockApi(
  page: Page,
  options: {
    authenticated?: boolean
    empty?: boolean
    incomplete?: boolean
    error?: boolean
    invalid?: boolean
    delay?: number
    // Faux : arrivée sur le site avant tout import (aucune donnée n'est demandée). Vrai par défaut :
    // les autres tests partent d'un import déjà terminé.
    imported?: boolean
  } = {},
) {
  if (options.imported ?? true) {
    await page.addInitScript(
      ([key, value]) => sessionStorage.setItem(key, value),
      [IMPORT_STORAGE_KEY, IMPORT_STORAGE_VALUE] as const,
    )
  }
  let authenticated = options.authenticated ?? true
  let signed = false
  const requests: { path: string; method: string; body: unknown }[] = []
  await page.route('**/api/v1/**', async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    const path = url.pathname.replace('/api/v1', '')
    requests.push({ path, method: req.method(), body: req.postDataJSON() })
    if (path === '/users/me')
      return route.fulfill({
        status: authenticated ? 200 : 401,
        json: authenticated ? user : { detail: 'Unauthorized' },
      })
    if (path === '/auth/login') {
      authenticated = true
      return route.fulfill({ status: 204 })
    }
    if (path === '/auth/logout') {
      authenticated = false
      return route.fulfill({ status: 204 })
    }
    if (options.delay) await new Promise((resolve) => setTimeout(resolve, options.delay))
    if (options.error) return route.fulfill({ status: 503, json: { detail: 'UNAVAILABLE' } })
    if (path === '/signatures' && req.method() === 'POST') {
      signed = true
      return route.fulfill({ status: 201, json: {} })
    }
    // The signature UI currently receives only profile A; use the backend test
    // profile label, keeping the supplied outputs unchanged.
    if (path === '/signatures/queue')
      return route.fulfill({
        json: {
          items:
            signed || options.empty
              ? []
              : [
                  {
                    ...patient,
                    serum_evolution: {
                      ...patient.serum_evolution,
                      profile: 'A',
                      label: 'constant',
                    },
                  },
                ],
          remaining: signed || options.empty ? 0 : 1,
        },
      })
    if (path === '/consultations/queue') {
      const pageNumber = Number(url.searchParams.get('page') ?? 1)
      const pageSize = Number(url.searchParams.get('page_size') ?? 20)
      const cases = options.empty ? [] : consultPatients
      return route.fulfill({
        json: {
          items: cases.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
          total: cases.length,
          page: pageNumber,
          page_size: pageSize,
        },
      })
    }
    if (path.endsWith('/synthetic-patients'))
      return route.fulfill({ json: { items: [], total: 0, page: 1, page_size: 20 } })
    if (path === `/patients/${patientId}`) {
      const detail = options.incomplete
        ? { ...patient, history: [], serum_evolution: { profile: null, label: null, years: [] } }
        : patient
      return route.fulfill({
        json: options.invalid ? { ...detail, serum_evolution: { profile: 'unknown' } } : detail,
      })
    }
    if (path === '/patients')
      return route.fulfill({
        json: {
          items: options.empty ? [] : [patient],
          total: options.empty ? 0 : 1,
          page: Number(url.searchParams.get('page') ?? 1),
          page_size: Number(url.searchParams.get('page_size') ?? 20),
        },
      })
    return route.fulfill({ status: 404, json: { detail: 'NOT_FOUND' } })
  })
  return requests
}
