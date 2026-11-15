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
import { IMPORT_FORMATS_LABEL, IMPORT_MESSAGES } from '../../../constants/import'
import { useImportFiles } from '../hooks/useImportFiles'
import { preventBrowserDrop } from '../utils'
import { ImportAnalysis } from './ImportAnalysis'
import { ImportDetection } from './ImportDetection'
import { ImportDropzone } from './ImportDropzone'
import { ImportLoading } from './ImportLoading'

// Rendu à l'intérieur de `DialogContent`, que Radix démonte à la fermeture : le hook, donc la
// sélection de fichiers et la phase, repartent de zéro à chaque ouverture.
function ImportDialogBody() {
  const importFiles = useImportFiles()
  const canStartAnalysis = importFiles.phase === 'detected'
  // Infobulle utile seulement tant qu'aucun fichier n'est prêt ; pendant l'analyse, le bouton est inactif.
  const waitingTitle =
    importFiles.phase === 'analyzing' ? undefined : IMPORT_MESSAGES.analysisNeedsFile

  return (
    <>
      <DialogHeader>
        <DialogTitle>Importer des documents</DialogTitle>
        <DialogDescription>
          {IMPORT_MESSAGES.acceptedFormats} {IMPORT_FORMATS_LABEL}.
        </DialogDescription>
      </DialogHeader>

      {importFiles.phase === 'idle' && <ImportDropzone onFiles={importFiles.addFiles} />}
      {importFiles.phase === 'loading' && <ImportLoading rows={importFiles.rows} />}
      {importFiles.phase === 'detected' && (
        <ImportDetection
          detectedLabel={importFiles.detectedLabel}
          rows={importFiles.rows}
          onRestart={importFiles.reset}
        />
      )}
      {importFiles.phase === 'analyzing' && <ImportAnalysis rows={importFiles.rows} />}

      {importFiles.rejectedMessage !== null && (
        <Alert variant="destructive">{importFiles.rejectedMessage}</Alert>
      )}

      <p className="text-xs text-muted-foreground">{IMPORT_MESSAGES.localOnly}</p>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Fermer
          </Button>
        </DialogClose>
        <Button
          type="button"
          disabled={!canStartAnalysis}
          title={canStartAnalysis ? undefined : waitingTitle}
          onClick={importFiles.startAnalysis}
        >
          Lancer l’analyse
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
