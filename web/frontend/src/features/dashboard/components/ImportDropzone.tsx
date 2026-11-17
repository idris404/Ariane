import { cn } from 'cn'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IMPORT_ACCEPT_ATTRIBUTE } from '../../../constants/import'
import { useFileDropzone } from '../hooks/useFileDropzone'

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

export function ImportDropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const { inputRef, ...dropzone } = useFileDropzone(onFiles)

  return (
    <div
      role="group"
      aria-label="Zone de dépôt de fichiers"
      data-dragging={dropzone.isDragging}
      {...dropzone.dropzoneHandlers}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
        dropzone.isDragging ? 'border-primary bg-brand-soft' : 'border-input bg-background',
      )}
    >
      <UploadIcon />
      <p className="font-medium">Glissez-déposez vos fichiers ici</p>
      <p className="text-sm text-muted-foreground">ou</p>
      <Button type="button" variant="outline" onClick={dropzone.openPicker}>
        Parcourir mes fichiers
      </Button>
      <Input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept={IMPORT_ACCEPT_ATTRIBUTE}
        onChange={dropzone.onInputChange}
      />
    </div>
  )
}
