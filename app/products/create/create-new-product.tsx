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

type CreateNewProductProps = {
    action: "create" | "view" | "edit";
    productData?: FetchedProduct;
}

function CreateNewProduct({ action, productData }: CreateNewProductProps) {
    const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
    const [selectedProductStatus, setSelectedProductStatus] = useState<SelectedStatus>('draft');
    const [formData] = useState<Omit<NewProduct, 'productType'>>({
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
    });

    const form = useForm<z.infer<typeof newProductFormSchema>>({
        resolver: zodResolver(newProductFormSchema),
        defaultValues: formData,
        mode: "all"
    });

    console.log({
        productData
    })
    return (
        <div>
            <FormProvider {...form}>
                {
                    (action === "create") && (
                        <div className='flex justify-between items-center'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="font-quickSand flex items-center justify-center gap-x-2 cursor-pointer px-4 py-4"
                                    >
                                        <Plus />
                                        <span>Create Product</span>
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
                                                    variant="default"
                                                    className="font-quickSand flex items-center justify-center gap-x-2 cursor-pointer px-4 py-4"
                                                >
                                                    {selectedProductStatus === "draft" ? <Pencil /> : <CircleCheck />}
                                                    <span>Product Status</span>
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
                                    className={clsx(selectedProductStatus === 'draft' ? 'bg-red-400 text-white' : 'bg-green-600 text-white')}
                                    arrowClassName={clsx(selectedProductStatus === 'draft' ? 'bg-red-400 fill-red-400' : 'bg-green-600 text-white fill-green-600')}
                                >
                                    {selectedProductStatus === "draft" ? (
                                        <p>Product will be saved as draft</p>
                                    ) : (
                                        <p>Product will be published</p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )
                }

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
                            <NewProductForm selectedProduct={selectedProduct} selectedProductStatus={selectedProductStatus} />
                        </div>
                    )
                }

                {
                    ((action === "edit" || action === "view") && !productData) && (
                        <NewProductForm 
                            selectedProduct={selectedProduct} 
                            selectedProductStatus={selectedProductStatus} 
                        />
                    )
                }

                {
                    ((action === "edit" || action === "view") && productData) && (
                        <NewProductForm 
                            selectedProduct={productData.productType} 
                            selectedProductStatus={productData.status} 
                        />
                    )
                }
            </FormProvider>
        </div>
    )
}

export default CreateNewProduct