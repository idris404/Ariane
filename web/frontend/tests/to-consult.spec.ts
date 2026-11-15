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
  const rows = page.getByRole('listitem').filter({ hasText: 'Fluctuant' })
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
  const first = page.getByRole('listitem').filter({ hasText: 'Fluctuant' }).first()

  await first.getByRole('button', { name: 'Voir les tests' }).click()
  await expect(first.getByRole('button', { name: 'Masquer les tests' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await first.getByRole('link', { name: /Voir la fiche/ }).click()
  await expect(page).toHaveURL(new RegExp(`/fiche/${patientId}$`))
})

test('the list is paginated: next and previous pages keep the total', async ({ page }) => {
  await mockApi(page)
  await openConsultPage(page)
  const rows = page.getByRole('listitem').filter({ hasText: 'Fluctuant' })
  const previous = page.getByRole('button', { name: 'Précédent' })
  const next = page.getByRole('button', { name: 'Suivant' })

  await expect(page.getByText(`1–${CONSULT_PAGE_SIZE} sur ${consultCaseCount}`)).toBeVisible()
  await expect(previous).toBeDisabled()

  await next.click()
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
