import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type SkillFormValues, proficiencies, skillCategories, skillSchema } from './schemas'
import { FormActions } from './FormActions'
import type { EntityFormProps } from './types'

export function SkillForm({ defaultValues, onSubmit, onCancel, submitting }: EntityFormProps<SkillFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entity-form">
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" {...register('name')} />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" {...register('category')}>
            {skillCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="field-error">{errors.category.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="proficiency">Proficiency</label>
          <select id="proficiency" {...register('proficiency')}>
            <option value="">—</option>
            {proficiencies.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="years_experience">Years experience</label>
          <input id="years_experience" type="number" step="0.5" min="0" {...register('years_experience')} />
        </div>
      </div>

      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  )
}
