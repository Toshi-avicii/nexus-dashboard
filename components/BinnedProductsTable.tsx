'use client';

import { getBin, permanentlyDeleteManyProducts } from "@/helpers/product.helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./table/data-table";
import { useState } from "react";
import { binnedProductTableCols } from "@/app/products/bin/products-bin-table-columns";
import { toast } from "sonner";

function BinnedProductsTable() {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
    });
    const queryClient = useQueryClient();

    const productListQuery = useQuery({
        queryKey: ['get-bin', {
            category: '',
            minPrice: 0,
            search: '',
            page: pagination.page,
            limit: pagination.limit,
        },],
        queryFn: async () => {
            const data = await getBin({
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

    const permanentlyDeleteManyProductsMutation = useMutation({
        mutationFn: permanentlyDeleteManyProducts,
        onMutate() {
            toast.loading('Deleting...', { id: 'move-bulk-product-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('move-bulk-product-toast');
                toast.success(`${data.data.message}`);
                queryClient.invalidateQueries({ queryKey: ['get-bin'] });
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
                columns={binnedProductTableCols}
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
                    <DataTable.BulkDelete 
                        onDelete={(ids: string[]) => {
                            permanentlyDeleteManyProductsMutation.mutate(ids);
                        }}
                    />
                </DataTable.Toolbar>

                <DataTable.Table />
                <DataTable.Pagination />
            </DataTable>
        </div>
    )
}

export default BinnedProductsTable