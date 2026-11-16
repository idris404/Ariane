import { Button } from '@/components/ui/button'
import { IMPORT_MESSAGES } from '../../../constants/import'
import type { ImportRow } from '../utils'
import { ImportFileList } from './ImportFileList'

type ImportDetectionProps = {
  detectedLabel: string
  rows: readonly ImportRow[]
  onRestart: () => void
}

export function ImportDetection({ detectedLabel, rows, onRestart }: ImportDetectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        role="status"
        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background px-6 py-6 text-center"
      >
        <p className="text-3xl font-semibold">{detectedLabel}</p>
        <span className="rounded-full bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning-foreground">
          {IMPORT_MESSAGES.simulatedBadge}
        </span>
        <p className="text-sm text-muted-foreground">{IMPORT_MESSAGES.simulatedNotice}</p>
      </div>
      <ImportFileList rows={rows} />
      <Button type="button" variant="outline" className="self-start" onClick={onRestart}>
        Changer de fichier
      </Button>
    </div>
  )
}
