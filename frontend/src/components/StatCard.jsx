function StatIcon({ tone }) {
  const path = {
    total: 'M5 7h14v11H5zM8 7V5h8v2',
    open: 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 3v3.2l2 1.3',
    progress: 'M6 12h12M8 8h8M8 16h5',
    resolved: 'M6 12.5l3.2 3.2L18 8',
  }[tone]

  return (
    <span className={`stat-icon stat-icon-${tone}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={path} />
      </svg>
    </span>
  )
}

export default function StatCard({ label, value, hint, tone }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-top">
        <span>{label}</span>
        <StatIcon tone={tone} />
      </div>
      <div className="stat-value">{value}</div>
      <p>{hint}</p>
    </article>
  )
}
