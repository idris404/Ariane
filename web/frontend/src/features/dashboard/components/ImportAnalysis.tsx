import { IMPORT_MESSAGES } from '../../../constants/import'
import { useImportAnalysis } from '../hooks/useImportAnalysis'
import { formatAnalysisCount, type ImportRow } from '../utils'
import { ImportFileList } from './ImportFileList'

export function ImportAnalysis({ rows }: { rows: readonly ImportRow[] }) {
  const analysis = useImportAnalysis()
  const count = formatAnalysisCount(analysis.processed, analysis.total)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-background px-6 py-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-medium">{IMPORT_MESSAGES.analysisRunning}</p>
          <p className="text-sm font-medium tabular-nums">{analysis.percent} %</p>
        </div>
        <div
          role="progressbar"
          aria-label={IMPORT_MESSAGES.analysisProgressLabel}
          aria-valuemin={0}
          aria-valuemax={analysis.total}
          aria-valuenow={analysis.processed}
          aria-valuetext={count}
          className="h-3 w-full overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${analysis.percent}%` }} />
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">{count}</p>
        <p className="text-xs text-muted-foreground">{IMPORT_MESSAGES.analysisSimulatedNotice}</p>
      </div>
      <ImportFileList rows={rows} />
    </div>
  )
}
