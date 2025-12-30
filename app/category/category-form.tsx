import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroupAddon } from '@/components/ui/input-group'
import { createCategory, updateCategoryById } from '@/helpers/category.helpers'
import { NewCategory } from '@/types/category.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { CircleX } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const categorySchema = z.object({
    name: z.string().min(2, { error: "Category name must be 2 characters long" }).max(30, { error: "Category name cannot be longer than 30 characters" }),
    description: z.string().max(500, { error: "Description cannot be longer than 500 characters" }).min(5, { error: "Description must be at least 5 characters long" })
});

type FormType = "add" | "edit";
type ExistingCategory = NewCategory & { id: string }

function CategoryForm({ action, category }: { action: FormType, category?: ExistingCategory }) {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: (action === 'edit' && category) ? category.name : '',
            description: (action === 'edit' && category) ? category.description : ''
        },
        mode: "all"
    });

    const createCategoryMutation = useMutation({
        mutationFn: createCategory,
        onMutate() {
            toast.loading('Creating...', { id: 'loading-toast' });
        },
        onSuccess: async (data) => {
            if (data) {
                queryClient.invalidateQueries({
                    queryKey: ["'get-category-list"]
                })
                toast.dismiss("loading-toast");
                toast.success("Category successfully created");
                form.setValue("name", '');
                form.setValue("description", "");
            }
        },
        onError: (err) => {
            toast.dismiss('loading-toast');
            toast.error(err.message);
        }
    });

    const updateCategoryMutation = useMutation({
        mutationFn: (data: NewCategory) => updateCategoryById(
            (category?.id ?? ''), data
        ),
        onMutate() {
            toast.loading('Updating...', { id: 'loading-toast' });
        },
        onSuccess: async (data) => {
            if (data) {
                toast.dismiss("loading-toast");
                toast.success("Category successfully updated");
                queryClient.invalidateQueries({
                    queryKey: ['category', category?.id],
                });

                queryClient.invalidateQueries({
                    queryKey: ['get-category-list'],
                });

                // dispatch a custom event
                window.dispatchEvent(new CustomEvent("category:update:success"));
            }
        },
        onError: (err) => {
            toast.dismiss('loading-toast');
            toast.error(err.message);
        }
    })

    const handleSubmit = async (data: z.infer<typeof categorySchema>) => {
        if (action === 'edit' && category) {
            updateCategoryMutation.mutate(data)
        } else {
            createCategoryMutation.mutate(data);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-6">
                {/* name */}
                <Controller
                    control={form.control}
                    name='name'
                    render={({ field, fieldState }) => {
                        return (
                            <div className="grid gap-2">
                                <Field>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        type="text"
                                        placeholder="Category name"
                                    />
                                </Field>
                                {
                                    fieldState.invalid && (
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
                                    )
                                }
                            </div>
                        )
                    }}
                />

                {/* description */}
                <Controller
                    control={form.control}
                    name='description'
                    render={({ field, fieldState }) => {
                        return (
                            <div className="grid gap-2">
                                <Field>
                                    <FieldLabel htmlFor="description">Description</FieldLabel>
                                    <Input
                                        {...field}
                                        id="name"
                                        type="text"
                                        placeholder="Category Description"
                                    // required
                                    />
                                </Field>
                                {
                                    fieldState.invalid && (
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
                                    )
                                }
                            </div>
                        )
                    }}
                />
                <div className=''>
                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={
                            action === 'add' ? createCategoryMutation.isPending : updateCategoryMutation.isPending
                        }
                    >
                        Update
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default CategoryForm