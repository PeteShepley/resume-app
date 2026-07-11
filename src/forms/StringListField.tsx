import { useState } from 'react'

interface StringListFieldProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
}

/** Add/remove control for the responsibilities/accomplishments fields —
 * shared because Experience is the only entity with list-of-string fields,
 * but it has two of them. */
export function StringListField({ label, values, onChange }: StringListFieldProps) {
  const [draft, setDraft] = useState('')

  const addItem = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...values, trimmed])
    setDraft('')
  }

  return (
    <div className="string-list-field">
      <label>{label}</label>
      {values.length > 0 && (
        <ul className="string-list-items">
          {values.map((value, index) => (
            <li key={index}>
              <span>{value}</span>
              <button
                type="button"
                className="btn-remove"
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter((_, i) => i !== index))}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="string-list-add">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addItem()
            }
          }}
          placeholder={`Add ${label.toLowerCase()}`}
        />
        <button type="button" className="btn-secondary" onClick={addItem}>
          Add
        </button>
      </div>
    </div>
  )
}
