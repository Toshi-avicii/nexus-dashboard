'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroupAddon } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { createCategory } from '@/helpers/category.helpers';
import { NewCategory } from '@/types/category.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { CircleX } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod'

const categorySchema = z.object({
  name: z.string().min(2, { error: "Category name must be 2 characters long" }).max(30, { error: "Category name cannot be longer than 30 characters" }),
  description: z.string().max(500, { error: "Description cannot be longer than 500 characters" }).min(5, { error: "Description must be at least 5 characters long" })
});

function CategoryPage() {
  const [formData, setFormData] = useState<NewCategory>({
    name: '',
    description: ''
  });

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: formData,
    mode: "all"
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onMutate() {
      toast.loading('Creating...', { id: 'loading-toast' });
    },
    onSuccess: async (data) => {
      if (data) {
        toast.dismiss("loading-toast");
        toast.success("Category successfully created")
      }
    },
    onError: (err) => {
      toast.dismiss('loading-toast');
      toast.error(err.message);
    }
  })

  const handleSubmit = async (data: z.infer<typeof categorySchema>) => {
    setFormData({
      description: '',
      name: ''
    })
    createCategoryMutation.mutate(data);
  }

  return (
    <div className='p-4'>
      <Breadcrumb className="font-quickSand">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" linkTag>Category</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/category/create" linkTag>Create</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='py-4 flex justify-center items-center'>
        <Card className='w-full max-w-sm'>
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <Button type="submit" className="w-full cursor-pointer">
                    Create
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CategoryPage