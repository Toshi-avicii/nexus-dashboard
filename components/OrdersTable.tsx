'use client';

import { getProducts, moveManyProductsToBin, uploadProductsExcelSheet } from "@/helpers/product.helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./table/data-table";
import { productTableCols } from "@/app/admin/products/list/product-table-columns";
import { toast } from "sonner";
import { useState } from "react";
import { getAllOrdersForAdmin } from "@/helpers/orders.helpers";

function OrdersTable() {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
    });

    const queryClient = useQueryClient();
    const orderListForAdminQuery = useQuery({
        queryKey: ['get-orders-list-for-admin', {
            page: pagination.page,
            limit: pagination.limit,
        },],
        queryFn: async () => {
            const data = await getAllOrdersForAdmin({
                page: pagination.page,
                limit: pagination.limit,
            });
            return data;
        },
        placeholderData: (previousData) => previousData
    });

    return (
        <div className="font-quickSand">
            <DataTable
                isLoading={orderListForAdminQuery.isFetching || orderListForAdminQuery.isLoading}
                columns={[]}
                data={(!orderListForAdminQuery.isFetching && !orderListForAdminQuery.isLoading) ? orderListForAdminQuery.data?.data.data : []}
                meta={((!orderListForAdminQuery.isFetching && !orderListForAdminQuery.isLoading)) && orderListForAdminQuery.data?.data.meta}
                onPaginationChange={({ pageIndex, pageSize }) => {
                    setPagination({
                        page: pageIndex + 1,
                        limit: pageSize,
                    });
                }}
            >
                {/* <DataTable.Toolbar>
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
                </DataTable.Toolbar> */}

                <DataTable.Table />
                <DataTable.Pagination />
            </DataTable>
        </div>
    )
}

export default OrdersTable