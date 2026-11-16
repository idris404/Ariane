export function buildFichePath(id: string): string {
  return `/fiche/${encodeURIComponent(id)}`
}
