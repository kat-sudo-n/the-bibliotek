'use client'

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { DataTablePagination } from '@/components/ui/data-table-pagination'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    perPage: number
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: number) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    perPage,
    currentPage,
    totalPages,
    onPageChange,
    onPerPageChange,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: totalPages,
        state: {
            pagination: {
                pageIndex: currentPage - 1,
                pageSize: perPage,
            },
        },
        onPaginationChange: (updater) => {
            const newState =
                typeof updater === 'function' ? updater({ pageIndex: currentPage - 1, pageSize: perPage }) : updater

            const newPage = newState.pageIndex + 1
            const newPageSize = newState.pageSize

            if (newPage !== currentPage) onPageChange(newPage)
            if (newPageSize !== perPage) onPerPageChange(newPageSize)
        },
    })

    return (
        <div className="rounded-md border w-full">
            <ScrollArea className="relative max-h-[60vh] overflow-auto">
                <Table className="relative overflow-auto">
                    <TableHeader className="sticky top-0">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
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
                                    Sin resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            <DataTablePagination table={table} />
        </div>
    )
}
