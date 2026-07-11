import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type GoalFormValues, goalCategories, goalSchema, goalStatuses } from './schemas'
import { FormActions } from './FormActions'
import type { EntityFormProps } from './types'

export function GoalForm({ defaultValues, onSubmit, onCancel, submitting }: EntityFormProps<GoalFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: { status: 'active', ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entity-form">
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register('description')} rows={3} />
        {errors.description && <p className="field-error">{errors.description.message}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" {...register('category')}>
            {goalCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="field-error">{errors.category.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" {...register('status')}>
            {goalStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="target_date">Target date</label>
          <input id="target_date" type="date" {...register('target_date')} />
        </div>
      </div>

      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  )
}
