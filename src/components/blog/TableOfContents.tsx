'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  readingTime: string
}

// Helper function to extract text content from React nodes
const getTextContent = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }
  
  let text = '';
  const childNodes = node.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    text += getTextContent(childNodes[i]);
  }
  
  return text;
}

export default function TableOfContents({ readingTime }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)
  const tocRef = useRef<HTMLDivElement>(null)

  // Extract headings from the article
  useEffect(() => {
    // Allow a tiny delay for the DOM to fully render
    const timer = setTimeout(() => {
      const article = document.querySelector('article')
      if (!article) {
        setIsLoading(false);
        return;
      }

      const elements = Array.from(article.querySelectorAll('h2, h3'))
      const headingItems = elements.map((element) => {
        // Ensure each heading has an ID for linking
        if (!element.id) {
          const textContent = getTextContent(element).trim();
          element.id = textContent.toLowerCase().replace(/\s+/g, '-') || `heading-${Math.random().toString(36).substr(2, 9)}`;
        }

        return {
          id: element.id,
          text: getTextContent(element).trim() || '',
          level: parseInt(element.tagName.substring(1), 10)
        }
      })

      setHeadings(headingItems)
      setIsLoading(false)
    }, 200); // Slightly longer delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [])

  // Set up intersection observer to detect active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      // Find the first visible heading
      const visibleHeadings = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          const aTop = a.boundingClientRect.top;
          const bTop = b.boundingClientRect.top;
          return aTop - bTop;
        });
      
      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].target.id);
      }
    }

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px -70% 0px',
      threshold: 0.1
    })

    const headingElements = document.querySelectorAll('h2, h3')
    headingElements.forEach((element) => {
      observer.current?.observe(element)
    })

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [headings])

  // Calculate reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.querySelector('article')
      if (!article) return

      const totalHeight = article.clientHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const articleTop = article.getBoundingClientRect().top + scrollTop
      const scrolled = scrollTop - articleTop
      const articleScrollableHeight = totalHeight - windowHeight

      if (articleScrollableHeight <= 0) {
        setReadingProgress(100)
      } else {
        const progress = Math.min(100, (scrolled / articleScrollableHeight) * 100)
        setReadingProgress(Math.max(0, progress))
      }
    }

    updateReadingProgress()
    window.addEventListener('scroll', updateReadingProgress)
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [])

  // Base component structure to ensure consistent height/layout
  const renderToc = () => {
    return (
      <div 
        className="sticky top-[clamp(80px,15vw,150px)] z-20" 
        ref={tocRef} 
        style={{position: 'sticky', top: 'clamp(80px,15vw,150px)'}}
      >
        <div className="font-medium text-lg mb-4">Contents</div>
        <nav className="mb-6 min-h-[120px]">
          {isLoading ? (
            // Skeleton loading state
            <ul className="space-y-2 text-sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                </li>
              ))}
              {[1, 2].map((i) => (
                <li key={`sub-${i}`} className="pl-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                </li>
              ))}
            </ul>
          ) : headings.length > 0 ? (
            // Actual headings
            <ul className="space-y-2 text-sm">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={`
                    ${heading.level === 3 ? 'pl-4' : ''} 
                    ${
                      activeId === heading.id
                        ? 'font-medium text-black border-l-2 border-blue-500 pl-2'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                    }
                    transition-all duration-200
                  `}>
                  <Link
                    href={`#${heading.id}`}
                    className="block py-1"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(heading.id)?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }}>
                    {heading.text}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            // Empty placeholder when no headings found
            <div className="text-sm text-gray-500 italic">No sections found</div>
          )}
        </nav>

        {/* Reading progress indicator */}
        <div className="h-1 bg-gray-200 rounded-full w-full mb-4">
          <div
            className="h-1 bg-blue-500 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Reading time */}
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 7V12L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {readingTime}
        </div>
      </div>
    );
  };

  return (
    <div className="hidden lg:block h-full">
      {renderToc()}
    </div>
  );
} 