interface FormActionsProps {
  onCancel: () => void
  submitting: boolean
}

export function FormActions({ onCancel, submitting }: FormActionsProps) {
  return (
    <div className="form-actions">
      <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
        Cancel
      </button>
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save'}
      </button>
    </div>
  )
}
