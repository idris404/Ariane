import { expect, type Page } from '@playwright/test'

export type DroppedFile = { name: string; type: string; content: string }

// Simule un glisser-déposer de documents fictifs, créés en mémoire, sur la zone de dépôt de l'import.
export async function dropFiles(page: Page, files: DroppedFile[]) {
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
