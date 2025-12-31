'use client';

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { useState } from "react";
import { Controller, ControllerFieldState, ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { CircleX, Info, Plus, X } from "lucide-react";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { newProductFormSchema } from "@/components/NewProductForm";

type Option = {
    name: string;
    values: string[];
}

type MetaFieldObject = {
    namespace: string;
    key: string;
    value: string | number | boolean | any[] | Record<string, unknown>;
    type: string;
}

type Variant = {
    sku: string;
    price: number;
    stock: number;
    options: Record<string, string>[];
}

export function OptionField({ option, index, form, field, disabled }: {
    option: Option,
    index: number,
    form: UseFormReturn<z.infer<typeof newProductFormSchema>>,
    field: ControllerRenderProps<z.infer<typeof newProductFormSchema>>,
    disabled?: boolean
}) {
    const [valueInputs, setValueInputs] = useState<Record<number, string>>({});
    const addValueToOption = (index: number) => {
        const valueToAdd = valueInputs[index]?.trim();
        if (!valueToAdd) return;

        const updated = [...field.value];
        if (updated[index].values.includes(valueToAdd)) {
            toast.error(`Option is already added`, {
                description: `${valueToAdd} is being already added to ${updated[index].name} option`,
            })

            return;
        }
        updated[index].values.push(valueToAdd);

        form.setValue("options", updated, {
            shouldValidate: true,
            shouldDirty: true,
        });

        setValueInputs((prev) => ({ ...prev, [index]: "" }));
    };

    const deleteValue = (optionIndex: number, valueIndex: number) => {
        const updated = [...field.value];
        updated[optionIndex].values.splice(valueIndex, 1);

        form.setValue("options", updated, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <div className="border rounded p-3 space-y-3 my-3">
            <div className="flex items-center justify-between">
                <span className="font-medium">{option.name}</span>

                {/* Delete entire option */}
                <button
                    className="text-red-500 text-xs"
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                        const updated = field.value.filter((_: Option, i: number) => i !== index);
                        form.setValue("options", updated, {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                    }}
                >
                    ✕ Remove option
                </button>
            </div>

            {/* Value input for this option */}
            <Controller
                name="options"
                control={form.control}
                render={({ field }) => {
                    return (
                        <>
                            <InputGroup className={clsx(option.values.length === 0 && 'border border-red-400')}>
                                <InputGroupInput
                                    placeholder={`Add value for ${option.name}`}
                                    value={valueInputs[index] || ""}
                                    onChange={(e) =>
                                        setValueInputs((prev) => ({
                                            ...prev,
                                            [index]: e.target.value,
                                        }))
                                    }
                                    disabled={disabled}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        variant="default"
                                        disabled={disabled}
                                        onClick={() => addValueToOption(index)}
                                    >
                                        Add Value
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            {
                                field.value.map((option, index) => {
                                    if (option.values.length === 0) {
                                        return (
                                            <div key={index} className="flex gap-x-2 items-center text-sm text-red-400">
                                                <CircleX size={16} />
                                                <p className="text-sm text-red-400">
                                                    {option.name} is empty
                                                </p>
                                            </div>
                                        )
                                    }

                                })
                            }
                        </>
                    )
                }}
            />

            {/* Display added values */}
            <div className="flex flex-wrap gap-2">
                {option.values.map((v, valueIndex) => (
                    <div
                        key={valueIndex}
                        className="bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                        {v}
                        <button
                            className="text-red-500 text-xs"
                            type="button"
                            onClick={() => deleteValue(index, valueIndex)}
                            disabled={disabled}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function MetaField({
    idx,
    form,
    metaField,
    fieldState,
    disabled
    // field
}: {
    form: UseFormReturn<z.infer<typeof newProductFormSchema>>,
    idx: number,
    metaField: MetaFieldObject,
    fieldState: ControllerFieldState,
    disabled?: boolean
    // field: ControllerRenderProps<z.infer<typeof newProductFormSchema>>
}) {
    const { key, namespace, type, value } = metaField;
    return (
        <Controller
            name="metaFields"
            control={form.control}
            render={({ field, fieldState }) => {
                return (
                    <div
                        key={idx}
                        className='grid grid-cols-2 gap-4 border border-neutral-200 dark:border-zinc-700 p-4 rounded-md relative'
                    > 
                        {
                            !disabled && (
                                <div
                                    className='absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 flex justify-center items-center cursor-pointer'
                                    onClick={() => {
                                        const updated = form.watch('metaFields').filter((item, index) => index !== idx);
                                        form.setValue('metaFields', updated);
                                    }}
                                    
                                >
                                    <X size={10} />
                                </div>
                            ) 
                        }
                        {/* namespace */}
                        <div>
                            <FieldLabel
                                className='mb-2'
                                htmlFor='namespace'
                            >
                                Namespace
                            </FieldLabel>
                            <Input
                                placeholder='What would be the name of the feature...'
                                id='namespace'
                                disabled={disabled}
                                value={namespace}
                                onChange={(e) => {
                                    const updated = form.watch('metaFields').map((metaField, index) => {
                                        if (index === idx) {
                                            metaField.namespace = e.target.value;
                                        }
                                        return metaField
                                    });

                                    form.setValue('metaFields', updated);
                                }}
                                className={clsx(namespace.length === 0 && 'border border-red-400')}
                            />
                        </div>

                        {/* key */}
                        <div>
                            <FieldLabel htmlFor='key' className='mb-2'>Key</FieldLabel>
                            <Input
                                placeholder='Add the feature name...'
                                disabled={disabled}
                                value={key}
                                id='key'
                                className={clsx(key.length === 0 && 'border border-red-400')}
                                onChange={(e) => {
                                    const updated = form.watch('metaFields').map((metaField, index) => {
                                        if (index === idx) {
                                            metaField.key = e.target.value;
                                        }
                                        return metaField
                                    });

                                    form.setValue('metaFields', updated);
                                }}
                            />
                        </div>

                        {/* type */}
                        <div
                            className='flex flex-col'
                        >
                            <FieldLabel htmlFor='type'>
                                Type
                            </FieldLabel>
                            <Select
                                value={type}
                                disabled={disabled}
                                onValueChange={(value) => {
                                    const updated = form.watch('metaFields').map((metaField, index) => {
                                        if (index === idx) {
                                            metaField.type = value;
                                            if (value === 'string') {
                                                metaField.value = '';
                                            } else if (value === 'number') {
                                                metaField.value = 0;
                                            } else if (value === "boolean") {
                                                metaField.value = true;
                                            } else if (value === 'array') {
                                                metaField.value = [];
                                            }
                                        }
                                        return metaField
                                    });

                                    form.setValue('metaFields', updated);
                                }}
                            >
                                <SelectTrigger
                                    className='border border-neutral-200 dark:border-zinc-700 py-2 rounded-md text-start px-2 mt-2 w-full'
                                    id='type'
                                >
                                    <SelectValue placeholder="type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='string'>String</SelectItem>
                                    <SelectItem value='number'>Number</SelectItem>
                                    <SelectItem value='boolean'>Boolean</SelectItem>
                                    <SelectItem value='array'>Array</SelectItem>
                                    <SelectItem value='object'>Object</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* value */}
                        <div className='p-0'>

                            {
                                (type === "string") && (
                                    <div className='h-full'>
                                        <FieldLabel htmlFor='string'>
                                            Value
                                        </FieldLabel>
                                        <Input
                                            disabled={disabled}
                                            className={clsx('mt-2', value.toString().length === 0 && "border border-red-400")}
                                            placeholder='Add the feature value'
                                            id='string'
                                            value={value.toString()}
                                            onChange={(e) => {
                                                const updated = form.watch('metaFields').map((metaField, index) => {
                                                    if (index === idx) {
                                                        metaField.value = e.target.value;
                                                    }
                                                    return metaField
                                                });

                                                form.setValue('metaFields', updated);
                                            }}
                                        />
                                    </div>
                                )
                            }
                            {
                                (type === "number") && (
                                    <div>
                                        <FieldLabel htmlFor='number'>
                                            Value
                                        </FieldLabel>
                                        <Input
                                            disabled={disabled}
                                            type='number'
                                            className={clsx('mt-2', +value <= 0 && "border border-red-400")}
                                            placeholder='Add the feature value'
                                            id='number'
                                            value={+value.toString()}
                                            onChange={(e) => {
                                                const updated = form.watch('metaFields').map((metaField, index) => {
                                                    if (index === idx) {
                                                        metaField.value = +e.target.value;
                                                    }
                                                    return metaField
                                                });

                                                form.setValue('metaFields', updated);
                                            }}
                                        />
                                    </div>
                                )
                            }
                            {
                                (type === "array") && (
                                    <div className="">
                                        <FieldLabel htmlFor='array'>Value</FieldLabel>
                                        <Textarea
                                            placeholder="Add values by commas separated values (e.g. value1, value2, ...)"
                                            id="array"
                                            disabled={disabled}
                                            aria-invalid={fieldState.invalid}
                                            className={clsx('h-full mt-2', fieldState.invalid && 'border border-red-500')}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const arr = value.split(',');
                                                const arr2 = arr.map(item => {
                                                    if (item[0] === ' ') {
                                                        return item.trimStart();
                                                    }
                                                    return item;
                                                }).filter(item => {
                                                    return item.trim().length > 0;
                                                });

                                                const updated = form.watch('metaFields').map((metaField, index) => {
                                                    if (index === idx) {
                                                        metaField.value = arr2;
                                                    }
                                                    return metaField;
                                                });

                                                form.setValue('metaFields', updated);
                                            }}
                                        />
                                    </div>
                                )
                            }
                            {
                                (type === "boolean") && (
                                    <>
                                        <FieldLabel htmlFor='boolean'>
                                            Value
                                        </FieldLabel>
                                        <Select
                                            disabled={disabled}
                                            onValueChange={(val) => {
                                                const updated = form.watch('metaFields').map((metaField, index) => {
                                                    if (val === 'true') {
                                                        if (idx === index) {
                                                            metaField.value = true;
                                                        }
                                                    } else {
                                                        if (idx === index) {
                                                            metaField.value = false;
                                                        }
                                                    }
                                                    return metaField;
                                                })

                                                form.setValue('metaFields', updated);
                                            }}
                                        >
                                            <SelectTrigger
                                                id='boolean'
                                                className={clsx('border w-full py-2 rounded-md text-start px-2 mt-2', (value !== false && value !== true) ? 'border-red-400' : 'border-neutral-200 dark:border-zinc-700')}
                                            >
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='true'>True</SelectItem>
                                                <SelectItem value='false'>
                                                    False
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </>
                                )
                            }

                            {
                                (type === "object") && (
                                    <div className='flex gap-x-2'>
                                        {/* dynamic key input */}
                                        <div className='flex flex-1 flex-col gap-y-2'>
                                            <FieldLabel htmlFor='key'>
                                                Key
                                            </FieldLabel>
                                            <Input
                                                disabled={disabled}
                                                placeholder='Key'
                                                value={typeof value === "object" ? Object.keys(value)[0] : ""}
                                                className={clsx((typeof value === "object" && Object.keys(value)[0] === "" && 'border border-red-400'))}
                                                onChange={(e) => {
                                                    const updated = form.watch('metaFields').map((metaField, index) => {
                                                        if (index === idx) {
                                                            const oldValue = metaField.value;
                                                            const newKey = e.target.value;

                                                            if (typeof oldValue === "object" && oldValue !== null && !Array.isArray(oldValue)) {
                                                                const oldKey = Object.keys(oldValue)[0];

                                                                const val = oldValue[oldKey] ?? "";
                                                                metaField.value = { [newKey]: val };
                                                            } else {
                                                                metaField.value = { [newKey]: "" };
                                                            }
                                                        }
                                                        return metaField;
                                                    });

                                                    form.setValue('metaFields', updated);
                                                }}
                                            />
                                        </div>
                                        <div className='flex flex-1 flex-col gap-y-2'>
                                            <FieldLabel htmlFor='value'>
                                                Value
                                            </FieldLabel>
                                            {/* dynamic value input */}
                                            <Input
                                                disabled={disabled}
                                                placeholder='Value'
                                                value={typeof value === "object" ? Object.values(value)[0]?.toString() : ""}
                                                className={clsx((typeof value === "object" && Object.values(value)[0] === "" && 'border border-red-400'))}
                                                onChange={(e) => {
                                                    const updated = form.watch('metaFields').map((metaField, index) => {
                                                        if (index === idx) {
                                                            if (typeof metaField.value === "object" && metaField.value !== null) {
                                                                const key = Object.keys(metaField.value)[0];
                                                                metaField.value = { [key]: e.target.value };
                                                            }
                                                        }
                                                        return metaField;
                                                    });

                                                    form.setValue('metaFields', updated);
                                                }}
                                            />

                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                )
            }}
        />
    )
}

export function VariantField({
    varIndex,
    form,
    variant,
    field,
    fieldState,
    disabled
}: {
    varIndex: number,
    form: UseFormReturn<z.infer<typeof newProductFormSchema>>,
    variant: Variant,
    field: ControllerRenderProps<z.infer<typeof newProductFormSchema>>,
    fieldState: ControllerFieldState,
    disabled?: boolean
}) {
    const { options, price, sku, stock } = variant;

    return (
        <Controller
            name="variants"
            control={form.control}
            render={() => {
                return (
                    <div
                        key={varIndex}
                        className='p-4 border border-neutral-100 dark:border-zinc-700 rounded-md mt-4 grid grid-cols-3 gap-4 relative'
                    >
                        {
                            !disabled && (
                                <div
                                    className='absolute -top-1 -right-2 flex justify-center items-center rounded-full w-4 h-4 bg-red-500 cursor-pointer'
                                    onClick={(e) => {
                                        const updated = form.watch('variants').filter((v, vIndex) => {
                                            return vIndex !== varIndex;
                                        });

                                        form.setValue('variants', updated);
                                    }}
                                >
                                    <X size={10} />
                                </div>
                            )
                        }

                        {/* sku */}
                        <div className='flex flex-col gap-y-2'>
                            <FieldLabel htmlFor='sku'>
                                <span>SKU</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info size={14} />
                                    </TooltipTrigger>
                                    <TooltipContent>SKU means the name of the variant</TooltipContent>
                                </Tooltip>
                            </FieldLabel>
                            <Input
                                disabled={disabled}
                                placeholder='Enter SKU of the variant'
                                id='sku'
                                value={sku}
                                className={clsx(sku.trim().length === 0 && 'border border-red-400')}
                                onChange={(e) => {
                                    const updated = form.watch('variants').map((variant, index) => {
                                        if (index === varIndex) {
                                            variant.sku = e.target.value;
                                        }
                                        return variant
                                    });

                                    form.setValue('variants', updated);
                                }}
                            />
                            {
                                sku.trim().length === 0 && (
                                    <div className="flex gap-x-2 items-center text-sm text-red-400">
                                        <CircleX size={16} />
                                        <p className="text-sm text-red-400">
                                            SKU is empty
                                        </p>
                                    </div>
                                )
                            }
                        </div>

                        {/* price */}
                        <div className='flex flex-col gap-y-2'>
                            <FieldLabel htmlFor='price'>
                                Price
                            </FieldLabel>
                            <Input
                                disabled={disabled}
                                type='number'
                                placeholder='Enter price of the variant'
                                id='price'
                                value={price}
                                className={clsx(price <= 0 && 'border border-red-400')}
                                onChange={(e) => {
                                    const updated = form.watch('variants').map((variant, index) => {
                                        if (index === varIndex) {
                                            variant.price = +e.target.value;
                                        }
                                        return variant
                                    });

                                    form.setValue('variants', updated);
                                }}
                            />
                            {
                                price <= 0 && (
                                    <div className="flex gap-x-2 items-center text-sm text-red-400">
                                        <CircleX size={16} />
                                        <p className="text-sm text-red-400">
                                            Price must be greater than 1
                                        </p>
                                    </div>
                                )
                            }
                        </div>

                        {/* stock */}
                        <div className='flex flex-col gap-y-2'>
                            <FieldLabel htmlFor='stock'>
                                Stock
                            </FieldLabel>
                            <Input
                                disabled={disabled}
                                type='number'
                                placeholder='Enter stock of the variant'
                                id='stock'
                                className={clsx(stock <= 0 && 'border border-red-400')}
                                value={stock}
                                onChange={(e) => {
                                    const updated = form.watch('variants').map((variant, index) => {
                                        if (index === varIndex) {
                                            variant.stock = +e.target.value;
                                        }
                                        return variant
                                    });

                                    form.setValue('variants', updated);
                                }}
                            />
                            {
                                stock <= 0 && (
                                    <div className="flex gap-x-2 items-center text-sm text-red-400">
                                        <CircleX size={16} />
                                        <p className="text-sm text-red-400">
                                            Stock must be greater than 1
                                        </p>
                                    </div>
                                )
                            }
                        </div>

                        {/* options */}
                        <div className='flex flex-col gap-y-2 col-span-3'>
                            <div className='flex justify-between'>
                                <FieldLabel htmlFor='price'>
                                    Options
                                </FieldLabel>
                                <Button
                                    disabled={disabled}
                                    className='rounded-full p-0 h-8 w-8 cursor-pointer'
                                    variant="outline"
                                    type='button'
                                    onClick={(e) => {
                                        const variants = form.watch('variants');
                                        const updated = variants.map((variant, index) => {
                                            if (varIndex === index) {
                                                if (variant.options.length === 0) {
                                                    variant.options = [{
                                                        key: '',
                                                        value: ''
                                                    }]
                                                } else {
                                                    variant.options = [
                                                        ...variant.options,
                                                        {
                                                            key: '',
                                                            value: ''
                                                        }
                                                    ]
                                                }
                                            }
                                            return variant;
                                        });

                                        form.setValue('variants', updated);
                                    }}
                                >
                                    <Plus size={12} />
                                </Button>
                            </div>
                            <div className='flex flex-col gap-y-4'>
                                {
                                    options.map((option, optIndex) => {
                                        return (
                                            <div
                                                key={optIndex}
                                                className='flex gap-x-2 relative border border-neutral-200 dark:border-zinc-700 rounded-md p-4'>
                                                    {
                                                        !disabled && (
                                                            <div
                                                                className='absolute top-0 -right-0 flex justify-center items-center rounded-tr-md w-6 h-5 rounded-bl-md bg-red-500 cursor-pointer'
                                                                onClick={(e) => {
                                                                    const variants = form.watch("variants");
                                                                    const updated = variants.map((variant, index) => {
                                                                        if (index === varIndex) {
                                                                            const updatedOptions = variant.options.filter((opt, optIdx) => {
                                                                                return optIndex !== optIdx;
                                                                            });

                                                                            return {
                                                                                ...variant,
                                                                                options: updatedOptions
                                                                            }
                                                                        }
                                                                        return variant;
                                                                    });

                                                                    form.setValue('variants', updated);
                                                                }}
                                                            >
                                                                <X size={12} />
                                                            </div>
                                                        )
                                                    }
                                                {/* dynamic key input */}
                                                <div className='flex flex-1 flex-col gap-y-2'>
                                                    <FieldLabel htmlFor='key'>
                                                        Key
                                                    </FieldLabel>
                                                    <Input
                                                        disabled={disabled}
                                                        placeholder='Key'
                                                        value={typeof option === "object" ? Object.values(option)[0] : ""}
                                                        className={clsx(typeof option === "object" && Object.values(option)[0] === "" && 'border border-red-400')}
                                                        onChange={(e) => {
                                                            const variants = form.watch("variants");
                                                            const updated = variants.map((variant, index) => {
                                                                if (index === varIndex) {
                                                                    const updatedOptions = variant.options.map((opt, optIdx) => {
                                                                        if (optIndex === optIdx) {
                                                                            opt.key = e.target.value;
                                                                        }
                                                                        return opt;
                                                                    });

                                                                    return {
                                                                        ...variant,
                                                                        options: updatedOptions
                                                                    }
                                                                }
                                                                return variant;
                                                            })

                                                            form.setValue('variants', updated);

                                                        }}
                                                    />
                                                    {
                                                        typeof option === "object" && Object.values(option)[0].length === 0 && (
                                                            <div className="flex gap-x-2 items-center text-sm text-red-400">
                                                                <CircleX size={16} />
                                                                <p className="text-sm text-red-400">
                                                                    Key is empty
                                                                </p>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className='flex flex-1 flex-col gap-y-2'>
                                                    <FieldLabel htmlFor='value'>
                                                        Value
                                                    </FieldLabel>
                                                    {/* dynamic value input */}
                                                    <Input
                                                        disabled={disabled}
                                                        placeholder='Value'
                                                        value={typeof option === "object" ? Object.values(option)[1]?.toString() : ""}
                                                        className={clsx(typeof option === "object" && Object.values(option)[1] === "" && 'border border-red-400')}
                                                        onChange={(e) => {
                                                            const variants = form.watch("variants");
                                                            const updated = variants.map((variant, index) => {
                                                                if (index === varIndex) {
                                                                    const updatedOptions = variant.options.map((opt, optIdx) => {
                                                                        if (optIndex === optIdx) {
                                                                            opt.value = e.target.value;
                                                                        }
                                                                        return opt;
                                                                    });

                                                                    return {
                                                                        ...variant,
                                                                        options: updatedOptions
                                                                    }
                                                                }
                                                                return variant;
                                                            });

                                                            form.setValue('variants', updated);
                                                        }}
                                                    />

                                                    {
                                                        typeof option === "object" && Object.values(option)[1].length === 0 && (
                                                            <div className="flex gap-x-2 items-center text-sm text-red-400">
                                                                <CircleX size={16} />
                                                                <p className="text-sm text-red-400">
                                                                    Value is empty
                                                                </p>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </div>
                )
            }}
        />
    )
}