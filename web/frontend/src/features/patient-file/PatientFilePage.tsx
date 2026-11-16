import { SurfaceState } from '../../shared/components/SurfaceState'
import { AppShell } from '../../shared/components/AppShell'
import { Dossier } from './components/Dossier'
import { LoginPanel } from './components/LoginPanel'
import { usePatientFile } from './hooks/usePatientFile'
import { useRenalFunctionTable } from './hooks/useRenalFunctionTable'

export function PatientFilePage() {
  const { file, isLoading, needsSession, errorMessage } = usePatientFile()
  const table = useRenalFunctionTable(file?.renalRows ?? [])

  return (
    <AppShell section="Patients / Fiche patient">
      {needsSession ? <LoginPanel /> : null}
      {isLoading ? <SurfaceState state="loading" title="Chargement du dossier…" /> : null}
      {errorMessage ? <SurfaceState state="error" title={errorMessage} /> : null}
      {file ? <Dossier file={file} table={table} /> : null}
    </AppShell>
  )
}
