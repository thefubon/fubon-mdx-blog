// src/components/mdx/CodeBlock.tsx
'use client'

import React from 'react'
import { useState, useEffect } from 'react'
// Импортируем то, что нужно для Prism
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-css'
import 'prismjs/themes/prism-tomorrow.css'

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
}

export default function CodeBlock({
  children,
  language = 'javascript',
  filename,
}: CodeBlockProps) {
  // Используем состояние для отслеживания, загрузилась ли страница на клиенте
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      Prism.highlightAll()
    }
  }, [isMounted])

  // Пока не загрузились на клиенте, возвращаем простой блок кода без подсветки
  if (!isMounted) {
    return (
      <div className="code-block-wrapper mb-6 rounded-lg overflow-hidden">
        {filename && (
          <div className="bg-gray-800 text-gray-300 text-xs px-4 py-2 border-b border-gray-700">
            {filename}
          </div>
        )}
        <pre className="m-0 p-0">
          <code className="block p-4 overflow-x-auto">{children}</code>
        </pre>
      </div>
    )
  }

  // После загрузки на клиенте возвращаем код с классами для Prism
  return (
    <div className="code-block-wrapper mb-6 rounded-lg overflow-hidden">
      {filename && (
        <div className="bg-gray-800 text-gray-300 text-xs px-4 py-2 border-b border-gray-700">
          {filename}
        </div>
      )}
      <pre className="m-0 p-0">
        <code className={`language-${language} block p-4 overflow-x-auto`}>
          {children}
        </code>
      </pre>
    </div>
  )
}
