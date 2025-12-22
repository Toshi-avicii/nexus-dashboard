'use client';

import { DataTable } from '@/components/table/data-table'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { getCategories } from '@/helpers/category.helpers';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { columns } from './category-table-columns';

function CategoryListPage() {

  const categoryListQuery = useQuery({
    queryKey: ['get-category-list'],
    queryFn: async () => {
      const data = await getCategories();
      return data;
    },
  });


  return (
    <div className='p-4'>
      <Breadcrumb className="font-quickSand">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" linkTag>Category</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/category/list" linkTag>List</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='my-4'>
        <DataTable
          columns={columns}
          data={categoryListQuery.data?.data?.data || []}
        />
      </div>
    </div>
  )
}

export default CategoryListPage