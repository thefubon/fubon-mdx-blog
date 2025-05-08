'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

interface CategoryFiltersProps {
  categories: string[]
}

export default function CategoryFilters({ categories = [] }: CategoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  
  // Set initial category from URL parameter
  useEffect(() => {
    setMounted(true)
    const category = searchParams.get('category')
    if (category) {
      setActiveCategory(category)
    }
  }, [searchParams])
  
  // If not mounted yet, show a loading placeholder
  if (!mounted) {
    return <div className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg mb-8" />
  }
  
  // Handle category change
  const handleCategoryClick = (category: string) => {
    const newCategory = category === activeCategory ? '' : category
    setActiveCategory(newCategory)
    
    // Update URL with new category
    if (newCategory) {
      router.push(`/work?category=${encodeURIComponent(newCategory)}`)
    } else {
      router.push('/work')
    }
  }
  
  if (!categories.length) return null
  
  return (
    <div className="flex flex-wrap gap-2 py-4 mb-8 justify-center md:justify-start">
      <button
        onClick={() => handleCategoryClick('')}
        className={cn(
          "px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
          !activeCategory 
            ? "bg-black text-white dark:bg-white dark:text-black shadow-sm" 
            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        )}
      >
        Все работы
      </button>
      
      {categories.map(category => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
            activeCategory === category
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
} 