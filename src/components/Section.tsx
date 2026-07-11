import { type ComponentType, type ReactNode, useState } from 'react'
import { createItem, deleteItem, updateItem } from '../api/mutations'
import { useApiToken } from '../api/useApiToken'
import type { EntityFormProps } from '../forms/types'
import { Modal } from './Modal'

interface SectionItem {
  id?: string
}

type ModalState<TItem> = { mode: 'add' } | { mode: 'edit'; item: TItem }

interface SectionProps<TItem extends SectionItem, TInput, TValues> {
  title: string
  items: TItem[]
  /** URL segment resume-api uses for this collection, e.g. "experience". */
  entityPath: string
  Form: ComponentType<EntityFormProps<TValues>>
  renderItem: (item: TItem) => ReactNode
  toDefaultValues: (item: TItem) => Partial<TValues>
  /** Converts submitted form values to the API's input shape — identity for
   * most entities, but Skill needs years_experience coerced string -> number. */
  toInput: (values: TValues) => TInput
  /** Called after any successful add/edit/delete — the caller refetches the
   * aggregate resume rather than this component tracking its own cache. */
  onChanged: () => void
}

/**
 * One generic list-with-modal-form implementation shared by all six
 * collections (experience, education, skills, certifications, hobbies,
 * goals) — the frontend analogue of resume_api/crud.py's
 * build_collection_router factory. Each call site in ResumePage supplies
 * its own item type, input type, form values type, Form component, and
 * item renderer; this component only knows the generic add/edit/delete flow.
 */
export function Section<TItem extends SectionItem, TInput, TValues>({
  title,
  items,
  entityPath,
  Form,
  renderItem,
  toDefaultValues,
  toInput,
  onChanged,
}: SectionProps<TItem, TInput, TValues>) {
  const getToken = useApiToken()
  const [modalState, setModalState] = useState<ModalState<TItem> | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const closeModal = () => setModalState(null)
  const label = title.toLowerCase()

  const handleSubmit = async (values: TValues) => {
    setSubmitting(true)
    try {
      const token = await getToken()
      const input = toInput(values)
      if (modalState?.mode === 'edit') {
        await updateItem<TInput, TItem>(token, entityPath, modalState.item.id as string, input)
      } else {
        await createItem<TInput, TItem>(token, entityPath, input)
      }
      closeModal()
      onChanged()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (item: TItem) => {
    if (!confirm(`Delete this ${label} entry? This can't be undone.`)) return
    const token = await getToken()
    await deleteItem(token, entityPath, item.id as string)
    onChanged()
  }

  return (
    <section className="resume-section">
      <div className="resume-section-header">
        <h2>{title}</h2>
        <button type="button" className="btn-secondary" onClick={() => setModalState({ mode: 'add' })}>
          Add {label}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No {label} yet.</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id} className="item-card">
              <div className="item-card-body">{renderItem(item)}</div>
              <div className="item-card-actions">
                <button type="button" className="btn-link" onClick={() => setModalState({ mode: 'edit', item })}>
                  Edit
                </button>
                <button type="button" className="btn-link btn-danger" onClick={() => handleDelete(item)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalState && (
        <Modal title={modalState.mode === 'edit' ? `Edit ${label}` : `Add ${label}`} onClose={closeModal}>
          <Form
            defaultValues={modalState.mode === 'edit' ? toDefaultValues(modalState.item) : undefined}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitting={submitting}
          />
        </Modal>
      )}
    </section>
  )
}
