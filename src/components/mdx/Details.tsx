// src/components/mdx/Details.tsx
import React from 'react'

interface DetailsProps {
  children: React.ReactNode
  summary: string
  open?: boolean
}

export default function Details({
  children,
  summary,
  open = false,
}: DetailsProps) {
  return (
    <details
      className="my-4 border border-gray-200 rounded-lg"
      open={open}>
      <summary className="p-4 font-medium cursor-pointer bg-gray-50 hover:bg-gray-100">
        {summary}
      </summary>
      <div className="p-4 border-t border-gray-200">{children}</div>
    </details>
  )
}
