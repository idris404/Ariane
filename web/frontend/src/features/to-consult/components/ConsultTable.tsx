import { flexRender } from '@tanstack/react-table'
import type { LegacyReactTable } from '@tanstack/react-table/legacy'
import { Fragment, type ReactNode } from 'react'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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
    <div className="data-scroll" role="region" aria-label="Liste des cas à consulter" tabIndex={0}>
      <Table className="text-left">
        <TableCaption className="sr-only">Cas au suivi sérique fluctuant à consulter</TableCaption>
        <TableHeader className="bg-background text-xs text-muted-foreground">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  scope="col"
                  key={header.id}
                  className={`px-5 py-2 font-medium ${header.column.id === ACTIONS_COLUMN_ID ? 'text-right' : ''}`}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length} className="p-5">
                {empty}
              </TableCell>
            </TableRow>
          ) : null}
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <TableRow>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-5 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {panels[row.id] === undefined ? null : (
                <TableRow id={detailsRowId(row.id)} className="bg-background hover:bg-background">
                  <TableCell colSpan={row.getVisibleCells().length} className="px-5 py-4">
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
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
