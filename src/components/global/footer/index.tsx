export default function Footer() {
  return (
    <>
      <footer className="mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-foreground">
          &copy; 2004-{new Date().getFullYear()} Fubon.
        </div>
      </footer>
    </>
  )
}
