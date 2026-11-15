import { IMPORT_MESSAGES } from '../../../constants/import'
import type { ImportRow } from '../utils'
import { ImportFileList } from './ImportFileList'

export function ImportLoading({ rows }: { rows: readonly ImportRow[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        role="status"
        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background px-6 py-8 text-center"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-8 animate-spin text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
          <path d="M21 12a9 9 0 0 0-9-9" />
        </svg>
        <p className="font-medium">{IMPORT_MESSAGES.loading}</p>
        <p className="text-sm text-muted-foreground">{IMPORT_MESSAGES.loadingDetail}</p>
      </div>
      <ImportFileList rows={rows} />
    </div>
  )
}
