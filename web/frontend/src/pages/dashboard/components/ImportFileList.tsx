import type { ImportRow } from '../utils'

export function ImportFileList({ rows }: { rows: readonly ImportRow[] }) {
  return (
    <ul aria-label="Fichiers sélectionnés" className="flex flex-col gap-2">
      {rows.map((row) => (
        <li
          key={row.key}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
        >
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {row.extensionLabel}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{row.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{row.sizeLabel}</span>
        </li>
      ))}
    </ul>
  )
}
