'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { deleteBulkCategories, getCategories } from '@/helpers/category.helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { columns } from './category-table-columns';
import { DataTable } from '@/components/table/data-table';
import { toast } from 'sonner';
import { useDataTable } from '@/components/table/data-table-context';

function CategoryListPage() {
  const queryClient = useQueryClient();

  const categoryListQuery = useQuery({
    queryKey: ['get-category-list'],
    queryFn: async () => {
      const data = await getCategories();
      return data;
    },
  });

  const bulkCategoryDeleteMutation = useMutation({
    mutationFn: deleteBulkCategories,
    onMutate() {
      toast.loading('Sending...', { id: 'category-delete-toast' });
    },
    onSuccess(data) {
      if (data) {
        console.log({ data });
        toast.dismiss('category-delete-toast');
        toast.success(data.data.message);
        queryClient.invalidateQueries({ queryKey: ['get-category-list'] });
      }
    },
    onError(error) {
      toast.dismiss('category-delete-toast');
      toast.error(error.message);
    },
  })

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
        <DataTable columns={columns} data={categoryListQuery.data?.data?.data || []} isLoading={categoryListQuery.isLoading || categoryListQuery.isFetching}>
          <DataTable.Toolbar>
            <DataTable.Search />
            <DataTable.BulkDelete onDelete={(ids: string[]) => {
              bulkCategoryDeleteMutation.mutate(ids);
            }} />
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </div>
    </div>
  )
}

export default CategoryListPage