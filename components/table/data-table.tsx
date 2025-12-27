"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectValue } from "../ui/select"
import { SelectTrigger } from "@radix-ui/react-select"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export function DataTable<TData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5, // default page size
  });

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
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination
    },
    onPaginationChange: setPagination,
    initialState: {
      pagination: {
        pageSize: pagination.pageSize,
      },
    },
  });

  const [pageRange, setPageRange] = useState([1, 2, 3, 4, 5]);
  const lastPage = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;

  function getLatestPageRange(
    { currentPage, lastPage, pageSize }:
      { currentPage: number, lastPage: number, pageSize: number }
  ) {
    if (currentPage >= 5 && currentPage <= lastPage) {
      let newRange = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
      newRange = newRange.filter(item => item <= lastPage);
      setPageRange(newRange);
    }

    if(currentPage > lastPage && lastPage >= 1) {
      let newRange = [lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
      newRange = newRange.filter(item => item > 0);
      setPageRange(newRange);
      setPagination({
        pageIndex: lastPage - 1,
        pageSize
      })
    }

    if(currentPage < 5 && lastPage >= 5) {
      setPageRange([1, 2, 3, 4, 5])
    }
  }

  useEffect(() => {
    getLatestPageRange({ currentPage, lastPage, pageSize });
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize])

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter categories"
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event?.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
      {/* pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          // onClick={() => table.previousPage()}
          onClick={() => {

            // const currentPage = table.getState().pagination.pageIndex;
            // const diff = table.getPageCount() - currentPage;
            // let nextPages = [];
            // for (let i = 0; i < diff; i++) {
            //   if(nextPages.length < 5) {
            //     nextPages.push(currentPage + i);
            //   }
            // }

            // setPageRange(nextPages);
            table.previousPage()
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>

        {
          (table.getState().pagination.pageIndex + 1) >= 5 && (
            <Button
              onClick={() => {
                setPageRange([1, 2, 3, 4, 5]);
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: 0
                }))
              }}
              variant={
                (table.getState().pagination.pageIndex + 1) === 1
                  ? "default"
                  : "outline"
              }
              size="sm"
            >
              1
            </Button>
          )
        }
        {
          ((table.getState().pagination.pageIndex + 2) > 5) && (
            <Button size="sm" variant="ghost">
              <Ellipsis />
            </Button>
          )
        }
        {pageRange.map((page) => {
          return (
            <Button
              key={page}
              variant={
                table.getState().pagination.pageIndex === page - 1
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => {
                table.setPageIndex(page - 1)
              }}
            >
              {page}
            </Button>
          )
        })}

        {
          table.getPageCount() > 5 && !(pageRange.includes(table.getPageCount())) && (
            <Button size="sm" variant="ghost">
              <Ellipsis />
            </Button>
          )
        }

        {
          table.getPageCount() > 5 && (!pageRange.includes(table.getPageCount())) && (
            <Button
              size="sm"
              variant={table.getState().pagination.pageIndex === (table.getPageCount() - 1) ? "default" : "outline"}
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
              }}
            >
              {table.getPageCount()}
            </Button>
          )
        }

        <Button
          variant="outline"
          size="sm"
          // onClick={() => table.nextPage()}
          onClick={() => {
            const currentPage = table.getState().pagination.pageIndex + 2;
            console.log({
              pageRange,
              currentPage,
            })
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>

        <Select onValueChange={(value) => {
          const pageSize = +value;
          setPagination((prev) => ({ ...prev, pageSize }));
        }}>
          <SelectTrigger className="px-3 text-sm py-[6px] shadow rounded-sm border dark:border-neutral-700">
            <SelectValue placeholder="5 / Page" />
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
  )
}