import ProductsTable from "@/components/ProductsTable"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

function ListPage() {
    return (
        <div className="p-4">
            <Breadcrumb className="font-quickSand">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" linkTag>Products</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/products/create" linkTag>List</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <ProductsTable />
        </div>
    )
}

export default ListPage