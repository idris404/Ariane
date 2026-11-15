import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { CONSULT_PAGE_SIZE, TO_CONSULT_ERRORS } from '../src/constants/to-consult'
import { ROUTES } from '../src/constants/routes'
import { consultCaseCount, mockApi, patientId } from './fixtures'

test.beforeEach(async ({ page }) => {
  // Aucune dépendance à Internet pendant les tests de l'interface locale.
  await page.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(host) ? route.fallback() : route.abort()
  })
})

const navigation = (page: Page) => page.getByRole('navigation', { name: 'Navigation principale' })

async function openConsultPage(page: Page) {
  await page.goto(ROUTES.toConsult)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Des suivis fluctuants, à lire de près.',
  )
}

test('the sidebar has an "À consulter" tab with a red count that opens the page', async ({
  page,
}) => {
  await mockApi(page)
  await page.goto(ROUTES.dashboard)

  const tab = navigation(page).getByRole('link', { name: /À consulter/ })
  const count = tab.getByText(String(consultCaseCount), { exact: true })
  await expect(count).toBeVisible()
  await expect(count).toHaveClass(/destructive-ink/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)

  await tab.click()
  await expect(page).toHaveURL(new RegExp(`${ROUTES.toConsult}$`))
  await expect(tab).toHaveAttribute('aria-current', 'page')
})

test('the page lists fluctuating cases with a red profile pill and a "Voir la fiche" button', async ({
  page,
}) => {
  await mockApi(page)
  await openConsultPage(page)

  await expect(page.getByText(`${consultCaseCount} à consulter`, { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Cas à consulter' })).toBeVisible()
  const table = page.getByRole('table', { name: 'Cas au suivi sérique fluctuant à consulter' })
  await expect(table.getByRole('columnheader')).toHaveText([
    'Patient',
    'Profil sérique',
    'Événements',
    'Actions',
  ])
  const rows = page.getByRole('row').filter({ hasText: 'Fluctuant' })
  await expect(rows).toHaveCount(CONSULT_PAGE_SIZE)

  const first = rows.first()
  await expect(first.getByText('Profil C · fluctuant')).toHaveClass(/destructive-ink/)
  await expect(first.getByRole('link', { name: /Voir la fiche/ })).toHaveAttribute(
    'href',
    `/fiche/${patientId}`,
  )
  // Cette liste se consulte, elle ne se signe pas.
  await expect(page.getByRole('button', { name: 'Signer' })).toHaveCount(0)

  const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(accessibility.violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('"Voir les tests" shows the serum tests and "Voir la fiche" opens the patient file', async ({
  page,
}) => {
  await mockApi(page)
  await openConsultPage(page)
  const first = page.getByRole('row').filter({ hasText: 'Fluctuant' }).first()

  await first.getByRole('button', { name: 'Voir les tests' }).click()
  await expect(first.getByRole('button', { name: 'Masquer les tests' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await expect(page.getByRole('region', { name: 'Résultats sériques par année' })).toBeVisible()
  await first.getByRole('link', { name: /Voir la fiche/ }).click()
  await expect(page).toHaveURL(new RegExp(`/fiche/${patientId}$`))
})

test('the list is paginated: next and previous pages keep the total', async ({ page }) => {
  await mockApi(page)
  await openConsultPage(page)
  const rows = page.getByRole('row').filter({ hasText: 'Fluctuant' })
  const previous = page.getByRole('button', { name: 'Précédent' })
  const next = page.getByRole('button', { name: 'Suivant' })

  await expect(page.getByText(`1–${CONSULT_PAGE_SIZE} sur ${consultCaseCount}`)).toBeVisible()
  await expect(previous).toBeDisabled()

  await next.click()
  await expect(page).toHaveURL(/[?&]page=2\b/)
  await expect(
    page.getByText(`${CONSULT_PAGE_SIZE + 1}–${consultCaseCount} sur ${consultCaseCount}`),
  ).toBeVisible()
  await expect(rows).toHaveCount(consultCaseCount - CONSULT_PAGE_SIZE)
  await expect(next).toBeDisabled()

  await previous.click()
  await expect(rows).toHaveCount(CONSULT_PAGE_SIZE)
})

test('an empty list is explicit', async ({ page }) => {
  await mockApi(page, { empty: true })
  await openConsultPage(page)
  await expect(page.getByText('Aucun cas à consulter.')).toBeVisible()
  await expect(page.getByText('0 à consulter', { exact: true })).toBeVisible()
})

test('a server error is shown instead of an empty list', async ({ page }) => {
  await mockApi(page, { error: true })
  await openConsultPage(page)
  await expect(page.getByRole('alert').filter({ hasText: TO_CONSULT_ERRORS.queue })).toBeVisible()
  await expect(page.getByText('Aucun cas à consulter.')).toHaveCount(0)
})

test('the events pill opens a dialog listing the essentials of each event', async ({ page }) => {
  await mockApi(page)
  await openConsultPage(page)

  const trigger = page.getByRole('button', { name: '2 événements de Cas Fluctuant 2' })
  await expect(trigger).toBeVisible()
  await trigger.click()

  const dialog = page.getByRole('dialog', { name: 'Événements de Cas Fluctuant 2' })
  await expect(dialog).toBeVisible()
  const events = dialog.getByRole('list', { name: 'Événements' }).getByRole('listitem')
  await expect(events).toHaveCount(2)
  await expect(events.first()).toContainText('18 août 2015')
  await expect(events.first()).toContainText('Greffe rénale')
  await expect(events.first()).toContainText('Donneur décédé · ABO compatible · exemple fictif')
  await expect(events.last()).toContainText('25 août 2015')
  await expect(events.last()).toContainText('Suivi postopératoire')
  const accessibility = await new AxeBuilder({ page }).include('[role="dialog"]').analyze()
  expect(accessibility.violations).toEqual([])

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('a single event is singular and a case without event has no button', async ({ page }) => {
  await mockApi(page)
  await openConsultPage(page)

  await expect(
    page.getByRole('button', { name: '1 événement de Cas Fluctuant 1', exact: true }),
  ).toBeVisible()
  const withoutEvent = page.getByRole('row').filter({ hasText: /Cas Fluctuant 3(?!\d)/ })
  await expect(withoutEvent.getByText('Aucun événement')).toBeVisible()
  await expect(withoutEvent.getByRole('button', { name: /événement/ })).toHaveCount(0)
})

test('the page lives in the URL: it is reopened and restored after visiting a file', async ({
  page,
}) => {
  await mockApi(page)
  await page.goto(`${ROUTES.toConsult}?page=2`)
  await expect(
    page.getByText(`${CONSULT_PAGE_SIZE + 1}–${consultCaseCount} sur ${consultCaseCount}`),
  ).toBeVisible()

  await page.getByRole('link', { name: /Voir la fiche/ }).first().click()
  await expect(page).toHaveURL(/\/fiche\//)
  await page.goBack()
  await expect(
    page.getByText(`${CONSULT_PAGE_SIZE + 1}–${consultCaseCount} sur ${consultCaseCount}`),
  ).toBeVisible()
})

test('a page beyond the last one falls back to the last page', async ({ page }) => {
  await mockApi(page)
  await page.goto(`${ROUTES.toConsult}?page=99`)
  await expect(
    page.getByText(`${CONSULT_PAGE_SIZE + 1}–${consultCaseCount} sur ${consultCaseCount}`),
  ).toBeVisible()
  await expect(page.getByText('Aucun cas à consulter.')).toHaveCount(0)
})

// Grand écran (≥ lg) : la page occupe exactement la hauteur de la fenêtre.
const FIT_WIDTH = 1440

async function pageScrolls(page: Page) {
  return page.evaluate(() => document.documentElement.scrollHeight > innerHeight)
}

test.describe('on a tall window', () => {
  test.use({ viewport: { width: FIT_WIDTH, height: 1000 } })

  test('the five cases and the pagination fit without any scrolling', async ({ page }) => {
    await mockApi(page)
    await openConsultPage(page)
    const region = page.getByRole('region', { name: 'Liste des cas à consulter' })

    await expect(page.getByRole('row').filter({ hasText: 'Fluctuant' })).toHaveCount(
      CONSULT_PAGE_SIZE,
    )
    expect(CONSULT_PAGE_SIZE).toBe(5)
    expect(await pageScrolls(page)).toBe(false)
    expect(await region.evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(true)
    await expect(page.getByRole('button', { name: 'Suivant' })).toBeInViewport()
  })
})

test.describe('on a short window', () => {
  test.use({ viewport: { width: FIT_WIDTH, height: 800 } })

  test('the page does not scroll: the table does, and the pagination stays in view', async ({
    page,
  }) => {
    await mockApi(page)
    await openConsultPage(page)
    const region = page.getByRole('region', { name: 'Liste des cas à consulter' })
    const next = page.getByRole('button', { name: 'Suivant' })

    expect(await pageScrolls(page)).toBe(false)
    await expect(next).toBeInViewport()

    // Une ligne dépliée allonge le tableau, pas la page.
    await page.getByRole('button', { name: 'Voir les tests' }).first().click()
    await expect(page.getByRole('region', { name: 'Résultats sériques par année' })).toBeAttached()
    expect(await pageScrolls(page)).toBe(false)
    expect(await region.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true)
    await expect(next).toBeInViewport()
  })
})
