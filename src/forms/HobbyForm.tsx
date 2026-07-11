import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type HobbyFormValues, hobbySchema } from './schemas'
import { FormActions } from './FormActions'
import type { EntityFormProps } from './types'

export function HobbyForm({ defaultValues, onSubmit, onCancel, submitting }: EntityFormProps<HobbyFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HobbyFormValues>({
    resolver: zodResolver(hobbySchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entity-form">
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register('description')} rows={3} />
      </div>

      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  )
}
