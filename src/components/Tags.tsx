// src/components/Tags.tsx
import Link from 'next/link'

interface TagsProps {
  tags: string[]
}

export default function Tags({ tags }: TagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog/tags/${tag}`}
          className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition-colors">
          #{tag}
        </Link>
      ))}
    </div>
  )
}
