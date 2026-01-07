import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { useDataTable } from "./data-table-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";

export function DataTablePagination() {
  const { table, meta } = useDataTable();
  const [pageRange, setPageRange] = useState<number[]>([]);

  // ---- Determine if we are using server-side pagination ----
  const isServer = !!meta;

  // ---- Derived values ----
  const pageSize = isServer
    ? meta?.limit ?? table.getState().pagination.pageSize
    : table.getState().pagination.pageSize;

  const currentPage = isServer
    ? meta?.page ?? table.getState().pagination.pageIndex + 1
    : table.getState().pagination.pageIndex + 1;

  const totalRows = isServer
    ? meta?.total ?? 0
    : table.getFilteredRowModel().rows.length;

  const totalPages = isServer
    ? meta?.totalPages ?? 1
    : table.getPageCount();

  const start = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalRows);

  // ---- Page range logic ----
  function getLatestPageRange(current: number, total: number) {
    if (total <= 5) {
      setPageRange(Array.from({ length: total }, (_, i) => i + 1));
      return;
    }

    if (current <= 3) {
      setPageRange([1, 2, 3, 4, 5]);
      return;
    }

    if (current >= total - 2) {
      setPageRange([total - 4, total - 3, total - 2, total - 1, total]);
      return;
    }

    setPageRange([current - 2, current - 1, current, current + 1, current + 2]);
  }

  useEffect(() => {
    getLatestPageRange(currentPage, totalPages);
  }, [currentPage, totalPages]);

  // ---- Helpers for enabling/disabling buttons ----
  const canPrev = isServer ? currentPage > 1 : table.getCanPreviousPage();
  const canNext = isServer ? currentPage < totalPages : table.getCanNextPage();

  const setPage = (page: number) => {
    if (isServer) {
      table.setPageIndex(page - 1); // still triggers parent handler to fetch new page
    } else {
      table.setPageIndex(page - 1);
    }
  };

  return (
    <div className="flex items-center">
      {/* Row count */}
      <div className="text-muted-foreground flex-1 text-sm">
        {start} - {end} of {totalRows} row(s)
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!canPrev}>
          <ChevronLeft />
        </Button>

        {/* First page */}
        {currentPage > 3 && (
          <>
            <Button size="sm" variant={currentPage === 1 ? "default" : "outline"} onClick={() => setPage(1)}>
              1
            </Button>
            <Button size="sm" variant="ghost" disabled>
              <Ellipsis />
            </Button>
          </>
        )}

        {/* Page numbers */}
        {pageRange.map((page) => (
          <Button key={page} size="sm" variant={page === currentPage ? "default" : "outline"} onClick={() => setPage(page)}>
            {page}
          </Button>
        ))}

        {/* Last page */}
        {currentPage < totalPages - 2 && (
          <>
            <Button size="sm" variant="ghost" disabled>
              <Ellipsis />
            </Button>
            <Button size="sm" variant={currentPage === totalPages ? "default" : "outline"} onClick={() => setPage(totalPages)}>
              {totalPages}
            </Button>
          </>
        )}

        {/* Next */}
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!canNext}>
          <ChevronRight />
        </Button>

        {/* Page size */}
        <Select
          value={String(pageSize)}
          onValueChange={(value) => {
            table.setPagination({
              pageIndex: 0,
              pageSize: Number(value),
            });
          }}
        >
          <SelectTrigger className="px-3 text-sm py-[6px] shadow rounded-sm border dark:border-neutral-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="5">5 / Page</SelectItem>
              <SelectItem value="10">10 / Page</SelectItem>
              <SelectItem value="20">20 / Page</SelectItem>
              <SelectItem value="50">50 / Page</SelectItem>
              <SelectItem value="100">100 / Page</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
