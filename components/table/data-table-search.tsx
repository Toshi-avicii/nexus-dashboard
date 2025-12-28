import { Input } from "../ui/input"
import { useDataTable } from "./data-table-context"

export function DataTableSearch() {
  const { table } = useDataTable();
  return (
    <Input
      placeholder="Search..."
      value={table.getState().globalFilter ?? ""}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      className="max-w-sm"
    />
  )
}
