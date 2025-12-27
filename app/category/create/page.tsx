'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryForm from '../category-form';

function CategoryPage() {
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
            <CategoryForm action='add' />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CategoryPage