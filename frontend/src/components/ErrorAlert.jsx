export default function ErrorAlert({ message, onRetry }) {
  if (!message) {
    return null
  }

  return (
    <div className="error-card" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-outline-danger" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
