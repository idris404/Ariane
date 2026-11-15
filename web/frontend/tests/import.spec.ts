import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mockApi } from './fixtures'

// Documents fictifs, créés en mémoire : aucun fichier réel ni donnée de santé.
const csvFile = { name: 'patients.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2') }
const pdfFile = { name: 'rapport.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') }
const textFile = { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('notes') }

test.beforeEach(async ({ page }) => {
  // Aucune dépendance à Internet pendant les tests de l'interface locale.
  await page.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(host) ? route.fallback() : route.abort()
  })
  await mockApi(page)
})

async function openImportDialog(page: Page) {
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Importer', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Importer des documents' })
  await expect(dialog).toBeVisible()
  return dialog
}

async function dropFiles(page: Page, files: { name: string; type: string; content: string }[]) {
  const dataTransfer = await page.evaluateHandle((items) => {
    const transfer = new DataTransfer()
    for (const item of items) {
      transfer.items.add(new File([item.content], item.name, { type: item.type }))
    }
    return transfer
  }, files)
  const dropzone = page.getByRole('group', { name: 'Zone de dépôt de fichiers' })
  await dropzone.dispatchEvent('dragenter', { dataTransfer })
  await expect(dropzone).toHaveAttribute('data-dragging', 'true')
  await dropzone.dispatchEvent('dragover', { dataTransfer })
  await dropzone.dispatchEvent('drop', { dataTransfer })
  await expect(dropzone).toHaveAttribute('data-dragging', 'false')
}

test('the import button opens a dialog listing the accepted formats, and Escape closes it', async ({
  page,
}) => {
  const dialog = await openImportDialog(page)
  await expect(dialog.getByText('Formats acceptés : CSV, PDF, JSON, DOCX, XLSX.')).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Lancer l’import' })).toBeDisabled()
  expect(await new AxeBuilder({ page }).include('[role="dialog"]').analyze().then((r) => r.violations)).toEqual([])
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('button', { name: 'Importer', exact: true })).toBeFocused()
})

test('the file picker adds accepted documents and reports the unsupported ones', async ({
  page,
}) => {
  const dialog = await openImportDialog(page)
  const chooser = page.waitForEvent('filechooser')
  await dialog.getByRole('button', { name: 'Parcourir mes fichiers' }).click()
  await (await chooser).setFiles([csvFile, pdfFile, textFile])

  const list = dialog.getByRole('list', { name: 'Fichiers sélectionnés' })
  await expect(list.getByRole('listitem')).toHaveCount(2)
  await expect(list.getByText('patients.csv')).toBeVisible()
  await expect(list.getByText('rapport.pdf')).toBeVisible()
  await expect(dialog.getByRole('alert')).toHaveText('Format non pris en charge : notes.txt')
})

test('drag and drop adds documents, ignores duplicates and lets the user remove one', async ({
  page,
}) => {
  const dialog = await openImportDialog(page)
  const json = { name: 'donnees.json', type: 'application/json', content: '{}' }
  await dropFiles(page, [json, { name: 'Tableau.XLSX', type: '', content: 'x' }])

  const rows = dialog.getByRole('list', { name: 'Fichiers sélectionnés' }).getByRole('listitem')
  await expect(rows).toHaveCount(2)
  await expect(dialog.getByRole('alert')).toHaveCount(0)

  await dropFiles(page, [{ name: 'diagramme.png', type: 'image/png', content: 'x' }])
  await expect(rows).toHaveCount(2)
  await expect(dialog.getByRole('alert')).toHaveText('Format non pris en charge : diagramme.png')

  await dialog.getByRole('button', { name: 'Retirer donnees.json' }).click()
  await expect(rows).toHaveCount(1)
  await expect(dialog.getByText('donnees.json')).toHaveCount(0)
})

test('closing the dialog clears the selection', async ({ page }) => {
  const dialog = await openImportDialog(page)
  await dropFiles(page, [{ name: 'donnees.json', type: 'application/json', content: '{}' }])
  await expect(dialog.getByText('donnees.json')).toBeVisible()
  await dialog.getByRole('button', { name: 'Fermer' }).click()
  await expect(dialog).toBeHidden()

  await page.getByRole('button', { name: 'Importer', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Importer des documents' })).toBeVisible()
  await expect(page.getByText('donnees.json')).toHaveCount(0)
})
