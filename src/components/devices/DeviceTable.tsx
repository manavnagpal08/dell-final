'use client';

import { useState } from 'react';
import { Device } from '@/types';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react';

const columns: ColumnDef<Device>[] = [
  {
    accessorKey: 'name',
    header: 'Device Name',
    cell: ({ row }) => (
      <Link href={`/devices/${row.original.id}`} className="font-medium text-primary hover:underline">
        {row.getValue('name')}
      </Link>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'vendor',
    header: 'Vendor',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'risk_level',
    header: 'Risk Level',
    cell: ({ row }) => <RiskBadge level={row.getValue('risk_level')} score={row.original.risk_score} />,
  },
  {
    accessorKey: 'predicted_failure_type',
    header: 'Predicted Issue',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.getValue('predicted_failure_type') || <span className="text-muted-foreground">None</span>}
      </span>
    ),
  },
  {
    accessorKey: 'days_remaining',
    header: 'Est. Days Left',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.getValue('days_remaining') !== null ? `${row.getValue('days_remaining')} days` : '-'}
      </span>
    ),
  },
];

export function DeviceTable({ data }: { data: Device[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card/40 backdrop-blur-md shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center gap-1 hover:text-foreground'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUp className="h-4 w-4" />,
                            desc: <ChevronDown className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? (
                            header.column.getCanSort() ? <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" /> : null
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground flex items-center justify-center min-w-[4rem]">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
