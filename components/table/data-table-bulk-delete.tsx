import { ListX } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useDataTable } from "./data-table-context";

export function DataTableBulkDelete() {
    const { table } = useDataTable();
    const selectedRows = table.getSelectedRowModel().rows.map(item => item.original).map(item => item._id);
    return (
        <div>
            {
                selectedRows.length > 0 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="destructive" type="button" className="cursor-pointer">
                                <ListX />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete all {selectedRows.length} selected rows</p>
                        </TooltipContent>
                    </Tooltip>
                )
            }
        </div>
    )
}