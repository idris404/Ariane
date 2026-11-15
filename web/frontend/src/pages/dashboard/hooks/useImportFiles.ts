import { useEffect, useState } from 'react'

import { MOCK_IMPORT } from '../../../constants/import'
import {
  describeRejectedFiles,
  formatDetectedPatients,
  mergeImportEntries,
  splitImportFiles,
  toImportRow,
  type ImportEntry,
} from '../utils'

// idle : en attente de fichiers · loading : chargement simulé · detected : patients « détectés ».
export type ImportPhase = 'idle' | 'loading' | 'detected'

// Documents choisis ou déposés dans la fenêtre d'import. Rien n'est envoyé au serveur ni lu : la
// détection des patients est simulée (`MOCK_IMPORT`). L'état vit dans le composant et disparaît à
// la fermeture de la fenêtre.
export function useImportFiles() {
  const [entries, setEntries] = useState<ImportEntry[]>([])
  const [rejectedNames, setRejectedNames] = useState<string[]>([])
  const [phase, setPhase] = useState<ImportPhase>('idle')

  useEffect(() => {
    if (phase !== 'loading') {
      return
    }
    const timer = window.setTimeout(() => setPhase('detected'), MOCK_IMPORT.loadingMs)
    return () => window.clearTimeout(timer)
  }, [phase])

  function addFiles(incoming: readonly File[]) {
    const { accepted, rejected } = splitImportFiles(incoming)
    setRejectedNames(rejected.map((file) => file.name))
    if (accepted.length === 0) {
      return
    }
    setEntries((current) => mergeImportEntries(current, accepted))
    setPhase('loading')
  }

  function reset() {
    setEntries([])
    setRejectedNames([])
    setPhase('idle')
  }

  return {
    phase,
    rows: entries.map(toImportRow),
    rejectedMessage: describeRejectedFiles(rejectedNames),
    detectedLabel: formatDetectedPatients(MOCK_IMPORT.detectedPatients),
    addFiles,
    reset,
  }
}
