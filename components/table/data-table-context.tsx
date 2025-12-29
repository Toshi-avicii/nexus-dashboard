import { ColumnDef, Table } from "@tanstack/react-table"
import React from "react";

interface WithId {
  _id: string;
}

type DataTableContextValue<TData extends WithId> = {
  table: Table<TData>;
  selectedIds: string[];
  columns: ColumnDef<TData>[];
}

export const DataTableContext = React.createContext<DataTableContextValue<any> | null>(null)

export function useDataTable() {
  const ctx = React.useContext(DataTableContext)
  if (!ctx) {
    throw new Error("DataTable components must be used within <DataTable>")
  }
  return ctx
}