'use client';

import { getProfile } from '@/helpers/auth.helpers'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

function DashboardPage() {
  const getUserDataQuery = useQuery({
    queryKey: ['get-me'],
    queryFn: async() => await getProfile()
  })
  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage