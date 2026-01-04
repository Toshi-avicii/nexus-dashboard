'use client';

import { getProducts, uploadProductsExcelSheet } from "@/helpers/product.helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./table/data-table";
import { productTableCols } from "@/app/products/list/product-table-columns";
import { toast } from "sonner";

function ProductsTable() {
    const queryClient = useQueryClient();
    const productListQuery = useQuery({
        queryKey: ['get-product-list'],
        queryFn: async () => {
            const data = await getProducts();
            return data;
        },
    });

    const uploadBulkProductMutation = useMutation({
        mutationFn: uploadProductsExcelSheet,
        onMutate() {
            toast.loading('Sending...', { id: 'upload-bulk-product-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('upload-bulk-product-toast');
                toast.success(data.data.message);
                queryClient.invalidateQueries({ queryKey: ['get-product-list'] });
            }
        },
        onError(error) {
            toast.dismiss('upload-bulk-product-toast');
            toast.error(error.message);
        },
    })

    return (
        <div className="font-quickSand">
            <DataTable
                isLoading={productListQuery.isFetching || productListQuery.isLoading}
                columns={productTableCols}
                data={productListQuery.data?.data.data || []}
            >
                <DataTable.Toolbar>
                    <DataTable.Search />
                    <DataTable.BulkUpload 
                        onUpload={uploadBulkProductMutation.mutate} 
                    />
                </DataTable.Toolbar>

                <DataTable.Table />
                <DataTable.Pagination />
            </DataTable>
        </div>
    )
}

export default ProductsTable