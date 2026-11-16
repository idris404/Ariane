import { expect, test } from '@playwright/test'
import { IMPORT_EMPTY, MOCK_IMPORT } from '../src/constants/import'
import { ROUTES } from '../src/constants/routes'
import { mockApi } from './fixtures'
import { dropFiles } from './import-helpers'

// Les trois écrans de données : aucun de ces chemins ne doit être appelé avant l'import.
const DATA_PATHS = ['/patients', '/signatures/queue', '/consultations/queue']

test.beforeEach(async ({ page }) => {
  // Aucune dépendance à Internet pendant les tests de l'interface locale.
  await page.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(host) ? route.fallback() : route.abort()
  })
})

const navigation = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Navigation principale' })

test('on arrival no data is requested and each screen shows an empty component', async ({
  page,
}) => {
  const requests = await mockApi(page, { imported: false })

  await page.goto(ROUTES.dashboard)
  await expect(page).toHaveTitle('Ariane · Rendre du temps à l’expertise biologique')
  const logo = page.getByRole('link', { name: 'Ariane — accueil' }).getByRole('img', { name: 'Ariane' })
  await expect(logo).toBeVisible()
  expect(await logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  await expect(page.getByText(IMPORT_EMPTY.title)).toBeVisible()
  await expect(page.getByText(IMPORT_EMPTY.hint)).toBeVisible()
  // Pas de compteur dans la barre latérale : rien n'a été demandé.
  await expect(navigation(page).getByRole('link', { name: 'À signer', exact: true })).toBeVisible()
  await expect(
    navigation(page).getByRole('link', { name: 'À consulter', exact: true }),
  ).toBeVisible()

  await navigation(page).getByRole('link', { name: 'À signer', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Cas à signer' })).toBeVisible()
  await expect(page.getByText(IMPORT_EMPTY.title)).toBeVisible()

  await navigation(page).getByRole('link', { name: 'À consulter', exact: true }).click()
  const table = page.getByRole('table', { name: 'Cas au suivi sérique fluctuant à consulter' })
  await expect(table.getByRole('columnheader')).toHaveCount(4)
  await expect(table.getByText(IMPORT_EMPTY.title)).toBeVisible()

  expect(requests.map((request) => request.path).filter((path) => DATA_PATHS.includes(path))).toEqual(
    [],
  )
})

test('the import loads the data, a reload keeps it and logging out forgets it', async ({
  page,
}) => {
  const requests = await mockApi(page, { imported: false })
  await page.clock.install()
  await page.goto(ROUTES.dashboard)
  await expect(page.getByText(IMPORT_EMPTY.title)).toBeVisible()

  await page.getByRole('button', { name: 'Importer', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Importer des documents' })
  await dropFiles(page, [{ name: 'patients.csv', type: 'text/csv', content: 'a,b' }])
  await page.clock.fastForward(MOCK_IMPORT.loadingMs)
  await dialog.getByRole('button', { name: 'Lancer l’analyse' }).click()
  await page.clock.runFor(MOCK_IMPORT.analysis.durationMs)

  // Fin de l'analyse : la page à signer demande ses cas.
  await expect(page).toHaveURL(new RegExp(`${ROUTES.toSign}$`))
  await expect(page.getByText('Ada Test', { exact: true })).toBeVisible()
  expect(requests.some((request) => request.path === '/signatures/queue')).toBe(true)

  // Un rechargement de l'onglet garde les données.
  await page.reload()
  await expect(page.getByText('Ada Test', { exact: true })).toBeVisible()

  // Les dossiers se chargent aussi.
  await navigation(page).getByRole('link', { name: /Les dossiers/ }).click()
  await expect(page.getByText('Ada Test', { exact: true })).toBeVisible()
  expect(requests.some((request) => request.path === '/patients')).toBe(true)

  // Se déconnecter oublie l'import : la connexion suivante repart d'écrans vides.
  await page.getByRole('button', { name: 'Déconnexion' }).click()
  await page.getByLabel('Email', { exact: true }).fill('reviewer@example.test')
  await page.getByLabel('Mot de passe', { exact: true }).fill('synthetic-test-only')
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await expect(page).toHaveURL(new RegExp(`${ROUTES.dashboard}$`))
  await expect(page.getByText(IMPORT_EMPTY.title)).toBeVisible()
})
