import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type EducationFormValues, educationSchema } from './schemas'
import { FormActions } from './FormActions'
import type { EntityFormProps } from './types'

export function EducationForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
}: EntityFormProps<EducationFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entity-form">
      <div className="field-row">
        <div className="field">
          <label htmlFor="institution">Institution</label>
          <input id="institution" {...register('institution')} />
          {errors.institution && <p className="field-error">{errors.institution.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="degree">Degree</label>
          <input id="degree" {...register('degree')} />
          {errors.degree && <p className="field-error">{errors.degree.message}</p>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="field_of_study">Field of study</label>
          <input id="field_of_study" {...register('field_of_study')} />
        </div>
        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" {...register('location')} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="start_date">Start date</label>
          <input id="start_date" type="date" {...register('start_date')} />
          {errors.start_date && <p className="field-error">{errors.start_date.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="end_date">End date</label>
          <input id="end_date" type="date" {...register('end_date')} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="gpa">GPA</label>
          <input id="gpa" {...register('gpa')} />
        </div>
        <div className="field">
          <label htmlFor="honors">Honors</label>
          <input id="honors" {...register('honors')} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="activities">Activities</label>
        <textarea id="activities" {...register('activities')} rows={3} />
      </div>

      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  )
}
