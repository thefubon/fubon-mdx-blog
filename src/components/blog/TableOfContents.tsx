'use client'

import { useEffect, useState, useRef } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null);

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
    }, 500); // Longer delay to ensure DOM is ready

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

  // Absolute inline styles to avoid any style conflicts
  const containerStyle: React.CSSProperties = {
    display: 'none', // Hidden by default
    position: 'sticky',
    top: 'clamp(80px,15vw,150px)',
    zIndex: 20,
    maxHeight: '80vh',
    overflowY: 'auto',
    paddingRight: '16px',
    width: '16rem',
  };

  // Media query via JavaScript
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        if (window.innerWidth >= 1024) { // lg breakpoint
          containerRef.current.style.display = 'block';
        } else {
          containerRef.current.style.display = 'none';
        }
      }
    };

    // Initial call
    handleResize();

    // Setup listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Styles for other elements
  const headingStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 500,
    marginBottom: '1rem',
  };
  
  const navStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
    minHeight: isLoading ? '120px' : 'auto',
  };
  
  const progressContainerStyle: React.CSSProperties = {
    height: '0.25rem',
    backgroundColor: '#E5E7EB', // gray-200
    borderRadius: '9999px',
    width: '100%',
    marginBottom: '1rem',
  };
  
  const progressBarStyle: React.CSSProperties = {
    height: '0.25rem',
    backgroundColor: '#3B82F6', // blue-500
    borderRadius: '9999px',
    width: `${readingProgress}%`,
    transition: 'width 200ms ease-out',
  };
  
  const readingTimeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#6B7280', // gray-500
  };

  // Content rendering
  const renderHeadings = () => {
    if (headings.length === 0) return null;
    
    return (
      <ul style={{ marginTop: 0, paddingLeft: 0, listStyle: 'none' }}>
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          
          const itemStyle: React.CSSProperties = {
            paddingLeft: heading.level === 3 ? '1rem' : 0,
            borderLeft: isActive ? '2px solid #3B82F6' : 'none',
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem',
            transition: 'all 200ms',
            marginBottom: '0.5rem',
          };
          
          const linkStyle: React.CSSProperties = {
            display: 'block',
            color: isActive ? '#000' : '#6B7280',
            fontWeight: isActive ? 500 : 400,
            paddingLeft: isActive ? '0.5rem' : 0,
            textDecoration: 'none',
            fontSize: '0.875rem',
          };
          
          return (
            <li key={heading.id} style={itemStyle}>
              <a
                href={`#${heading.id}`}
                style={linkStyle}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    );
  };
  
  // Loading skeleton
  const renderSkeleton = () => {
    return (
      <ul style={{ marginTop: 0, paddingLeft: 0, listStyle: 'none' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <li key={i} style={{ marginBottom: '0.5rem' }}>
            <div 
              style={{ 
                height: '1rem', 
                backgroundColor: '#E5E7EB', 
                borderRadius: '0.25rem', 
                width: '75%', 
                animation: 'pulse 2s cubic-bezier(.4,0,.6,1) infinite'
              }} 
            />
          </li>
        ))}
        {[1, 2].map((i) => (
          <li key={`sub-${i}`} style={{ marginBottom: '0.5rem', paddingLeft: '1rem' }}>
            <div 
              style={{ 
                height: '1rem', 
                backgroundColor: '#E5E7EB', 
                borderRadius: '0.25rem', 
                width: '66%', 
                animation: 'pulse 2s cubic-bezier(.4,0,.6,1) infinite'
              }} 
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={headingStyle}>Contents</div>
      
      <nav style={navStyle}>
        {isLoading ? renderSkeleton() : renderHeadings()}
      </nav>
      
      <div style={progressContainerStyle}>
        <div style={progressBarStyle} />
      </div>
      
      <div style={readingTimeStyle}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: '0.5rem' }}
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {readingTime}
      </div>
    </div>
  );
} 