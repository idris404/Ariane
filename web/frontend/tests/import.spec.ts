import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { IMPORT_MESSAGES, MOCK_IMPORT } from '../src/constants/import'
import { ROUTES } from '../src/constants/routes'
import { mockApi } from './fixtures'

// Documents fictifs, créés en mémoire : aucun fichier réel ni donnée de santé.
const csvFile = { name: 'patients.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2') }
const pdfFile = { name: 'rapport.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') }
const textFile = { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('notes') }
const jsonDrop = { name: 'donnees.json', type: 'application/json', content: '{}' }

type DroppedFile = { name: string; type: string; content: string }

test.beforeEach(async ({ page }) => {
  // Aucune dépendance à Internet pendant les tests de l'interface locale.
  await page.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(host) ? route.fallback() : route.abort()
  })
  await mockApi(page)
  // Le chargement simulé dure `MOCK_IMPORT.loadingMs` : on avance l'horloge au lieu d'attendre.
  await page.clock.install()
})

async function openImportDialog(page: Page) {
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Importer', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Importer des documents' })
  await expect(dialog).toBeVisible()
  return dialog
}

async function dropFiles(page: Page, files: DroppedFile[]) {
  const dataTransfer = await page.evaluateHandle((items) => {
    const transfer = new DataTransfer()
    for (const item of items) {
      // `lastModified` fixe : deux fichiers identiques doivent avoir la même identité.
      transfer.items.add(
        new File([item.content], item.name, { type: item.type, lastModified: 1 }),
      )
    }
    return transfer
  }, files)
  const dropzone = page.getByRole('group', { name: 'Zone de dépôt de fichiers' })
  await dropzone.dispatchEvent('dragenter', { dataTransfer })
  await expect(dropzone).toHaveAttribute('data-dragging', 'true')
  await dropzone.dispatchEvent('dragover', { dataTransfer })
  await dropzone.dispatchEvent('drop', { dataTransfer })
}

test('the import button opens a dialog listing the accepted formats, and Escape closes it', async ({
  page,
}) => {
  const dialog = await openImportDialog(page)
  await expect(dialog.getByText('Formats acceptés : CSV, PDF, JSON, DOCX, XLSX.')).toBeVisible()
  const analyse = dialog.getByRole('button', { name: 'Lancer l’analyse' })
  await expect(analyse).toBeDisabled()
  await expect(analyse).toHaveAttribute('title', IMPORT_MESSAGES.analysisNeedsFile)
  const accessibility = await new AxeBuilder({ page }).include('[role="dialog"]').analyze()
  expect(accessibility.violations).toEqual([])
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('button', { name: 'Importer', exact: true })).toBeFocused()
})

test('a valid file from the picker shows the loading view, then the simulated detection', async ({
  page,
}) => {
  const dialog = await openImportDialog(page)
  const chooser = page.waitForEvent('filechooser')
  await dialog.getByRole('button', { name: 'Parcourir mes fichiers' }).click()
  await (await chooser).setFiles([csvFile, pdfFile, textFile])

  // Vue chargement : la zone de dépôt laisse la place, les fichiers valides sont listés.
  await expect(dialog.getByRole('status')).toContainText('Chargement des données')
  await expect(dialog.getByRole('group', { name: 'Zone de dépôt de fichiers' })).toHaveCount(0)
  const rows = dialog.getByRole('list', { name: 'Fichiers sélectionnés' }).getByRole('listitem')
  await expect(rows).toHaveCount(2)
  await expect(dialog.getByRole('alert')).toHaveText('Format non pris en charge : notes.txt')

  // Vue détection : le nombre de patients vient de la constante, et il est signalé comme simulé.
  await page.clock.fastForward(MOCK_IMPORT.loadingMs)
  const patients = new Intl.NumberFormat('fr-FR').format(MOCK_IMPORT.detectedPatients)
  await expect(dialog.getByRole('status')).toContainText(`${patients} patients détectés`)
  await expect(dialog.getByText('Valeur simulée')).toBeVisible()
  await expect(dialog.getByText('Chargement des données')).toHaveCount(0)
  await expect(rows).toHaveCount(2)
  const accessibility = await new AxeBuilder({ page }).include('[role="dialog"]').analyze()
  expect(accessibility.violations).toEqual([])
})

test('dropping an unsupported file only reports it, a valid drop starts the loading', async ({
  page,
}) => {
  const dialog = await openImportDialog(page)
  const dropzone = dialog.getByRole('group', { name: 'Zone de dépôt de fichiers' })

  await dropFiles(page, [{ name: 'diagramme.png', type: 'image/png', content: 'x' }])
  await expect(dropzone).toHaveAttribute('data-dragging', 'false')
  await expect(dialog.getByRole('alert')).toHaveText('Format non pris en charge : diagramme.png')
  await expect(dialog.getByRole('status')).toHaveCount(0)

  // Même fichier déposé deux fois, extension en majuscules : une seule ligne, l'alerte disparaît.
  await dropFiles(page, [jsonDrop, jsonDrop, { name: 'Tableau.XLSX', type: '', content: 'x' }])
  await expect(dialog.getByRole('status')).toContainText('Chargement des données')
  await expect(dialog.getByRole('alert')).toHaveCount(0)
  await expect(
    dialog.getByRole('list', { name: 'Fichiers sélectionnés' }).getByRole('listitem'),
  ).toHaveCount(2)
})

test('"Changer de fichier" and closing the dialog both start again from the dropzone', async ({
  page,
}) => {
  const dialog = await openImportDialog(page)
  await dropFiles(page, [jsonDrop])
  await page.clock.fastForward(MOCK_IMPORT.loadingMs)
  await expect(dialog.getByText('Valeur simulée')).toBeVisible()

  await dialog.getByRole('button', { name: 'Changer de fichier' }).click()
  await expect(dialog.getByRole('group', { name: 'Zone de dépôt de fichiers' })).toBeVisible()
  await expect(dialog.getByText('donnees.json')).toHaveCount(0)

  // Fermer pendant le chargement : la sélection et le chargement sont abandonnés.
  await dropFiles(page, [jsonDrop])
  await expect(dialog.getByRole('status')).toContainText('Chargement des données')
  await dialog.getByRole('button', { name: 'Fermer' }).click()
  await expect(dialog).toBeHidden()
  await page.clock.fastForward(MOCK_IMPORT.loadingMs)

  await page.getByRole('button', { name: 'Importer', exact: true }).click()
  const reopened = page.getByRole('dialog', { name: 'Importer des documents' })
  await expect(reopened.getByRole('group', { name: 'Zone de dépôt de fichiers' })).toBeVisible()
  await expect(reopened.getByText('donnees.json')).toHaveCount(0)
  await expect(reopened.getByRole('status')).toHaveCount(0)
})

async function reachDetection(page: Page) {
  const dialog = await openImportDialog(page)
  await dropFiles(page, [jsonDrop])
  await expect(dialog.getByRole('button', { name: 'Lancer l’analyse' })).toBeDisabled()
  await page.clock.fastForward(MOCK_IMPORT.loadingMs)
  await expect(dialog.getByText('Valeur simulée')).toBeVisible()
  return dialog
}

async function readProgress(dialog: ReturnType<Page['getByRole']>) {
  const bar = dialog.getByRole('progressbar', { name: IMPORT_MESSAGES.analysisProgressLabel })
  return Number(await bar.getAttribute('aria-valuenow'))
}

test('the analysis starts slowly, speeds up, then redirects to the page to sign', async ({
  page,
}) => {
  const dialog = await reachDetection(page)
  const analyse = dialog.getByRole('button', { name: 'Lancer l’analyse' })
  await expect(analyse).toBeEnabled()
  await analyse.click()

  const bar = dialog.getByRole('progressbar', { name: IMPORT_MESSAGES.analysisProgressLabel })
  await expect(bar).toHaveAttribute('aria-valuemax', String(MOCK_IMPORT.detectedPatients))
  await expect(dialog.getByText('Analyse en cours…')).toBeVisible()
  await expect(analyse).toBeDisabled()

  // À la moitié du temps, une progression linéaire serait à 50 % : la courbe lente reste en dessous.
  await page.clock.runFor(MOCK_IMPORT.analysis.durationMs / 2)
  const halfway = await readProgress(dialog)
  expect(halfway).toBeGreaterThan(0)
  expect(halfway).toBeLessThan(MOCK_IMPORT.detectedPatients * MOCK_IMPORT.analysis.slowUntilProgress * 0.9)

  // Fin de l'analyse : redirection vers la page à signer.
  await page.clock.runFor(MOCK_IMPORT.analysis.durationMs)
  await expect(page).toHaveURL(new RegExp(`${ROUTES.toSign}$`))
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('closing the dialog during the analysis cancels it without redirecting', async ({ page }) => {
  const dialog = await reachDetection(page)
  await dialog.getByRole('button', { name: 'Lancer l’analyse' }).click()
  await expect(dialog.getByRole('progressbar')).toBeVisible()
  await dialog.getByRole('button', { name: 'Fermer' }).click()
  await expect(dialog).toBeHidden()

  await page.clock.runFor(MOCK_IMPORT.analysis.durationMs)
  await expect(page).toHaveURL(new RegExp(`${ROUTES.dashboard}$`))
})
