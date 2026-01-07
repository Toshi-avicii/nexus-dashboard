import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { DataTableContext } from "./data-table-context";
import { DataTableTable } from "./data-table-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableSearch } from "./data-table-search";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableBulkDelete } from "./data-table-bulk-delete";
import DataTableBulkUpload from "./data-table-bulk-upload";

interface WithId {
  _id: string;
}

interface DataTableProps<TData extends WithId> {
  columns: ColumnDef<TData>[];
  data: TData[];
  children?: React.ReactNode;
  isLoading?: boolean;
  meta?: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange?: (params: { pageIndex: number; pageSize: number }) => void;
}

type DataTableComponent = (<TData extends WithId>(
  props: DataTableProps<TData> & { children?: React.ReactNode }
) => React.ReactElement | null) & {
  Toolbar: React.FC<{ children: React.ReactNode }>;
  Search: React.FC;
  Table: React.FC;
  Pagination: React.FC;
  BulkDelete: React.FC<{ onDelete: (selectedIds: string[]) => void }>;
  BulkUpload: React.FC<{ onUpload: (file: File) => void; accept?: string; allowedTypes?: string[]; isLoading?: boolean; }>;
};

const DataTableBase = <TData extends WithId>({
  columns,
  data,
  children,
  isLoading,
  meta,
  onPaginationChange,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Initial pagination state (works with server-side or client-side)
  const [pagination, setPagination] = useState({
    pageIndex: (meta?.page ?? 1) - 1,
    pageSize: meta?.limit ?? 5,
  });

  const isServer = !!meta;

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: isServer ? undefined : getPaginationRowModel(),
    manualPagination: isServer,
    pageCount: isServer ? meta?.totalPages ?? -1 : undefined,
    globalFilterFn: "includesString",
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
    },
    onPaginationChange: (updater) => {
      setPagination(updater);

      const next = typeof updater === "function" ? updater(pagination) : updater;

      if (isServer) {
        onPaginationChange?.({
          pageIndex: next.pageIndex,
          pageSize: next.pageSize,
        });
      }
    },
    initialState: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
  });

  // Keep pagination in sync with meta for server-side
  useEffect(() => {
    if (!meta) return;
    setPagination({
      pageIndex: meta.page - 1,
      pageSize: meta.limit,
    });
  }, [meta?.page, meta?.limit]);

  const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original._id);

  return (
    <DataTableContext.Provider value={{ table, selectedIds, columns, isLoading, meta }}>
      <div className="space-y-4">{children}</div>
    </DataTableContext.Provider>
  );
};

export const DataTable = DataTableBase as DataTableComponent;
DataTable.Toolbar = DataTableToolbar;
DataTable.Table = DataTableTable;
DataTable.Search = DataTableSearch;
DataTable.Pagination = DataTablePagination;
DataTable.BulkDelete = DataTableBulkDelete;
DataTable.BulkUpload = DataTableBulkUpload;
