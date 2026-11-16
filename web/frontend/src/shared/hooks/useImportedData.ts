import { useSyncExternalStore } from 'react'

import { importedData } from '../utils/importedData'

// `true` une fois l'import terminé ; avant, les écrans de données restent vides et ne font aucun appel.
export function useImportedData(): boolean {
  return useSyncExternalStore(importedData.subscribe, importedData.isImported)
}
