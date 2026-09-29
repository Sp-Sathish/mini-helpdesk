export default function PageShell({ children, narrow = false }) {
  return <main className={`page-shell${narrow ? ' page-shell-narrow' : ''}`}>{children}</main>
}
