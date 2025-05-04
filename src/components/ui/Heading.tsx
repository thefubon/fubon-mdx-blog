interface HeadingProps {
  title?: string
  description?: string
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="space-y-2 md:space-y-4">
      {title && <h2 className="heading font-bold leading-none">{title}</h2>}
      {description && <p className="description">{description}</p>}
    </div>
  )
}

export default Heading
