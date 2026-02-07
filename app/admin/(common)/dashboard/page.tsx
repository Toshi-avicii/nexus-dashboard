'use client';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { getProfile } from '@/helpers/auth.helpers'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

function DashboardPage() {
  const getUserDataQuery = useQuery({
    queryKey: ['get-me'],
    queryFn: async () => await getProfile()
  });

  return (
    <div className='p-4'>
      <Breadcrumb className='font-quickSand'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" linkTag>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default DashboardPage