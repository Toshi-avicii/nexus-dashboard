import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { useDataTable } from "./data-table-context";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";

export function DataTablePagination() {
    const { table } = useDataTable();
    const [pageRange, setPageRange] = useState([1, 2, 3, 4, 5]);
    const totalRows = table.getCoreRowModel().rows.length;
    const start = ((table.getState().pagination.pageIndex) * table.getState().pagination.pageSize) + 1;
    const end = ((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize) > totalRows ? totalRows : ((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize);
    const filteredRows = table.getFilteredRowModel().rows.length;

    function getLatestPageRange({
        currentPage,
        pageSize,
        filteredRows,
    }: {
        currentPage: number
        pageSize: number
        filteredRows: number
    }) {
        // 🔥 last page based on filtered rows
        const lastPage = Math.max(1, Math.ceil(filteredRows / pageSize))

        // Case 1: current page in middle range
        if (currentPage >= 5 && currentPage <= lastPage) {
            let newRange = [
                currentPage - 2,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                currentPage + 2,
            ]

            newRange = newRange.filter((item) => item <= lastPage)
            setPageRange(newRange)
            return
        }

        // Case 2: current page exceeds last page (happens after filtering)
        if (currentPage > lastPage && lastPage >= 1) {
            let newRange = [
                lastPage - 4,
                lastPage - 3,
                lastPage - 2,
                lastPage - 1,
                lastPage,
            ].filter((item) => item > 0)

            setPageRange(newRange)

            table.setPagination({
                pageIndex: lastPage - 1, // 0-based index
                pageSize,
            })
            return
        }

        // Case 3: near the start
        if (currentPage < 5) {
            setPageRange(
                Array.from(
                    { length: Math.min(5, lastPage) },
                    (_, i) => i + 1
                )
            )
        }
    }

    useEffect(() => {
        getLatestPageRange({
            currentPage: table.getState().pagination.pageIndex + 1,
            pageSize: table.getState().pagination.pageSize,
            filteredRows,
        })
    }, [
        table.getState().pagination.pageIndex,
        table.getState().pagination.pageSize,
        filteredRows
    ])

    return (
        <div className="flex items-center">
            {/* count */}
            <div className="text-muted-foreground flex-1 text-sm">
                {start} - {end} {" "} of{" "}
                {table.getFilteredRowModel().rows.length} row(s).
            </div>
            {/* pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
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
                                table.setPagination((prev) => ({
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
                    onClick={() => {
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight />
                </Button>

                <Select onValueChange={(value) => {
                    const pageSize = +value;
                    table.setPagination((prev) => ({ ...prev, pageSize }));
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