import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockApi, patient, patientId } from './fixtures'

test.beforeEach(async ({ page }) => {
  // No internet dependency is allowed while exercising the local UI.
  await page.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(host) ? route.fallback() : route.abort()
  })
})

test('public landing presents the award, product and responsible-use boundary', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Clear the backlog. Keep the expertise.',
    }),
  ).toBeVisible()
  await expect(
    page
      .locator('[data-slot="badge"]')
      .filter({ hasText: 'Best Patient Solution Award' }),
  ).toBeVisible()
  await expect(page.getByText('6 → 1 months')).toBeVisible()
  await expect(page.getByLabel('Ariane demonstration video')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Play video' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Enter fullscreen' })).toBeVisible()
  await expect(page.getByText('Product proof today. Impact proof tomorrow.')).toBeVisible()
  await expect(page.getByText('To measure in a pilot', { exact: true })).toBeVisible()
  await expect(page.getByText('Accelerate preparation. Never the decision.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toBeVisible()
  const navigation = page.locator('header')
  await page.evaluate(() => window.scrollTo(0, 900))
  await expect.poll(async () => Math.round((await navigation.boundingBox())?.y ?? -1)).toBe(0)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page.getByText('44 secondes · parcours local · données synthétiques')).toHaveCount(0)
  await expect(page.getByText('TanStack Query')).toHaveCount(0)
  await page.getByLabel('Language').click()
  await page.getByRole('option', { name: 'FR' }).click()
  await expect(
    page.getByRole('heading', { level: 1, name: 'Rattraper le retard. Garder l’expertise.' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Lire la vidéo' }).first()).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(accessibility.violations).toEqual([])
})

async function assertLayout(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await expect(page.getByText('Validation humaine obligatoire', { exact: true })).toBeVisible()
  await expect(page.getByText('Données synthétiques', { exact: true })).toBeVisible()
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(accessibility.violations).toEqual([])
}

test('login, keyboard focus, local fonts and simulated session flow', async ({ page }) => {
  const external: string[] = []
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) {
      external.push(url.href)
      return route.abort()
    }
    return route.fallback()
  })
  await mockApi(page, { authenticated: false })
  await page.goto('/login')
  await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
  await assertLayout(page)
  await page.getByLabel('Email', { exact: true }).focus()
  await expect(page.getByLabel('Email', { exact: true })).toBeFocused()
  expect(
    await page
      .getByLabel('Email', { exact: true })
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe('none')
  await page.getByLabel('Email', { exact: true }).fill('reviewer@example.test')
  await page.getByLabel('Mot de passe', { exact: true }).fill('synthetic-test-only')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page).toHaveURL(/dashboard/)
  await expect(page.getByText('Ada Test', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Déconnexion' }).click()
  await expect(page).toHaveURL(/\/login$/)
  expect(external).toEqual([])
  expect(await page.evaluate(() => document.fonts.check('16px Inter'))).toBe(true)
  expect(await page.evaluate(() => document.fonts.check('16px Manrope'))).toBe(true)
})

test('dashboard search, filters and sorting still send server query parameters', async ({
  page,
}) => {
  const requests = await mockApi(page)
  await page.goto('/dashboard')
  await expect(page.getByText('Ada Test', { exact: true })).toBeVisible()
  await assertLayout(page)
  await page.getByLabel('Rechercher un patient', { exact: true }).fill('Ada')
  await expect(page).toHaveURL(/search=Ada/)
  await page.getByLabel('Sexe', { exact: true }).click()
  await page.getByRole('option', { name: 'Femme' }).click()
  await expect(page).toHaveURL(/gender=F/)
  await page.getByRole('button', { name: 'Naissance' }).click()
  await expect(page).toHaveURL(/sort_by=birth/)
  await page.getByLabel('Afficher', { exact: true }).click()
  await page.getByRole('option', { name: '50 par page' }).click()
  await expect(page).toHaveURL(/page_size=50/)
  expect(requests.some((r) => r.path === '/patients')).toBe(true)
  await page.getByText('Illustrations du suivi', { exact: false }).click()
  await assertLayout(page)
})

test('recipient detail preserves server outputs, timeline and clear missing metadata', async ({
  page,
}) => {
  await mockApi(page)
  await page.goto(`/fiche/${patientId}`)
  await expect(page.getByRole('heading', { name: 'Ada Test' })).toBeVisible()
  await assertLayout(page)
  await expect(page.locator('#recipient-timeline')).toContainText(patient.history[0].detail)
  await expect(page.locator('#serum-history')).toContainText('Négatif')
  await expect(page.locator('#serum-history')).toContainText('Positif')
  await expect(page.locator('#serum-history')).toContainText('fluctuant')
  await expect(page.locator('#review-limits')).toContainText('Version des règles')
  await expect(page.locator('#review-limits')).toContainText('Non transmise pour ce dossier')
  await page.getByText('Parcours et suivi illustratifs', { exact: false }).click()
  await assertLayout(page)
})

test('empty serum and missing history remain explicit, never negative', async ({ page }) => {
  await mockApi(page, { incomplete: true })
  await page.goto(`/fiche/${patientId}`)
  await expect(page.getByText('Historique non renseigné', { exact: true })).toBeVisible()
  await expect(page.getByText('Aucun prélèvement sérique transmis', { exact: true })).toBeVisible()
  await expect(page.getByText('Profil non renseigné', { exact: true })).toBeVisible()
  await assertLayout(page)
})

test('malformed serum payload shows an error instead of invented interpretation', async ({
  page,
}) => {
  await mockApi(page, { invalid: true })
  await page.goto(`/fiche/${patientId}`)
  await expect(page.getByRole('alert').filter({ hasText: 'La réponse du serveur est invalide' })).toBeVisible({
    timeout: 15000,
  })
  await expect(page.getByRole('heading', { name: 'Évolution des antigènes' })).toHaveCount(0)
})

test('signature details, explicit user action, unchanged write payload and empty state', async ({
  page,
}) => {
  const requests = await mockApi(page)
  await page.goto('/a-signer')
  await expect(page.getByText('Ada Test', { exact: true })).toBeVisible()
  await assertLayout(page)
  expect(requests.filter((r) => r.method === 'POST')).toEqual([])
  await page.getByRole('button', { name: 'Voir les tests' }).click()
  await expect(page.getByRole('button', { name: 'Masquer les tests' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await assertLayout(page)
  await page.getByRole('button', { name: 'Signer', exact: true }).click()
  await expect(page.getByText('Aucun cas à signer.', { exact: true })).toBeVisible()
  expect(requests.filter((r) => r.path === '/signatures')).toEqual([
    { path: '/signatures', method: 'POST', body: { patient_id: patientId } },
  ])
})

for (const route of ['/dashboard', `/fiche/${patientId}`, '/a-signer']) {
  test(`loading then server error: ${route}`, async ({ page }) => {
    await mockApi(page, { error: true, delay: 400 })
    await page.goto(route)
    await expect(page.getByRole('status')).toContainText('Chargement')
    await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)').first()).toBeVisible({ timeout: 15000 })
    await assertLayout(page)
  })
}

test('empty patient list and empty signature queue', async ({ page }) => {
  await mockApi(page, { empty: true })
  await page.goto('/dashboard')
  await expect(page.getByText('Aucun patient ne correspond à cette recherche.')).toBeVisible()
  await assertLayout(page)
  await page.getByRole('link', { name: 'À signer' }).click()
  await expect(page.getByText('Aucun cas à signer.', { exact: true })).toBeVisible()
})

test('reduced motion disables transitions and skip link reaches main content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await mockApi(page)
  await page.goto('/dashboard')
  await expect(page.getByText('Ada Test', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Aller au contenu' }).focus()
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
  expect(
    await page
      .getByRole('button', { name: 'Déconnexion' })
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe('0s')
})

test('serum labels use server flags and absent cells stay distinct', async ({ page }) => {
  await mockApi(page)
  await page.route(`**/api/v1/patients/${patientId}`, (route) =>
    route.fulfill({
      json: {
        ...patient,
        serum_evolution: {
          ...patient.serum_evolution,
          years: [
            {
              year: 2017,
              test_date: '2017-12-09',
              antigens: [{ code: 'b12', label: 'B12', value: 1870, output: 0 }],
            },
            {
              year: 2019,
              test_date: '2019-01-01',
              antigens: [{ code: 'dq10', label: 'DQ10', value: 40, output: 1 }],
            },
          ],
        },
      },
    }),
  )
  await page.goto(`/fiche/${patientId}`)
  const grid = page.getByRole('region', { name: 'Résultats sériques par année' })
  await expect(grid.getByRole('columnheader', { name: 'DQ10' })).toBeVisible()
  await expect(grid.getByRole('cell').filter({ hasText: '1\u202f870' })).toContainText('Négatif')
  await expect(grid.getByRole('cell').filter({ hasText: '40' })).toContainText('Positif')
  await expect(grid.getByText('— Non transmis', { exact: true })).toHaveCount(2)
})

test('failed signature stays visible and is never presented as success', async ({ page }) => {
  await mockApi(page)
  await page.route('**/api/v1/signatures', (route) =>
    route.fulfill({ status: 503, json: { detail: 'UNAVAILABLE' } }),
  )
  await page.goto('/a-signer')
  await page.getByRole('button', { name: 'Signer', exact: true }).click()
  await expect(page.getByRole('alert').filter({ hasText: /signature|indisponible|réessayer/i })).toBeVisible()
  await expect(page.getByText('Ada Test', { exact: true })).toBeVisible()
  await expect(page.getByText('Aucun cas à signer.', { exact: true })).toHaveCount(0)
  await assertLayout(page)
})
