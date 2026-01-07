import BinnedProductsTable from "@/components/BinnedProductsTable"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

function ProductsBinPage() {
    return (
        <div className="p-4">
            <Breadcrumb className="font-quickSand">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" linkTag>Products</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/products/bin" linkTag>Bin</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <BinnedProductsTable />
        </div>
    )
}

export default ProductsBinPage