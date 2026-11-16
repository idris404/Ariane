import { IMPORT_STORAGE_KEY, IMPORT_STORAGE_VALUE } from '../../constants/import'

// Petit magasin : « l'import est-il terminé ? ». Tant qu'il ne l'est pas, aucune requête de données
// n'est lancée (patients, cas à signer, cas à consulter). Mémoire + sessionStorage ; si le stockage
// est indisponible (navigation privée, accès bloqué), la mémoire suffit.

function readStoredFlag(): boolean {
  try {
    return sessionStorage.getItem(IMPORT_STORAGE_KEY) === IMPORT_STORAGE_VALUE
  } catch {
    return false
  }
}

function writeStoredFlag(value: boolean): void {
  try {
    if (value) {
      sessionStorage.setItem(IMPORT_STORAGE_KEY, IMPORT_STORAGE_VALUE)
    } else {
      sessionStorage.removeItem(IMPORT_STORAGE_KEY)
    }
  } catch {
    // Stockage indisponible : l'état en mémoire est la seule source.
  }
}

let imported = readStoredFlag()
const listeners = new Set<() => void>()

function setImported(value: boolean): void {
  if (imported === value) return
  imported = value
  writeStoredFlag(value)
  for (const listener of listeners) listener()
}

export const importedData = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  isImported: (): boolean => imported,
  // Fin de l'analyse : les écrans peuvent demander leurs données.
  markImported: (): void => setImported(true),
  // Déconnexion : rien ne doit rester pour la prochaine session (données de santé).
  reset: (): void => setImported(false),
}
