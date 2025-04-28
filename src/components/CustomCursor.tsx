'use client'

import React, { useEffect, useState } from 'react'

const CustomCursor: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement
    const hoverElements = document.querySelectorAll('.hover-cursor')

    if (cursor) {
      const handleMouseMove = (e: MouseEvent) => {
        setCursorPosition({ top: e.clientY, left: e.clientX })
      }

      const handleMouseEnter = () => {
        setIsHovering(true)
      }

      const handleMouseLeave = () => {
        setIsHovering(false)
      }

      document.addEventListener('mousemove', handleMouseMove)

      hoverElements.forEach((element) => {
        element.addEventListener('mouseenter', handleMouseEnter)
        element.addEventListener('mouseleave', handleMouseLeave)
      })

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        hoverElements.forEach((element) => {
          element.removeEventListener('mouseenter', handleMouseEnter)
          element.removeEventListener('mouseleave', handleMouseLeave)
        })
      }
    } else {
      console.error('Cursor element not found!')
    }
  }, [])

  return (
    <div
      className={`custom-cursor ${isHovering ? 'cursor-hover' : ''}`}
      style={{
        top: `${cursorPosition.top}px`,
        left: `${cursorPosition.left}px`,
      }}>
      <span className="cursor-text">
        <svg
          className="stroke-1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </span>
    </div>
  )
}

export default CustomCursor
