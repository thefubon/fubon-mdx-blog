export default function Footer() {
  return (
    <footer className="bg-muted mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 text-center text-foreground">
        &copy; {new Date().getFullYear()} MDX Блог на Next.js 15
      </div>
    </footer>
  )
}
