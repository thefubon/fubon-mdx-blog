// src/components/mdx/Accordion.tsx
'use client'

import React, { useState } from 'react'

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <button
        className={`w-full p-4 text-left font-medium flex justify-between items-center ${
          isOpen ? 'bg-gray-100' : 'bg-white'
        }`}
        onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="p-4 border-t">{children}</div>
      </div>
    </div>
  )
}
