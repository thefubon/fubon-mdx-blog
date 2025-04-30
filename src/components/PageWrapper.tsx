import React, { ReactNode } from 'react'
import Heading from './Heading'

interface PageWrapperProps {
  title?: string
  description?: string
  children: ReactNode
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section className="page-wrapper">
      {title &&
        <div className="container-fluid">
          <Heading
            title={title}
            description={description}
          />
        </div>
      }

      <article className="page-content">{children}</article>
    </section>
  )
}

export default PageWrapper
