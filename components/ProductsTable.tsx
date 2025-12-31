'use client';

import { getProducts } from "@/helpers/product.helpers";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./table/data-table";
import { productTableCols } from "@/app/products/list/product-table-columns";

function ProductsTable() {
    const productListQuery = useQuery({
        queryKey: ['get-product-list'],
        queryFn: async () => {
            const data = await getProducts();
            return data;
        },
    });

    return (
        <div className="font-quickSand">
            <DataTable columns={productTableCols} data={productListQuery.data?.data.data || []}>
                <DataTable.Toolbar>
                    <DataTable.Search />
                </DataTable.Toolbar>

                <DataTable.Table />
                <DataTable.Pagination />
            </DataTable>
        </div>
    )
}

export default ProductsTable