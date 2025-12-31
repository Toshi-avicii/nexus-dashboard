import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import CreateNewProduct from "./create-new-product"

function CreateProductPage() {
    return (
        <div className="p-4">
            <Breadcrumb className="font-quickSand">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" linkTag>Products</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/products/create" linkTag>Create</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="my-4">
                <CreateNewProduct action="create" />
            </div>
        </div>
    )
}

export default CreateProductPage