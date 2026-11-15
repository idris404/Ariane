import { API_ENDPOINTS } from '../../constants/api'
import {
  FILE_SIZE_LOCALE,
  FILE_SIZE_MAX_FRACTION_DIGITS,
  FILE_SIZE_STEP,
  FILE_SIZE_UNITS,
  IMPORT_MESSAGES,
} from '../../constants/import'
import { GENDER_LABELS } from '../../constants/patient-file'
import { InvalidResponseError, readJson } from '../../shared/api'
import { ageInYears, formatLongDate } from '../../shared/utils/dates'
import { buildFichePath } from '../../shared/utils/routes'
import {
  importExtensionSchema,
  patientPageSchema,
  type ListQuery,
  type PatientListItem,
  type PatientPage,
} from './schemas'

export type PatientRow = {
  id: string
  patientId: string
  name: string
  detail: string
  city: string
  birthLabel: string
  href: string
}

export function toPatientRow(patient: PatientListItem, today: Date): PatientRow {
  const gender = GENDER_LABELS[patient.gender]
  const age = patient.birth === null ? null : ageInYears(patient.birth, today)
  return {
    id: patient.id,
    patientId: patient.patient_id,
    name: `${patient.firstname} ${patient.lastname}`,
    detail: age === null ? gender : `${age} ans · ${gender}`,
    city: patient.city,
    birthLabel: patient.birth === null ? 'Non renseignée' : formatLongDate(patient.birth),
    href: buildFichePath(patient.id),
  }
}

export async function getPatientPage(query: ListQuery): Promise<PatientPage> {
  const params = new URLSearchParams({
    page: String(query.page),
    page_size: String(query.pageSize),
    sort_by: query.sortBy,
    sort_order: query.sortOrder,
  })
  if (query.search !== '') {
    params.set('search', query.search)
  }
  if (query.gender !== null) {
    params.set('gender', query.gender)
  }
  const parsed = patientPageSchema.safeParse(await readJson(`${API_ENDPOINTS.patients}?${params.toString()}`))
  if (!parsed.success) {
    throw new InvalidResponseError()
  }
  return parsed.data
}

// --- Fenêtre d'import : documents déposés par l'utilisateur (jamais envoyés au serveur) ---

export type ImportEntry = { key: string; file: File }

export type ImportRow = {
  key: string
  name: string
  extensionLabel: string
  sizeLabel: string
}

// Extension en minuscules, sans le point ; chaîne vide s'il n'y en a pas.
export function getFileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.')
  return dot < 0 ? '' : fileName.slice(dot + 1).toLowerCase()
}

export function isAcceptedImportFile(file: File): boolean {
  return importExtensionSchema.safeParse(getFileExtension(file.name)).success
}

export function splitImportFiles(files: readonly File[]): { accepted: File[]; rejected: File[] } {
  const accepted: File[] = []
  const rejected: File[] = []
  for (const file of files) {
    ;(isAcceptedImportFile(file) ? accepted : rejected).push(file)
  }
  return { accepted, rejected }
}

// Même nom, même taille, même date de modification : le même document, déposé deux fois.
export function toImportEntry(file: File): ImportEntry {
  return { key: `${file.name}:${file.size}:${file.lastModified}`, file }
}

export function mergeImportEntries(current: readonly ImportEntry[], accepted: readonly File[]): ImportEntry[] {
  const merged = [...current]
  const known = new Set(current.map((entry) => entry.key))
  for (const file of accepted) {
    const entry = toImportEntry(file)
    if (!known.has(entry.key)) {
      known.add(entry.key)
      merged.push(entry)
    }
  }
  return merged
}

export function formatFileSize(bytes: number): string {
  let value = bytes
  let unit = 0
  while (value >= FILE_SIZE_STEP && unit < FILE_SIZE_UNITS.length - 1) {
    value /= FILE_SIZE_STEP
    unit += 1
  }
  const formatted = new Intl.NumberFormat(FILE_SIZE_LOCALE, {
    maximumFractionDigits: unit === 0 ? 0 : FILE_SIZE_MAX_FRACTION_DIGITS,
  }).format(value)
  return `${formatted} ${FILE_SIZE_UNITS[unit]}`
}

export function toImportRow(entry: ImportEntry): ImportRow {
  return {
    key: entry.key,
    name: entry.file.name,
    extensionLabel: getFileExtension(entry.file.name).toUpperCase(),
    sizeLabel: formatFileSize(entry.file.size),
  }
}

export function describeRejectedFiles(names: readonly string[]): string | null {
  if (names.length === 0) {
    return null
  }
  const prefix = names.length === 1 ? IMPORT_MESSAGES.rejectedSingle : IMPORT_MESSAGES.rejectedMultiple
  return `${prefix} ${names.join(', ')}`
}

// Un navigateur qui reçoit un fichier lâché hors d'une zone de dépôt l'ouvre et quitte l'application.
export function preventBrowserDrop(event: { preventDefault: () => void }): void {
  event.preventDefault()
}
