import Image from 'next/image'
import Link from 'next/link'

// Импортируем компоненты
import Callout from './mdx/Callout';
import CodeBlock from './mdx/CodeBlock';
import { Tabs, Tab } from './mdx/Tabs';
import Accordion from './mdx/Accordion';
import ImageMdx from './mdx/Image';
import Table from './mdx/Table';
import FileDownload from './mdx/FileDownload';
import Details from './mdx/Details';

const MDXComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-3xl font-bold mb-6 mt-10">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/\s+/g, '-') 
      : '';
    return (
      <h2 id={id} className="text-2xl font-bold mb-4 mt-8">{children}</h2>
    );
  },
  h3: ({ children }: { children: React.ReactNode }) => {
    const id = typeof children === 'string' 
      ? children.toLowerCase().replace(/\s+/g, '-') 
      : '';
    return (
      <h3 id={id} className="text-xl font-bold mb-3 mt-6">{children}</h3>
    );
  },
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4">{children}</p>
  ),
  a: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="text-blue-500 hover:underline">
      {children}
    </Link>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-6 mb-4">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal pl-6 mb-4">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  // Обновленный компонент для изображений
  img: ({
    src,
    alt,
    width = 800,
    height = 500,
  }: {
    src: string
    alt: string
    width?: number
    height?: number
  }) => {
    // Проверяем, является ли источник внешним URL
    const isExternal = src && src.startsWith('http')
    
    // Если src не определен или пустой, показываем заполнитель
    if (!src) {
      return (
        <div className="my-6 rounded-lg bg-gray-200 dark:bg-gray-800 p-4 flex flex-col items-center justify-center" style={{ height: `${height}px`, maxWidth: `${width}px`, margin: '0 auto' }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-400 dark:text-gray-500 mb-3"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-gray-500 dark:text-gray-400">{alt || 'Изображение недоступно'}</span>
        </div>
      )
    }

    return (
      <div className="my-6">
        {isExternal ? (
          // Для внешних изображений используем обычный тег img
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="rounded-lg mx-auto max-w-full h-auto"
            onError={(e) => {
              // При ошибке загрузки показываем иконку и текст
              const target = e.target as HTMLImageElement;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="rounded-lg bg-gray-200 dark:bg-gray-800 p-4 flex flex-col items-center justify-center" style="height: ${height}px; max-width: ${width}px; margin: 0 auto;">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      stroke-width="1.5" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      class="text-gray-400 dark:text-gray-500 mb-3"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span class="text-gray-500 dark:text-gray-400">${alt || 'Изображение недоступно'}</span>
                  </div>
                `;
              }
            }}
          />
        ) : (
          // Для локальных изображений используем компонент Image
          <Image
            src={src.startsWith('/') ? src : `/images/blog/${src}`}
            alt={alt}
            width={width}
            height={height}
            className="rounded-lg mx-auto"
            onError={(e) => {
              // При ошибке загрузки показываем иконку и текст
              const target = e.target as HTMLImageElement;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="rounded-lg bg-gray-200 dark:bg-gray-800 p-4 flex flex-col items-center justify-center" style="height: ${height}px; max-width: ${width}px; margin: 0 auto;">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                      stroke-width="1.5" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      class="text-gray-400 dark:text-gray-500 mb-3"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span class="text-gray-500 dark:text-gray-400">${alt || 'Изображение недоступно'}</span>
                  </div>
                `;
              }
            }}
          />
        )}
        {alt && <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>}
      </div>
    )
  },
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5">
      {children}
    </code>
  ),
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 overflow-x-auto p-4 rounded-lg my-4">
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-6">
      {children}
    </blockquote>
  ),

  // Кастомные компоненты
  Callout,
  CodeBlock,
  Tabs,
  Tab,
  Accordion,
  ImageMdx,
  Table,
  FileDownload,
  Details,
}

export default MDXComponents
