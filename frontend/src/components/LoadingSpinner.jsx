export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="loading-block" role="status">
      <div className="spinner-border text-primary" />
      <span>{label}</span>
    </div>
  )
}
