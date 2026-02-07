'use client';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CircleCheck, Pencil, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { FetchedProduct, NewProduct, SelectedProduct, SelectedStatus } from '@/types/product.types';
import clsx from 'clsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NewProductForm, newProductFormSchema } from '@/components/NewProductForm';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ProductDetail from './product-detail';

const availableProductCategories = [
    {
        id: 1,
        text: 'Clothing',
        value: 'clothing'
    },
    {
        id: 2,
        text: 'Furniture',
        value: 'furniture'
    },
    {
        id: 3,
        text: 'Electronics',
        value: 'electronics'
    },
    {
        id: 4,
        text: 'Other',
        value: 'other'
    },
];

type Action = "create" | "view" | "edit";
type CreateNewProductData = Omit<NewProduct, 'productType'>;

function getInitialFormData(action: "create"): CreateNewProductData;
function getInitialFormData(action: "edit" | "view", productData: FetchedProduct): FetchedProduct;
function getInitialFormData(action: Action, productData?: FetchedProduct): CreateNewProductData | FetchedProduct {
    if ((action === "edit" || action === "view") && productData) {
        return productData!;
    } else {
        return {
            category: [],
            discount: 0,
            images: [],
            isActive: true,
            metaFields: [],
            name: '',
            options: [],
            price: 0,
            stock: 0,
            variants: [],
            description: ''
        }
    }
}

function CreateNewProduct({ action, productData }: { action: Action, productData?: FetchedProduct }) {
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(productData ? productData.productType : null);
    const [selectedProductStatus, setSelectedProductStatus] = useState<SelectedStatus>(productData ? productData.status : 'draft');
    const isInReadOrEditView = ((action === "view" || action === "edit") && productData);
    const [formData] = useState(
        action === "create" ? getInitialFormData(action) : getInitialFormData(action, productData!)
    );

    const form = useForm<z.infer<typeof newProductFormSchema>>({
        resolver: zodResolver(newProductFormSchema),
        defaultValues: {
            category: (isInReadOrEditView ? productData.category.map(item => item._id) : []),
            discount: (isInReadOrEditView ? productData.discount : 0),
            images: [],
            isActive: (isInReadOrEditView ? productData.isActive : true),
            metaFields: (isInReadOrEditView ? productData.metaFields : []),
            name: (isInReadOrEditView ? productData.name : ''),
            options: (isInReadOrEditView ? productData.options : []),
            price: (isInReadOrEditView ? productData.price : 0),
            stock: (isInReadOrEditView ? productData.stock : 0),
            variants: (isInReadOrEditView ? productData.variants : []),
            description: (isInReadOrEditView ? productData.description : '')
        },
        mode: "all"
    });

    function generateStyleForProductStatus() {
        if (action === 'create' && selectedProductStatus === 'draft') {
            return clsx('bg-red-400 text-white');
        }

        if (action === 'edit' && selectedProductStatus === 'draft') {
            return clsx('bg-red-400 text-white');
        }

        if (action === 'view' && productData?.status === 'draft') {
            return clsx('bg-red-400 text-white');
        }

        return clsx('bg-green-600 text-white');
    }

    function generateStyleForArrow() {
        if (action === 'create' && selectedProductStatus === 'draft') {
            return clsx('bg-red-400 fill-red-400');
        }

        if (action === 'edit' && selectedProductStatus === 'draft') {
            return clsx('bg-red-400 fill-red-400');
        }

        if (action === 'view' && productData?.status === 'draft') {
            return clsx('bg-red-400 fill-red-400');
        }

        return clsx('bg-green-600 text-white fill-green-600');
    }

    return (
        <div>
            <FormProvider {...form}>
                <div className='flex justify-between items-center mb-4'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                disabled={action === 'view'}
                                variant="default"
                                className="font-quickSand flex items-center justify-center gap-x-2 cursor-pointer px-4 py-4"
                            >
                                {
                                    action !== 'view' && <Plus />
                                }
                                <span>
                                    {
                                        selectedProduct ? selectedProduct : "Create Product"
                                    }
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 font-quickSand" align="start">
                            <DropdownMenuGroup>
                                {
                                    availableProductCategories.map((item) => {
                                        return (
                                            <DropdownMenuItem
                                                key={item.id}
                                                onSelect={(e: React.MouseEvent<HTMLDivElement> | Event) => {
                                                    setSelectedProduct(item.value as SelectedProduct);
                                                }}
                                            >
                                                {item.text}
                                            </DropdownMenuItem>
                                        )
                                    })
                                }
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            disabled={action === 'view'}
                                            variant="default"
                                            className="font-quickSand flex items-center justify-center gap-x-2 cursor-pointer px-4 py-4"
                                        >
                                            {
                                                action !== 'view' && (selectedProductStatus === "draft" ? <Pencil /> : <CircleCheck />)
                                            }

                                            <span>
                                                {
                                                    action === "view" ? productData?.status : "Product Status"
                                                }
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-40 font-quickSand" align="start">
                                        <DropdownMenuGroup>
                                            {[
                                                { id: 1, text: "Draft", value: "draft" },
                                                { id: 2, text: "Publish", value: "published" },
                                            ].map((item) => (
                                                <DropdownMenuItem
                                                    key={item.id}
                                                    onSelect={() =>
                                                        setSelectedProductStatus(item.value as SelectedStatus)
                                                    }
                                                >
                                                    {item.text}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TooltipTrigger>

                        <TooltipContent
                            className={generateStyleForProductStatus()}
                            arrowClassName={generateStyleForArrow()}
                        >
                            {selectedProductStatus === "draft" ? (
                                <p>Product will be saved as draft</p>
                            ) : (
                                <p>Product will be published</p>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </div>

                {
                    (action === "create" && selectedProduct) && (
                        <div
                            className='flex gap-x-4 my-4 flex-col lg:flex-row gap-y-4'
                        >
                            <Card className='p-4 flex-[3] overflow-hidden'>
                                <ProductDetail
                                    category={form.watch('category')}
                                    discount={form.watch('discount')}
                                    images={form.watch('images')}
                                    isActive={form.watch('isActive')}
                                    metaFields={form.watch('metaFields')}
                                    name={form.watch('name')}
                                    options={form.watch('options')}
                                    price={form.watch('price')}
                                    productType={selectedProduct}
                                    stock={form.watch('stock')}
                                    variants={form.watch('variants')}
                                    description={form.watch('description')}
                                />
                            </Card>
                            <NewProductForm
                                selectedProduct={selectedProduct}
                                selectedProductStatus={selectedProductStatus}
                                action='create'
                            />
                        </div>
                    )
                }

                {
                    ((action === "edit" || action === "view") && !productData) && (
                        <NewProductForm
                            selectedProduct={selectedProduct}
                            selectedProductStatus={selectedProductStatus}
                            action={action}
                        />
                    )
                }

                {
                    ((action === "edit" || action === "view") && productData) && (
                        <NewProductForm
                            selectedProduct={selectedProduct}
                            selectedProductStatus={selectedProductStatus}
                            productData={productData}
                            action={action}
                        />
                    )
                }
            </FormProvider>
        </div>
    )
}

export default CreateNewProduct