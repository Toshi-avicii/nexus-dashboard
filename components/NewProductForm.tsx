import { getCategories } from "@/helpers/category.helpers";
import { createProduct, updateProductById } from "@/helpers/product.helpers";
import { FetchedProduct, NewProduct } from "@/types/product.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Card } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import clsx from "clsx";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { CircleX, CloudUpload, Plus, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FetchedCategory } from "@/types/category.types";
import { MetaField, OptionField, VariantField } from "@/app/admin/products/create/others";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import Image from "next/image";
import { convertUrlToFile } from "@/utils/convertUrlToFile";

type SelectedProduct = 'clothing' | 'furniture' | 'other' | 'electronics';
type SelectedStatus = 'draft' | 'published';

type NewProductFormProps = {
    selectedProduct: SelectedProduct | null;
    selectedProductStatus: SelectedStatus;
    productData?: FetchedProduct;
    action: "create" | "edit" | "view";
}

const variantSchema = z.object({
    sku: z.string().min(3, { error: "Min length for sku is 3" }).max(50),
    price: z.number().min(1),
    stock: z.number().min(1, { error: "Stock must be greater than 0" }),
    options: z.array(z.record(z.string(), z.string()))
});

const optionSchema = z.object({
    name: z.string().min(3, { error: "name should be longer" }).max(30, { error: 'name should not be longer' }),
    values: z.array(z.string()).min(1, { error: 'at least 1 value is required' }).max(10, { error: 'cannot have more values' })
});

const metaFieldSchema = z.object({
    namespace: z.string(),
    key: z.string(),
    value: z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.any()),
        z.record(z.string(), z.unknown()), // represents an object,
    ]),
    type: z.string()
})

export const newProductFormSchema = z.object({
    category: z.array(z.string()).min(1, { error: "At least 1 category is mandatory" }).max(10, { error: "Cannot have more than 10 categories" }),
    discount: z.number().min(0, { error: "Discount cannot be negative" }),
    images: z.array(z.instanceof(File)),
    isActive: z.boolean(),
    metaFields: z.array(metaFieldSchema),
    name: z.string().min(3, { error: 'Name is short' }).max(100, { error: 'Name cannot be longer' }),
    options: z.array(optionSchema),
    price: z.number().min(1, { error: "Price can't be negative" }),
    // productType: z.enum(['clothing', 'furniture', 'electronics', 'other'], { error: 'product type is invalid' }).nullable(),
    stock: z.number().min(0, { error: "Stock can't be negative" }),
    variants: z.array(variantSchema),
    description: z.string().optional()
});

export function NewProductForm({ selectedProduct, selectedProductStatus, productData, action }: NewProductFormProps) {
    const queryClient = useQueryClient();
    const [isPhotosAccordionOpen, setIsPhotosAccordionOpen] = useState(true);
    const [isInfoAccordionOpen, setIsInfoAccordionOpen] = useState(true);
    const [isPriceInfoAccordionOpen, setIsPriceInfoAccordionOpen] = useState(true);
    const { data } = useQuery({
        queryKey: ['get-category-list'],
        queryFn: async () => {
            const data = await getCategories();
            return data;
        }
    });

    const [inputValue, setInputValue] = useState("");

    const form = useFormContext<z.infer<typeof newProductFormSchema>>();

    const createProductMutation = useMutation({
        mutationFn: createProduct,
        onMutate() {
            toast.loading('Creating...', { id: 'loading-toast' });
        },
        onSuccess: async (data) => {
            if (data) {
                toast.dismiss("loading-toast");
                toast.success("Product successfully created")
                form.reset();
            }
        },
        onError: (err) => {
            toast.dismiss('loading-toast');
            toast.error(err.message);
        }
    });

    const updateProductMutation = useMutation({
        mutationFn: updateProductById,
        onMutate() {
            toast.loading('Creating...', { id: 'loading-toast' });
        },
        onSuccess: async (data) => {
            if (data) {
                toast.dismiss("loading-toast");
                toast.success("Product data updated successfully")
                form.reset();
                queryClient.invalidateQueries({ queryKey: ['get-product-list'] });
            }
        },
        onError: (err) => {
            toast.dismiss('loading-toast');
            toast.error(err.message);
        }
    })

    function createNewProduct(data: z.infer<typeof newProductFormSchema>) {
        if (action === 'create') {
            const dataToBeSent = {
                ...data,
                productType: selectedProduct,
                productStatus: selectedProductStatus,
            }

            createProductMutation.mutate(dataToBeSent);
        }

        if(action === 'edit' && productData) {
            const dataToBeSent = {
                ...data,
                productType: selectedProduct,
                productStatus: selectedProductStatus,
                id: productData._id
            }

            updateProductMutation.mutate(dataToBeSent);
        }
    }

    const fileToUrl = async () => {
        const result = productData?.images.map(async (img) => {
            return await convertUrlToFile(img)
        });

        if (!result) return [];
        const resolved = await Promise.all(result);
        const files = resolved.filter((r): r is File => r instanceof File);
        return files;
    }

    useEffect(() => {
        const initialLoad = async () => {
            const res = await fileToUrl();
            form.setValue('images', res);
        }

        if (action === 'edit') initialLoad();
    }, [action]);

    return (
        <div className='flex-[7]'>
            <form
                autoComplete='off'
                className='font-quickSand flex flex-col gap-y-4'
                onSubmit={form.handleSubmit(createNewProduct)}
            >
                <Card className='p-0'>
                    <Accordion
                        type='single'
                        collapsible
                        defaultValue='item-1'
                    >
                        <AccordionItem value='item-1'>
                            <AccordionTrigger
                                iconClassName='size-5'
                                onClick={() => {
                                    setIsPhotosAccordionOpen(prev => !prev);
                                }}
                                className={clsx('rounded-none hover:no-underline w-full p-0 flex items-center pr-4', isPhotosAccordionOpen && 'border-b-[1px] dark:border-b-zinc-700')}>
                                <h2 className='w-full text-lg p-4 font-semibold'>
                                    Add Product Photos
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent className='pt-4'>
                                {
                                    (action === 'view' && productData) ?
                                        <div className="w-full px-4 pb-4">
                                            <div className='relative min-h-64 border-2 rounded-md border-dashed dark:border-zinc-700 border-gray-300 grid grid-cols-3 gap-4 p-3'>
                                                {
                                                    productData.images.length > 0 ? productData.images.map((imgUrl, idx) => {
                                                        return (
                                                            <div className="flex rounded-md" key={idx}>
                                                                <img
                                                                    src={imgUrl}
                                                                    width={100}
                                                                    height={100}
                                                                    alt={productData.name}
                                                                    className="w-full rounded-sm object-cover"
                                                                    crossOrigin="anonymous"
                                                                />
                                                            </div>
                                                        )
                                                    }) : (
                                                        <div className="w-full col-span-3 flex justify-center items-center">
                                                            <p>No images uploaded</p>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        : (
                                            <FieldGroup>
                                                <Controller
                                                    name='images'
                                                    control={form.control}
                                                    render={({ field, fieldState }) => {
                                                        return (
                                                            <div className='w-full px-4 pb-4 '>
                                                                <div className='relative min-h-64 border-2 rounded-md border-dashed dark:border-zinc-700 border-gray-300'>
                                                                    <Input
                                                                        accept="image/png, image/jpeg, image/jpg, image/gif"
                                                                        type='file'
                                                                        multiple
                                                                        ref={field.ref}
                                                                        onChange={(e) => {
                                                                            const files = Array.from(e.target.files ?? []);
                                                                            field.onChange(files);
                                                                            e.target.value = "";
                                                                        }}
                                                                        className={clsx('min-h-64 absolute z-[3] top-0 left-0 w-full opacity-0', fieldState.invalid && 'border-2 border-dashed border-red-700')}
                                                                    />

                                                                    {
                                                                        field.value.length > 0 ? (
                                                                            <div className='grid grid-cols-3 p-4 place-items-center gap-4'>
                                                                                {
                                                                                    field.value.map((file, idx) => {
                                                                                        if (file instanceof File) {
                                                                                            const sizeInMB = ((file.size / 1024) / 1024).toFixed(2);
                                                                                            return (
                                                                                                <div
                                                                                                    key={idx}
                                                                                                    className='p-2 rounded-md h-32 w-32 bg-neutral-100 dark:bg-zinc-700 text-gray-800 flex flex-col dark:text-gray-50 justify-center items-center gap-y-3 relative gap-x-4'
                                                                                                >
                                                                                                    <p className='text-sm text-center'>{file.name}</p>
                                                                                                    <p>{sizeInMB}MB</p>

                                                                                                    <div
                                                                                                        className='absolute -top-1 -right-2 h-5 w-5 rounded-full bg-orange-400 flex justify-center items-center text-white cursor-pointer z-10'
                                                                                                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                                                                                                            const restFiles = field.value.filter((file, index) => {
                                                                                                                return idx !== index;
                                                                                                            });

                                                                                                            if (restFiles[0] instanceof File) {
                                                                                                                form.setValue('images', restFiles as File[])
                                                                                                            }

                                                                                                            if (restFiles.length === 0) {
                                                                                                                form.setValue('images', [])
                                                                                                            }

                                                                                                        }}
                                                                                                    >
                                                                                                        <X size={12} />
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        ) : (
                                                                            <div className='z-[2] absolute top-0 left-0 w-full min-h-64 flex justify-center items-center gap-y-4 flex-col p-4 text-center'>
                                                                                <div>
                                                                                    <CloudUpload size={60} />
                                                                                </div>
                                                                                <div className='space-y-4'>
                                                                                    <h2 className='font-semibold text-2xl'>
                                                                                        <span>Drop your images here, or </span>
                                                                                        <span className='text-orange-400'>click to browse</span>
                                                                                    </h2>

                                                                                    <p className='font-notoSans'>
                                                                                        1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    }}
                                                />
                                            </FieldGroup>
                                        )
                                }
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Card>

                <Card className={clsx('p-0 overflow-x-hidden gap-0',)}>
                    <Accordion
                        type='single'
                        collapsible
                        defaultValue='item-1'
                    >
                        <AccordionItem value='item-1'>
                            <AccordionTrigger
                                onClick={() => setIsInfoAccordionOpen(prev => !prev)}
                                iconClassName='size-5'
                                className={clsx('flex items-center rounded-none  p-4 hover:no-underline', isInfoAccordionOpen && 'border-b-[1px] dark:border-b-zinc-700')}
                            >
                                <h2 className='text-lg font-semibold flex justify-between items-center'>
                                    Product Information
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                {/* product name and stock */}
                                <FieldGroup className="grid grid-cols-2 gap-0">
                                    {/* product name */}
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <div className="flex flex-col min-w-0">
                                                    <Field className="font-quickSand p-4 min-w-0 overflow-hidden">
                                                        <FieldLabel htmlFor="form-name">Product Name</FieldLabel>

                                                        <Input
                                                            {...field}
                                                            id="form-name"
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder="Enter product name"
                                                            autoComplete="off"
                                                            className="text-xs font-semibold w-full max-w-full min-w-0 overflow-hidden"
                                                            disabled={action === 'view'}
                                                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                                form.setValue('name', event.target.value);
                                                            }}
                                                        />

                                                        {/* {fieldState.isTouched && ( */}
                                                        <InputGroupAddon
                                                            align="inline-end"
                                                            className={clsx(
                                                                "flex justify-start",
                                                                fieldState.invalid ? "text-red-400" : "text-green-500"
                                                            )}
                                                        >
                                                            {fieldState.invalid && <CircleX />}
                                                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                        </InputGroupAddon>
                                                        {/* )} */}
                                                    </Field>
                                                </div>
                                            );
                                        }}
                                    />

                                    {/* stock */}
                                    <Controller
                                        name='stock'
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <div>
                                                    <Field className='font-quickSand p-4'>
                                                        <FieldLabel htmlFor='form-stock'>Stock</FieldLabel>
                                                        <Input
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? 0 : +e.target.value;
                                                                field.onChange(value);
                                                                form.setValue('stock', value);
                                                            }}
                                                            onBlur={field.onBlur}
                                                            value={field.value ?? ''}
                                                            type='number'
                                                            id='form-stock'
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder='Enter Stock'
                                                            autoComplete='off'
                                                            disabled={action === 'view'}
                                                        />
                                                        {/* {fieldState.isTouched && ( */}
                                                        <InputGroupAddon
                                                            align="inline-end"
                                                            className={clsx(
                                                                "flex justify-start",
                                                                fieldState.invalid ? "text-red-400" : "text-green-500"
                                                            )}
                                                        >
                                                            {fieldState.invalid && <CircleX />}
                                                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                        </InputGroupAddon>
                                                        {/* )} */}
                                                    </Field>
                                                </div>
                                            )
                                        }}
                                    />

                                </FieldGroup>

                                {/* category */}
                                <FieldGroup className='font-quickSand p-4 min-w-0 overflow-hidden'>
                                    <div
                                        className='flex flex-col'
                                    >
                                        <FieldLabel htmlFor='type'>
                                            Category
                                        </FieldLabel>
                                        <Controller
                                            control={form.control}
                                            name='category'
                                            render={({ field, fieldState }) => {
                                                return (
                                                    <div>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                const selection = [];
                                                                selection.push(value);
                                                                form.setValue('category', selection);
                                                            }}
                                                            value={form.watch('category')[0]}
                                                            disabled={action === 'view'}
                                                        >
                                                            <SelectTrigger
                                                                className={clsx('py-2 rounded-md text-start px-2 mt-2 w-full', (field.value.length === 0 && (fieldState.isTouched || form.formState.isSubmitted)) ? 'border border-red-500 dark:border-red-500' : "border border-neutral-200 dark:border-zinc-700")}
                                                                id='type'
                                                            >
                                                                <SelectValue placeholder="Choose a category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    ((data?.data?.data || []) as FetchedCategory[]).map(category => (
                                                                        <SelectItem
                                                                            key={category._id}
                                                                            value={category._id}
                                                                        >
                                                                            {category.name}
                                                                        </SelectItem>
                                                                    ))
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                        {
                                                            field.value.length === 0 && (
                                                                <div className="flex gap-x-2 items-center text-red-400 mt-4">
                                                                    {fieldState.invalid && <CircleX size={16} />}
                                                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }}
                                        />
                                    </div>
                                </FieldGroup>

                                {/* options */}
                                <FieldGroup>
                                    <Controller
                                        control={form.control}
                                        name="options"
                                        render={({ field, fieldState }) => {
                                            const addOption = () => {
                                                if (!inputValue.trim()) return;

                                                const updated = [
                                                    ...(field.value ?? []),
                                                    { name: inputValue.trim(), values: [] },
                                                ];

                                                form.setValue("options", updated, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });

                                                setInputValue("");
                                            };

                                            return (
                                                <div className="p-4 space-y-4">
                                                    <Accordion
                                                        type='single'
                                                        collapsible
                                                        className='w-full'
                                                        defaultValue='item-1'
                                                    >
                                                        <AccordionItem value='item-1'>
                                                            <FieldLabel
                                                                htmlFor='form-option'
                                                                className="mb-2"
                                                            >
                                                                <AccordionTrigger>
                                                                    Options
                                                                </AccordionTrigger>
                                                            </FieldLabel>
                                                            <AccordionContent>
                                                                {/* Add Option Input */}
                                                                <InputGroup>
                                                                    <InputGroupInput
                                                                        placeholder="Add an option (e.g. Size, Color)"
                                                                        value={inputValue}
                                                                        onChange={(e) => setInputValue(e.target.value)}
                                                                        id='form-option'
                                                                        disabled={action === 'view'}
                                                                    />
                                                                    <InputGroupAddon align="inline-end">
                                                                        <InputGroupButton disabled={action === 'view'} variant="secondary" onClick={addOption}>
                                                                            Add
                                                                        </InputGroupButton>
                                                                    </InputGroupAddon>
                                                                </InputGroup>

                                                                {field.value?.map((option, index) => {
                                                                    return (
                                                                        <OptionField
                                                                            field={field}
                                                                            form={form}
                                                                            index={index}
                                                                            option={option}
                                                                            key={index}
                                                                            disabled={action === "view"}
                                                                        />
                                                                    )
                                                                })}

                                                                {/* Show validation errors */}
                                                                {fieldState.error && (
                                                                    <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                                                                )}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                </div>
                                            );
                                        }}
                                    />
                                </FieldGroup>

                                {/* description */}
                                <FieldGroup>
                                    <Controller
                                        control={form.control}
                                        name='description'
                                        render={({ field, fieldState }) => {
                                            return (
                                                <div className="grid w-full gap-3 p-4">
                                                    <Label htmlFor="message">Description</Label>
                                                    <Textarea
                                                        {...field}
                                                        placeholder={`Product description for ${form.watch('name')}`}
                                                        id="message"
                                                        aria-invalid={fieldState.invalid}
                                                        className={clsx('text-xs font-medium', fieldState.invalid && 'border border-red-500')}
                                                        disabled={action === 'view'}
                                                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                                                            form.setValue('description', event.target.value);
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    />
                                </FieldGroup>

                                {/* metaFields */}
                                <FieldGroup>
                                    <Controller
                                        control={form.control}
                                        name='metaFields'
                                        render={({ field, fieldState }) => {
                                            return (
                                                <div className='p-4'>
                                                    <div className='flex justify-between'>
                                                        <FieldLabel htmlFor='form-metaFields'>Additional Data</FieldLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    type='button'
                                                                    disabled={action === 'view'}
                                                                    onClick={() => {
                                                                        const metaFields = form.watch('metaFields');
                                                                        if (metaFields.length === 0) {
                                                                            form.setValue('metaFields', [
                                                                                {
                                                                                    key: '',
                                                                                    namespace: '',
                                                                                    type: 'string',
                                                                                    value: ''
                                                                                }
                                                                            ])
                                                                        } else {
                                                                            form.setValue('metaFields', [
                                                                                ...metaFields,
                                                                                {
                                                                                    key: '',
                                                                                    namespace: '',
                                                                                    type: 'string',
                                                                                    value: ''
                                                                                }
                                                                            ])
                                                                        }
                                                                    }}
                                                                >
                                                                    <Plus size={6} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Add more data about your product</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>

                                                    <div className='my-4 space-y-4'>
                                                        {
                                                            form.watch('metaFields').map((metaField, idx) => {
                                                                return (
                                                                    <MetaField
                                                                        fieldState={fieldState}
                                                                        form={form}
                                                                        idx={idx}
                                                                        metaField={metaField}
                                                                        key={idx}
                                                                        disabled={action === 'view'}
                                                                    // field={field}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    />
                                </FieldGroup>

                                {/* variants */}
                                <FieldGroup>
                                    <Controller
                                        name='variants'
                                        control={form.control}
                                        render={({ field, fieldState }) => {

                                            return (
                                                <div className='p-4'>
                                                    <div className='flex justify-between'>
                                                        <FieldLabel>Variants</FieldLabel>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    disabled={action === 'view'}
                                                                    size="icon"
                                                                    variant="outline"
                                                                    type='button'
                                                                    onClick={() => {
                                                                        const variants = form.watch('variants');
                                                                        if (variants.length === 0) {
                                                                            form.setValue('variants', [{
                                                                                options: [],
                                                                                price: 0,
                                                                                sku: '',
                                                                                stock: 0
                                                                            }])
                                                                        } else {
                                                                            form.setValue('variants', [
                                                                                ...variants,
                                                                                {
                                                                                    options: [],
                                                                                    price: 0,
                                                                                    sku: '',
                                                                                    stock: 0
                                                                                }
                                                                            ])
                                                                        }
                                                                    }}
                                                                >
                                                                    <Plus size={6} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Add variants of your product</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>

                                                    <div>
                                                        {
                                                            field.value.map((variant, varIndex) => {
                                                                return (
                                                                    <VariantField
                                                                        form={form}
                                                                        varIndex={varIndex}
                                                                        variant={variant}
                                                                        key={varIndex}
                                                                        field={field}
                                                                        fieldState={fieldState}
                                                                        disabled={action === 'view'}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    />
                                </FieldGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Card>

                <Card className='p-0 gap-0'>
                    <Accordion
                        type='single'
                        defaultValue='item-1'
                        collapsible
                    >
                        <AccordionItem value='item-1'>
                            <AccordionTrigger
                                onClick={() => setIsPriceInfoAccordionOpen(prev => !prev)}
                                iconClassName='size-5'
                                className={clsx('flex items-center rounded-none  p-4 hover:no-underline', isPriceInfoAccordionOpen && 'border-b-[1px] dark:border-b-zinc-700')}
                            >
                                <h2 className='text-lg font-semibold'>
                                    Pricing Details
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent>
                                {/* product price and discount */}
                                <FieldGroup className='grid grid-cols-2 gap-0'>
                                    {/* price */}
                                    <Controller
                                        name='price'
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <div>
                                                    <Field className='font-quickSand p-4'>
                                                        <FieldLabel htmlFor='form-price'>Price</FieldLabel>
                                                        <Input
                                                            disabled={action === 'view'}
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? 0 : +e.target.value;
                                                                field.onChange(value);
                                                                form.setValue('price', value);
                                                            }}
                                                            onBlur={field.onBlur}
                                                            value={field.value ?? ''}
                                                            type='number'
                                                            id='form-price'
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder='Enter product price'
                                                            autoComplete='off'
                                                        />
                                                        {fieldState.isTouched && (
                                                            <InputGroupAddon
                                                                align="inline-end"
                                                                className={clsx(
                                                                    "flex justify-start",
                                                                    fieldState.invalid ? "text-red-400" : "text-green-500"
                                                                )}
                                                            >
                                                                {fieldState.invalid && <CircleX />}
                                                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                            </InputGroupAddon>
                                                        )}
                                                    </Field>
                                                </div>
                                            )
                                        }}
                                    />

                                    {/* discount */}
                                    <Controller
                                        name='discount'
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <div>
                                                    <Field className='font-quickSand p-4'>
                                                        <FieldLabel htmlFor='form-discount'>Discount</FieldLabel>
                                                        <Input
                                                            disabled={action === 'view'}
                                                            onChange={(e) => {
                                                                const value = e.target.value === '' ? 0 : +e.target.value;
                                                                field.onChange(value);
                                                                form.setValue('discount', value);
                                                            }}
                                                            value={field.value ?? ''}
                                                            type='number'
                                                            id='form-discount'
                                                            aria-invalid={fieldState.invalid}
                                                            placeholder='Enter product discount'
                                                            autoComplete='off'
                                                            onBlur={field.onBlur}
                                                        />
                                                        {fieldState.isTouched && (
                                                            <InputGroupAddon
                                                                align="inline-end"
                                                                className={clsx(
                                                                    "flex justify-start",
                                                                    fieldState.invalid ? "text-red-400" : "text-green-500"
                                                                )}
                                                            >
                                                                {fieldState.invalid && <CircleX />}
                                                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                            </InputGroupAddon>
                                                        )}
                                                    </Field>
                                                </div>
                                            )
                                        }}
                                    />
                                </FieldGroup>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Card>

                {
                    action !== 'view' && (
                        <Button type='submit' variant="secondary" className='cursor-pointer'>
                            {
                                selectedProductStatus === 'draft' ? "Save Draft" : "Create Product"
                            }
                        </Button>
                    )
                }

            </form>
        </div>
    )
}