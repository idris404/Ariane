import { cn } from 'cn'

import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  IMPORT_ACCEPT_ATTRIBUTE,
  IMPORT_FORMATS_LABEL,
  IMPORT_MESSAGES,
} from '../../../constants/import'
import { useImportFiles } from '../hooks/useImportFiles'
import { preventBrowserDrop } from '../utils'

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-8 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </svg>
  )
}

// Rendu à l'intérieur de `DialogContent`, que Radix démonte à la fermeture : le hook, donc la
// sélection de fichiers, repart de zéro à chaque ouverture.
function ImportDialogBody() {
  const { inputRef, ...files } = useImportFiles()

  return (
    <>
      <DialogHeader>
        <DialogTitle>Importer des documents</DialogTitle>
        <DialogDescription>
          {IMPORT_MESSAGES.acceptedFormats} {IMPORT_FORMATS_LABEL}.
        </DialogDescription>
      </DialogHeader>

      <div
        role="group"
        aria-label="Zone de dépôt de fichiers"
        data-dragging={files.isDragging}
        {...files.dropzoneHandlers}
        className={cn(
          'flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
          files.isDragging ? 'border-primary bg-brand-soft' : 'border-input bg-background',
        )}
      >
        <UploadIcon />
        <p className="font-medium">Glissez-déposez vos fichiers ici</p>
        <p className="text-sm text-muted-foreground">ou</p>
        <Button type="button" variant="outline" onClick={files.openPicker}>
          Parcourir mes fichiers
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={IMPORT_ACCEPT_ATTRIBUTE}
          onChange={files.onInputChange}
        />
      </div>

      {files.rejectedMessage !== null && (
        <Alert variant="destructive">{files.rejectedMessage}</Alert>
      )}

      {files.rows.length > 0 && (
        <ul aria-label="Fichiers sélectionnés" className="flex flex-col gap-2">
          {files.rows.map((row) => (
            <li
              key={row.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {row.extensionLabel}
                </span>
                <span className="truncate text-sm font-medium">{row.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{row.sizeLabel}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Retirer ${row.name}`}
                onClick={() => files.removeFile(row.key)}
              >
                Retirer
              </Button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">{IMPORT_MESSAGES.localOnly}</p>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Fermer
          </Button>
        </DialogClose>
        <Button type="button" disabled title={IMPORT_MESSAGES.processingUnavailable}>
          Lancer l’import
        </Button>
      </DialogFooter>
    </>
  )
}

export function ImportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Importer
        </Button>
      </DialogTrigger>
      <DialogContent onDragOver={preventBrowserDrop} onDrop={preventBrowserDrop}>
        <ImportDialogBody />
      </DialogContent>
    </Dialog>
  )
}
