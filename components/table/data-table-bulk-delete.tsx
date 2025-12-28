import { ListX } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useDataTable } from "./data-table-context";

interface DataTableBulkDeleteProps {
    onDelete: (selectedIds: string[]) => void;
}

export function DataTableBulkDelete({ onDelete }: DataTableBulkDeleteProps) {
    const { selectedIds } = useDataTable();
    return (
        <div>
            {
                selectedIds.length > 0 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                onClick={() => onDelete(selectedIds)}
                                variant="destructive" 
                                type="button" 
                                className="cursor-pointer"
                            >
                                <ListX />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Delete all {selectedIds.length} selected rows</p>
                        </TooltipContent>
                    </Tooltip>
                )
            }
        </div>
    )
}