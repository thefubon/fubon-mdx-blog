import React, { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  padding?: boolean
  space?: boolean
  className?: string
}

export default function Container({
  children,
  padding = true,
  space = true,
  className = '',
}: ContainerProps) {
  const classes = [
    padding ? 'container-fluid' : '',
    space ? 'container-space' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
