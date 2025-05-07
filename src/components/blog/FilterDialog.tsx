'use client'

import { useState, useEffect } from 'react'
import { FilterIcon, Search } from 'lucide-react'
import { useMediaQuery } from '@/hooks'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ViewMode } from './BlogFilters'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface FilterDialogProps {
  categories: Array<{ category: string, count: number }>
  currentCategory?: string
  tags: string[]
  currentTag?: string
  showFavorites: boolean
  onShowFavoritesChange: (show: boolean) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function FilterDialog({
  categories,
  currentCategory,
  tags,
  currentTag,
  showFavorites,
  onShowFavoritesChange,
  viewMode,
  onViewModeChange
}: FilterDialogProps) {
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  
  // Отмечаем, что компонент смонтирован (и мы на клиенте)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Для серверного рендеринга используем мобильный вариант по умолчанию
  if (!isMounted) {
    return (
      <Button variant="outline" className="gap-2">
        <FilterIcon size={16} />
        Фильтры
      </Button>
    )
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FilterIcon size={16} />
            Фильтры
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Фильтры</DialogTitle>
            <DialogDescription>
              Выберите параметры фильтрации для блога
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <FilterContent 
              categories={categories}
              currentCategory={currentCategory}
              tags={tags}
              currentTag={currentTag}
              showFavorites={showFavorites}
              onShowFavoritesChange={onShowFavoritesChange}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              onClose={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FilterIcon size={16} />
          Фильтры
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Фильтры</DrawerTitle>
          <DrawerDescription>
            Выберите параметры фильтрации для блога
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-0 max-h-[60vh] overflow-y-auto">
          <FilterContent 
            categories={categories}
            currentCategory={currentCategory}
            tags={tags}
            currentTag={currentTag}
            showFavorites={showFavorites}
            onShowFavoritesChange={onShowFavoritesChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            onClose={() => setOpen(false)}
          />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

interface FilterContentProps extends FilterDialogProps {
  onClose: () => void
}

function FilterContent({
  categories,
  currentCategory,
  tags,
  currentTag,
  showFavorites,
  onShowFavoritesChange,
  onClose
}: FilterContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`)
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Поиск */}
      <div>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по блогу..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Поисковый запрос"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Найти
          </button>
        </form>
      </div>
      
      {/* Переключатель Избранное */}
      <div className="flex items-center justify-between">
        <Label htmlFor="favorites" className="text-base">Только избранные</Label>
        <Switch
          id="favorites"
          checked={showFavorites}
          onCheckedChange={(checked) => {
            onShowFavoritesChange(checked)
          }}
        />
      </div>
      
      {/* Категории */}
      <div>
        <h3 className="text-base font-medium mb-3">Категории</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !currentCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={onClose}
          >
            Все
          </Link>
          
          {categories.map(({ category, count }) => (
            <Link
              key={category}
              href={`/blog/categories/${encodeURIComponent(category)}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={onClose}
            >
              {category} <span className="inline-flex items-center justify-center bg-gray-200/50 dark:bg-gray-700/50 text-xs rounded-full px-1.5 py-0.5">{count}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Теги */}
      <div>
        <h3 className="text-base font-medium mb-3">Теги</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !currentTag
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={onClose}
          >
            Все
          </Link>
          
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currentTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={onClose}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 