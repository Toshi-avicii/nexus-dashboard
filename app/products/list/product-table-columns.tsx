import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { deleteCategory, getCategoryById } from "@/helpers/category.helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Edit, Eye, Info, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FetchedProduct } from "@/types/product.types";
import Image from "next/image";
import { generateInrAmount } from "@/utils/generateInrAmount";
import clsx from "clsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateNewProduct from "../create/create-new-product";
import { deleteProductById } from "@/helpers/product.helpers";

function RowAction({ productRow }: { productRow: FetchedProduct }) {
    const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete' | null>(null);
    const queryClient = useQueryClient();
    const deleteProductMutation = useMutation({
        mutationFn: deleteProductById,
        onMutate() {
            toast.loading('Sending...', { id: 'product-delete-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('product-delete-toast');
                toast.success(data.data.message);
                setDialogType(null);
                queryClient.invalidateQueries({ queryKey: ['get-product-list'] });
            }
        },
        onError(error) {
            toast.dismiss('product-delete-toast');
            toast.error(error.message);
        },
    });
    return (
        <Dialog open={dialogType !== null} onOpenChange={(open) => !open && setDialogType(null)}>
            <div className='space-x-4 flex items-center'>
                <DialogTrigger asChild>
                    <div className="flex gap-x-3 justify-start items-center">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => setDialogType("view")}
                                    variant="outline"
                                    type="button"
                                    size="icon-sm"
                                    className="cursor-pointer"
                                >
                                    <Eye size={12} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                View Product
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </DialogTrigger>

                <DialogTrigger asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => setDialogType("edit")}
                                variant="secondary"
                                type="button"
                                size="icon-sm"
                                className="cursor-pointer"
                            >
                                <Edit size={12} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Edit Product
                        </TooltipContent>
                    </Tooltip>
                </DialogTrigger>

                <DialogTrigger asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => setDialogType("delete")}
                                variant="destructive"
                                type="button"
                                size="icon-sm"
                                className="cursor-pointer"
                            >
                                <Trash size={12} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Delete Product
                        </TooltipContent>
                    </Tooltip>
                </DialogTrigger>
            </div>

            {
                dialogType === 'delete' &&
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Are you sure you want to delete this product?</p>
                    </div>
                    {/* dialog footer */}
                    <DialogFooter>
                        <Button onClick={() => {
                            deleteProductMutation.mutate(productRow._id);
                        }}>
                            <Trash />
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            }

            {
                (dialogType === "edit" || dialogType === 'view') && (
                    <DialogContent className="max-h-10/12 flex flex-col overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {dialogType === "edit" ? "Edit" : "View"} Product
                            </DialogTitle>
                        </DialogHeader>
                        <CreateNewProduct action={dialogType} productData={productRow} />
                    </DialogContent>
                )
            }
        </Dialog>
    )
}

export const productTableCols: ColumnDef<FetchedProduct>[] = [
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
        id: "images",
        accessorKey: 'images',
        header: ({ column }) => {
            return (
                <p>Image</p>
            )
        },
        cell: ({ row }) => {
            const firstImage = row.original.images[0];
            if (firstImage) return (
                <Image src={firstImage} width={48} height={48} className="rounded-sm align-middle" alt={row.original.name} />
            )
            else return "N/A";
        }
    },
    {
        id: "category",
        accessorKey: 'category',
        header: 'Categories',
        cell: ({ row }) => {
            const categories = row.original.category;
            return categories.map(category => (
                <p key={category._id} className="mr-1">{category.name}</p>
            ))
        }
    },
    {
        id: "name",
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <span
                    className="flex gap-x-1 items-center cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    {
                        column.getIsSorted() === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    }
                </span>
            )
        },
    },
    {
        id: "price",
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <span
                    className="flex gap-x-1 items-center cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    {
                        column.getIsSorted() === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    }
                </span>
            )
        },
        cell: ({ row }) => {
            const price = row.original.price;
            return generateInrAmount(price);
        }
    },
    {
        id: "sellPrice",
        accessorKey: "sellPrice",
        header: () => {
            return (
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="flex items-center gap-x-1">
                                Sell Price
                                <Info size={12} />
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-semibold text-xs">
                                Sell Price = Actual Price - Discount
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            )
        },
        cell: ({ row }) => {
            const price = row.original.price;
            const discount = row.original.discount;
            const priceAfterDiscount = price - (price * (discount / 100));
            return <p className="font-semibold">{generateInrAmount(priceAfterDiscount)}</p>
        }
    },
    {
        id: "stock",
        accessorKey: 'stock',
        header: ({ column }) => {
            return (
                <span
                    className="flex gap-x-1 items-center cursor-pointer"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stock
                    {
                        column.getIsSorted() === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    }
                </span>
            )
        },
        cell: ({ row }) => {
            const stock = row.original.stock;
            return <p className={clsx('font-medium text-sm', stock > 10 ? 'text-green-600' : 'text-red-500')}>
                {stock}
            </p>
        }
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({ column, header, table }) => {
            return (
                <Select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) => {
                        table.getColumn("status")?.setFilterValue(
                            value === "all" ? undefined : value
                        )
                    }}
                >
                    <SelectTrigger className="w-fit border-none bg-transparent">
                        <SelectValue placeholder="Status" className="text-sm" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                </Select>
            )
        },
        cell: ({ row }) => {
            const status = row.original.status;
            if (status === 'draft') return <p className="text-amber-700 w-fit text-xs font-medium px-3 py-1 rounded-full bg-amber-200">Draft</p>
            else return <p className="text-green-700 text-xs font-medium bg-green-200 px-3 py-1 rounded-full w-fit">Published</p>
        },
        filterFn: (row, id, value) => {
            return row.getValue(id) === value;
        }
    },
    {
        id: "actions",
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => {
            const product = row.original;

            return (
                <RowAction productRow={product} />
            )
        }
    }
]