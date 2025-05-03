interface HeadingProps {
  title?: string
  description?: string
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div>
      {title && <h2 className="heading font-bold">{title}</h2>}
      {description && <p className="description">{description}</p>}
    </div>
  )
}

export default Heading
