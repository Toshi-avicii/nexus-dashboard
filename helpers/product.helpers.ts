import api from "@/lib/axios.config";
import { NewProduct, ProductStatus } from "@/types/product.types";
import { AxiosError } from "axios";

type GetProductsParams = {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
};

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

export async function getProducts(params: GetProductsParams) {
    const query = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '' && value !== 0) {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString();
    try {
        const reqUrl = `products?${query}`;
        const result = await api.get(reqUrl);
        return result;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function getBin(params: GetProductsParams) {
    const query = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '' && value !== 0) {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString();
    try {
        const reqUrl = `products/bin?${query}`;
        const result = await api.get(reqUrl);
        return result;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function updateProductById(createProductData: NewProduct & { productStatus: ProductStatus, id: string }) {
    const reqUrl = `products/${createProductData.id}`;
    const formData = new FormData();
    try {
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

        const response = api.put(reqUrl, formData);
        return response;

    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function deleteProductById(productId: string) {
    try {
        const reqUrl = `products/${productId}`;
        const result = await api.delete(reqUrl);
        return result;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function permanentlyDeleteProductById(productId: string) {
    try {
        const reqUrl = `products/bin/${productId}`;
        const result = await api.delete(reqUrl);
        return result;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function moveProductFromBin(productId: string) {
    try {
        const reqUrl = `products/bin/${productId}`;
        const result = api.put(reqUrl);
        return result;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function uploadProductsExcelSheet(file: File) {
    try {
        const reqUrl = `products/bulk-upload`;

        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(reqUrl, formData);
        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function moveManyProductsToBin(productIds: string[]) {
    try {
        const reqUrl = 'products/move/bin';
        const result = await api.delete(reqUrl, {
            data: {
                productIds
            }
        });

        return result;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function permanentlyDeleteManyProducts(productIds: string[]) {
    try {
        const reqUrl = 'products/move/delete';
        const result = await api.delete(reqUrl, {
            data: {
                productIds
            }
        });

        return result;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}