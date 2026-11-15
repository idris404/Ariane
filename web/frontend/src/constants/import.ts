// Formats de documents acceptés par la fenêtre d'import. Le contrôle porte sur l'extension :
// le type MIME n'est pas fiable (un .csv arrive en `application/vnd.ms-excel` sous Windows).
export const IMPORT_ACCEPTED_EXTENSIONS = ['csv', 'pdf', 'json', 'docx', 'xlsx'] as const

export type ImportExtension = (typeof IMPORT_ACCEPTED_EXTENSIONS)[number]

// Valeur de l'attribut `accept` de l'<input type="file"> : « .csv,.pdf,… ».
export const IMPORT_ACCEPT_ATTRIBUTE = IMPORT_ACCEPTED_EXTENSIONS.map(
  (extension) => `.${extension}`,
).join(',')

// Libellé lisible des formats : « CSV, PDF, JSON, DOCX, XLSX ».
export const IMPORT_FORMATS_LABEL = IMPORT_ACCEPTED_EXTENSIONS.map((extension) =>
  extension.toUpperCase(),
).join(', ')

// Tailles affichées en unités françaises (octet, Ko, Mo, Go), base 1024.
export const FILE_SIZE_UNITS = ['o', 'Ko', 'Mo', 'Go'] as const
export const FILE_SIZE_STEP = 1024
export const FILE_SIZE_LOCALE = 'fr-FR'
export const FILE_SIZE_MAX_FRACTION_DIGITS = 1

export const IMPORT_MESSAGES = {
  rejectedSingle: 'Format non pris en charge :',
  rejectedMultiple: 'Formats non pris en charge :',
  acceptedFormats: 'Formats acceptés :',
  processingUnavailable: 'Traitement des fichiers non disponible dans ce démonstrateur',
  localOnly:
    'Les fichiers restent dans ce navigateur : ils ne sont pas envoyés au serveur dans ce démonstrateur.',
} as const
