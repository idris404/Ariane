import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'

import {
  describeRejectedFiles,
  mergeImportEntries,
  splitImportFiles,
  toImportRow,
  type ImportEntry,
} from '../utils'

// Documents choisis ou déposés dans la fenêtre d'import. Rien n'est envoyé au serveur : l'état vit
// dans le composant et disparaît à la fermeture de la fenêtre.
export function useImportFiles() {
  const [entries, setEntries] = useState<ImportEntry[]>([])
  const [rejectedNames, setRejectedNames] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function addFiles(incoming: Iterable<File>) {
    const { accepted, rejected } = splitImportFiles(Array.from(incoming))
    setRejectedNames(rejected.map((file) => file.name))
    setEntries((current) => mergeImportEntries(current, accepted))
  }

  function removeFile(key: string) {
    setEntries((current) => current.filter((entry) => entry.key !== key))
  }

  function openPicker() {
    inputRef.current?.click()
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files ?? [])
    // Permet de choisir à nouveau le même fichier après l'avoir retiré.
    event.target.value = ''
  }

  const dropzoneHandlers = {
    onDragEnter(event: DragEvent<HTMLElement>) {
      event.preventDefault()
      setIsDragging(true)
    },
    onDragOver(event: DragEvent<HTMLElement>) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    onDragLeave(event: DragEvent<HTMLElement>) {
      // Passer sur un enfant de la zone déclenche un `dragleave` : on reste en survol.
      if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
        return
      }
      setIsDragging(false)
    },
    onDrop(event: DragEvent<HTMLElement>) {
      event.preventDefault()
      setIsDragging(false)
      addFiles(event.dataTransfer.files)
    },
  }

  return {
    rows: entries.map(toImportRow),
    rejectedMessage: describeRejectedFiles(rejectedNames),
    isDragging,
    inputRef,
    openPicker,
    onInputChange,
    removeFile,
    dropzoneHandlers,
  }
}
