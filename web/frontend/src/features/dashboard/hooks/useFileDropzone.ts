import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'

// Interaction d'une zone de dépôt : survol d'un glisser-déposer et sélecteur de fichiers natif.
// Elle transmet les fichiers reçus à `onFiles` et ne les valide pas.
export function useFileDropzone(onFiles: (files: File[]) => void) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function openPicker() {
    inputRef.current?.click()
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    onFiles(Array.from(event.target.files ?? []))
    // Permet de choisir à nouveau le même fichier après un retour en arrière.
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
      onFiles(Array.from(event.dataTransfer.files))
    },
  }

  return { isDragging, inputRef, openPicker, onInputChange, dropzoneHandlers }
}
