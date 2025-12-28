import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import React, { useState } from "react";
import { DataTableContext } from "./data-table-context";
import { DataTableTable } from "./data-table-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableSearch } from "./data-table-search";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableBulkDelete } from "./data-table-bulk-delete";

interface WithId {
    _id: string;
}

interface DataTableProps<TData extends WithId> {
    columns: ColumnDef<TData>[];
    data: TData[];
    children?: React.ReactNode;
}

type DataTableComponent = (<TData extends WithId>(
    props: DataTableProps<TData> & { children?: React.ReactNode }
) => React.ReactElement | null) & {
    Toolbar: React.FC<{ children: React.ReactNode }>
    Search: React.FC
    Table: React.FC
    Pagination: React.FC
    BulkDelete: React.FC<{ onDelete: (ids: string[]) => void }>
}

const DataTableBase = <TData extends WithId>({
    columns,
    data,
    children,
}: DataTableProps<TData>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5, // default page size
    });

    // 🔹 your existing TanStack setup
    const table = useReactTable<TData>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "includesString",
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
            rowSelection
        },
        onPaginationChange: setPagination,
        initialState: {
            pagination: {
                pageSize: pagination.pageSize,
            },
        },
    });

    const selectedIds = table
        .getSelectedRowModel()
        .rows
        .map(row => row.original._id)
    return (
        <DataTableContext.Provider value={{ table, selectedIds, columns }}>
            <div className="space-y-4">{children}</div>
        </DataTableContext.Provider>
    )
}

export const DataTable = DataTableBase as DataTableComponent;
DataTable.Toolbar = DataTableToolbar;
DataTable.Table = DataTableTable;
DataTable.Search = DataTableSearch;
DataTable.Pagination = DataTablePagination;
DataTable.BulkDelete = DataTableBulkDelete;
