import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteCategory, getCategoryById } from "@/helpers/category.helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CategoryForm from "../category-form";
import { Checkbox } from "@/components/ui/checkbox";

type Category = {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
};

function RowAction({ categoryRow }: { categoryRow: Category }) {
    const [dialogType, setDialogType] = useState<'edit' | 'delete' | null>(null);
    const queryClient = useQueryClient();
    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCategory,
        onMutate() {
            toast.loading('Sending...', { id: 'category-delete-toast' });
        },
        onSuccess(data) {
            if (data) {
                console.log({ data });
                toast.dismiss('category-delete-toast');
                toast.success(data.data.message);
                setDialogType(null);
                queryClient.invalidateQueries({ queryKey: ['get-category-list'] });
            }
        },
        onError(error) {
            toast.dismiss('category-delete-toast');
            toast.error(error.message);
        },
    });

    const { isLoading, isError, data, error, refetch, isFetched, isFetching } = useQuery({
        queryKey: ['category', categoryRow._id],
        queryFn: () => getCategoryById(categoryRow._id),
        enabled: false
    });

    useEffect(() => {
        const close = () => setDialogType(null);
        window.addEventListener("category:update:success", close);

        return () =>
            window.removeEventListener("category:update:success", close);
    }, []);


    return (
        <Dialog open={dialogType !== null} onOpenChange={(open) => !open && setDialogType(null)}>
            <div className='space-x-4'>
                <DialogTrigger asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => {
                                    setDialogType("edit");
                                    refetch();
                                }}
                                size="sm"
                                variant="secondary"
                                className='cursor-pointer'
                            >
                                <Pencil />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                </DialogTrigger>

                <DialogTrigger asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => {
                                    setDialogType("delete");
                                }}
                                size="sm"
                                variant="secondary"
                                className='cursor-pointer bg-red-800 text-white hover:bg-red-900'
                            >
                                <Trash />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Delete
                        </TooltipContent>
                    </Tooltip>
                </DialogTrigger>
            </div>

            {
                dialogType === 'delete' &&
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Are you sure you want to delete this category? All the transactions related to this budget will also get deleted.</p>
                    </div>
                    {/* dialog footer */}
                    <DialogFooter>
                        <Button onClick={() => {
                            deleteCategoryMutation.mutate(categoryRow._id);
                        }}>
                            <Trash />
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            }

            {
                dialogType === "edit" && (
                    <DialogContent>
                        <DialogHeader>Edit Category</DialogHeader>
                        {
                            (isLoading || isFetching) && (
                                <p>Loading...</p>
                            )
                        }
                        {
                            isError && (
                                <p>{error.message}</p>
                            )
                        }
                        {
                            (data && isFetched && !isFetching) && (
                                <CategoryForm
                                    action="edit"
                                    key={JSON.stringify({
                                        description: data?.data.data.description,
                                        name: data?.data.data.name,
                                        id: data?.data.data._id
                                    })}
                                    category={{
                                        description: data?.data.data.description,
                                        name: data?.data.data.name,
                                        id: data?.data.data._id
                                    }}
                                />
                            )
                        }
                    </DialogContent>
                )
            }
        </Dialog>
    )
}

export const columns: ColumnDef<Category>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "name",
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    {
                        column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />
                    }
                </Button>
            )
        },
    },
    {
        id: "description",
        accessorKey: 'description',
        header: 'Description'
    },
    {
        id: "actions",
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const category = row.original;

            return (
                <RowAction categoryRow={category} />
            )
        }
    }
]