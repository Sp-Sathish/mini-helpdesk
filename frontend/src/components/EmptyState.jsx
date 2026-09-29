export default function EmptyState({ title, children, action }) {
  return (
    <div className="empty-state">
      {title && <h2 className="empty-title">{title}</h2>}
      {children && <p className="empty-copy">{children}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  )
}
