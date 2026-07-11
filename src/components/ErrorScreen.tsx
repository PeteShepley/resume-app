interface ErrorScreenProps {
  error: Error
  onRetry: () => void
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <div className="status-screen">
      <p>Something went wrong: {error.message}</p>
      <button type="button" className="btn-secondary" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
