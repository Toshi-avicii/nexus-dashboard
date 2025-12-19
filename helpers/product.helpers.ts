import api from "@/lib/axios.config";
import { NewProduct, ProductStatus } from "@/types/product.types";
import { AxiosError } from "axios";

export async function createProduct(createProductData: NewProduct & { productStatus: ProductStatus }) {
    try {
        const reqUrl = 'products';
        const formData = new FormData();
        const newProductExceptImages: Omit<NewProduct, 'images'> & {
            productStatus: ProductStatus
        } = {
            discount: createProductData.discount,
            isActive: createProductData.isActive,
            metaFields: createProductData.metaFields,
            name: createProductData.name,
            options: createProductData.options,
            price: createProductData.price,
            productType: createProductData.productType,
            stock: createProductData.stock,
            variants: createProductData.variants,
            description: createProductData.description,
            productStatus: createProductData.productStatus,
            category: createProductData.category
        }

        // product json
        formData.append('product', JSON.stringify(newProductExceptImages));

        // product images
        createProductData.images.forEach(image => {
            formData.append("images", image)
        })

        const response = api.post(reqUrl, formData);
        return response;

    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}