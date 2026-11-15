import { functionalUpdate } from '@tanstack/react-table'
import {
  getCoreRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from '@tanstack/react-table/legacy'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  ACTIONS_COLUMN_ID,
  CONSULT_PAGE_SIZE,
  CONSULT_PANELS,
  FIRST_PAGE,
  type ConsultPanel,
} from '../../../constants/to-consult'
import { useConsultQueue } from '../../../shared/hooks/useConsultQueue'
import { useImportedData } from '../../../shared/hooks/useImportedData'
import { toPatientCase, type PatientCase } from '../../../shared/utils/cases'
import { ActionsCell, EventsCell, PatientCell, ProfileCell } from '../components/ConsultCells'
import { consultErrorMessage, detailsRowId } from '../utils'

// Le tableau « À consulter » : la pagination se fait côté serveur et vit dans l'URL (`?page=`),
// pour qu'un retour depuis une fiche retombe sur la même page. Chaque ligne peut déplier un volet
// (tests sériques ou événements), un seul à la fois.
export function useToConsult() {
  const [pageParam, setPageParam] = useQueryState('page', parseAsInteger.withDefault(FIRST_PAGE))
  const page = Math.max(FIRST_PAGE, pageParam)
  const [panels, setPanels] = useState<Record<string, ConsultPanel>>({})
  const [today] = useState(() => new Date())
  const queue = useConsultQueue(page, CONSULT_PAGE_SIZE)
  const isImported = useImportedData()

  // Ouvre le volet demandé sous la ligne ; le redemander le referme, en demander un autre le remplace.
  const togglePanel = useCallback((rowId: string, panel: ConsultPanel) => {
    setPanels((current) => {
      const next = { ...current }
      if (current[rowId] === panel) {
        delete next[rowId]
      } else {
        next[rowId] = panel
      }
      return next
    })
  }, [])

  const columns = useMemo<LegacyColumnDef<PatientCase>[]>(
    () => [
      { id: 'patient', header: 'Patient', cell: ({ row }) => <PatientCell item={row.original} /> },
      {
        id: 'profile',
        header: 'Profil sérique',
        cell: ({ row }) => <ProfileCell evolution={row.original.evolution} />,
      },
      {
        id: 'events',
        header: 'Événements',
        cell: ({ row }) => (
          <EventsCell
            item={row.original}
            open={panels[row.id] === CONSULT_PANELS.events}
            detailsId={detailsRowId(row.id)}
            onToggle={() => togglePanel(row.id, CONSULT_PANELS.events)}
          />
        ),
      },
      {
        id: ACTIONS_COLUMN_ID,
        header: 'Actions',
        cell: ({ row }) => (
          <ActionsCell
            item={row.original}
            expanded={panels[row.id] === CONSULT_PANELS.tests}
            detailsId={detailsRowId(row.id)}
            onToggle={() => togglePanel(row.id, CONSULT_PANELS.tests)}
          />
        ),
      },
    ],
    [panels, togglePanel],
  )

  const cases = useMemo(
    () => (queue.data?.items ?? []).map((item) => toPatientCase(item, today)),
    [queue.data, today],
  )
  const total = queue.data?.total ?? 0
  const pageCount = Math.max(FIRST_PAGE, Math.ceil(total / CONSULT_PAGE_SIZE))

  // Une page hors limites (URL modifiée à la main) ramène à la dernière page.
  useEffect(() => {
    if (total > 0 && page > pageCount) {
      void setPageParam(pageCount)
    }
  }, [total, page, pageCount, setPageParam])

  const table = useLegacyTable({
    data: cases,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: total,
    getRowId: (row) => row.id,
    state: { pagination: { pageIndex: page - 1, pageSize: CONSULT_PAGE_SIZE } },
    onPaginationChange: (updater) => {
      const next = functionalUpdate(updater, { pageIndex: page - 1, pageSize: CONSULT_PAGE_SIZE })
      setPanels({})
      void setPageParam(next.pageIndex + 1)
    },
  })

  return {
    table,
    panels,
    isImported,
    total,
    from: total === 0 ? 0 : (page - 1) * CONSULT_PAGE_SIZE + 1,
    to: Math.min(page * CONSULT_PAGE_SIZE, total),
    isLoading: queue.isLoading,
    errorMessage: queue.isError ? consultErrorMessage(queue.error) : null,
  }
}
