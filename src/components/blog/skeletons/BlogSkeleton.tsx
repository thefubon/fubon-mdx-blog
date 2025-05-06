'use client'

import { useEffect, useState } from 'react'
import BlogGridSkeleton from '@/components/blog/skeletons/BlogGridSkeleton'
import BlogListSkeleton from '@/components/blog/skeletons/BlogListSkeleton'
import BlogFiltersSkeleton from '@/components/blog/skeletons/BlogFiltersSkeleton'

export default function BlogSkeleton() {
  const [isListView, setIsListView] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const viewMode = localStorage.getItem('blogViewMode')
      setIsListView(viewMode === 'list')
    }
  }, [])
  
  return (
    <div>
      <BlogFiltersSkeleton />
      {isListView ? <BlogListSkeleton /> : <BlogGridSkeleton />}
    </div>
  )
} 