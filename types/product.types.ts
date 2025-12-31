export type Variant = {
    sku: string;
    price: number;
    stock: number;
    options: Record<string, string>[];
}

export type ProductOption = {
    name: string;
    values: string[];
}

export type MetaField = {
    namespace: string;
    key: string;
    value: string | number | boolean | any[] | {
        [x: string]: unknown;
    };
    type: string;
}

export type SelectedProduct = 'clothing' | 'furniture' | 'other' | 'electronics';
export type SelectedStatus = 'draft' | 'published';

export type NewProduct = {
    productType: SelectedProduct | null;
    name: string;
    price: number;
    discount: number;
    stock: number;
    category: string[];
    images: File[];
    isActive: boolean;
    variants: Variant[];
    options: ProductOption[];
    metaFields: MetaField[];
    description?: string | undefined;
}

export type ProductStatus = 'draft' | 'published';

export type FetchedProduct = Omit<NewProduct, 'images' | 'category'> & {
    _id: string;
    images: string[];
    category: {
        _id: string;
        name: string;
    }[];
    status: ProductStatus;
    createdAt: string;
    updatedAt: string;
}
