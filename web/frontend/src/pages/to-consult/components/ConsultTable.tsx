import { flexRender } from '@tanstack/react-table'
import type { LegacyReactTable } from '@tanstack/react-table/legacy'
import { Fragment } from 'react'

import { ACTIONS_COLUMN_ID } from '../../../constants/to-consult'
import { SerumGrid, SerumLegend } from '../../../shared/components/SerumEvolution'
import type { PatientCase } from '../../../shared/utils/cases'
import { detailsRowId } from '../utils'

// Le tableau « À consulter ». La pagination est faite côté serveur ; les lignes se déplient pour
// montrer les tests sériques.
export function ConsultTable({ table }: { table: LegacyReactTable<PatientCase> }) {
  return (
    <div className="data-scroll" role="region" aria-label="Liste des cas à consulter" tabIndex={0}>
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
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr className="border-t border-border">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() ? (
                <tr id={detailsRowId(row.id)} className="border-t border-border bg-background">
                  <td colSpan={row.getVisibleCells().length} className="px-5 py-4">
                    <div className="flex flex-col gap-3">
                      <SerumLegend />
                      <div className="rounded-lg border border-border bg-card">
                        <SerumGrid evolution={row.original.evolution} />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
