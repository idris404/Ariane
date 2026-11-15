import { flexRender } from '@tanstack/react-table'
import type { LegacyReactTable } from '@tanstack/react-table/legacy'
import { Fragment, type ReactNode } from 'react'

import { ACTIONS_COLUMN_ID, CONSULT_PANELS, type ConsultPanel } from '../../../constants/to-consult'
import { SerumGrid, SerumLegend } from '../../../shared/components/SerumEvolution'
import type { PatientCase } from '../../../shared/utils/cases'
import { detailsRowId } from '../utils'
import { EventsSubTable } from './EventsSubTable'

type ConsultTableProps = {
  table: LegacyReactTable<PatientCase>
  // Le volet déplié sous chaque ligne (tests sériques ou événements), par identifiant de ligne.
  panels: Readonly<Record<string, ConsultPanel>>
  // Affiché dans le corps du tableau quand il n'y a aucune ligne (composant « empty »).
  empty: ReactNode
}

// Le tableau « À consulter ». La pagination est faite côté serveur ; une ligne se déplie en
// sous-tableau pour montrer ses tests sériques ou ses événements.
export function ConsultTable({ table, panels, empty }: ConsultTableProps) {
  return (
    <div className="data-scroll lg:min-h-0 lg:flex-1" role="region" aria-label="Liste des cas à consulter" tabIndex={0}>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Cas au suivi sérique fluctuant à consulter</caption>
        <thead className="bg-background text-xs text-muted-foreground">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  scope="col"
                  key={header.id}
                  className={`px-5 py-2 font-medium ${header.column.id === ACTIONS_COLUMN_ID ? 'text-right' : ''}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr className="border-t border-border">
              <td colSpan={table.getVisibleLeafColumns().length} className="p-5">
                {empty}
              </td>
            </tr>
          ) : null}
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr className="border-t border-border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {panels[row.id] === undefined ? null : (
                <tr id={detailsRowId(row.id)} className="border-t border-border bg-background">
                  <td colSpan={row.getVisibleCells().length} className="px-5 py-4">
                    {panels[row.id] === CONSULT_PANELS.events ? (
                      <EventsSubTable
                        patientName={row.original.name}
                        events={row.original.events}
                      />
                    ) : (
                      <div className="flex flex-col gap-3">
                        <SerumLegend />
                        <div className="rounded-lg border border-border bg-card">
                          <SerumGrid evolution={row.original.evolution} />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
