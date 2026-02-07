'use client';

import { getProducts, moveManyProductsToBin, uploadProductsExcelSheet } from "@/helpers/product.helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./table/data-table";
import { productTableCols } from "@/app/admin/products/list/product-table-columns";
import { toast } from "sonner";
import { useState } from "react";

function ProductsTable() {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
    });

    const queryClient = useQueryClient();
    const productListQuery = useQuery({
        queryKey: ['get-product-list', {
            category: '',
            minPrice: 0,
            search: '',
            page: pagination.page,
            limit: pagination.limit,
        },],
        queryFn: async () => {
            const data = await getProducts({
                category: '',
                minPrice: 0,
                search: '',
                page: pagination.page,
                limit: pagination.limit,
            });
            return data;
        },
        placeholderData: (previousData) => previousData
    });

    const uploadBulkProductMutation = useMutation({
        mutationFn: uploadProductsExcelSheet,
        onMutate() {
            toast.loading('Sending...', { id: 'upload-bulk-product-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('upload-bulk-product-toast');
                let toastMsg = '';
                if (data.data.data.rejectedRows.length) {
                    data.data.data.rejectedRows.forEach((rejectedRow: any, index: number) => {
                        if (index < 10) toastMsg += ` ${rejectedRow.error} at row no. ${rejectedRow.rowNo}`;
                    })

                }

                toast.success(`${data.data.message}`);
                if (toastMsg.length > 0) toast.error(toastMsg);
                queryClient.invalidateQueries({ queryKey: ['get-product-list'] });
            }
        },
        onError(error) {
            toast.dismiss('upload-bulk-product-toast');
            toast.error(error.message);
        },
    });

    const softDeleteManyProducts = useMutation({
        mutationFn: moveManyProductsToBin,
        onMutate() {
            toast.loading('Sending...', { id: 'move-bulk-product-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('move-bulk-product-toast');
                toast.success(`${data.data.message}`);
                queryClient.invalidateQueries({ queryKey: ['get-product-list'] });
            }
        },
        onError(error) {
            toast.dismiss('move-bulk-product-toast');
            toast.error(error.message);
        },
    })

    return (
        <div className="font-quickSand">
            <DataTable
                isLoading={productListQuery.isFetching || productListQuery.isLoading}
                columns={productTableCols}
                data={(!productListQuery.isFetching && !productListQuery.isLoading) ? productListQuery.data?.data.data : []}
                meta={((!productListQuery.isFetching && !productListQuery.isLoading)) && productListQuery.data?.data.meta}
                onPaginationChange={({ pageIndex, pageSize }) => {
                    setPagination({
                        page: pageIndex + 1,
                        limit: pageSize,
                    });
                }}
            >
                <DataTable.Toolbar>
                    <DataTable.Search />
                    <DataTable.BulkUpload
                        onUpload={uploadBulkProductMutation.mutate}
                        isLoading={uploadBulkProductMutation.isPending}
                    />
                    <DataTable.BulkDelete
                        onDelete={(ids: string[]) => {
                            softDeleteManyProducts.mutate(ids);
                        }}
                    />
                </DataTable.Toolbar>

                <DataTable.Table />
                <DataTable.Pagination />
            </DataTable>
        </div>
    )
}

export default ProductsTable