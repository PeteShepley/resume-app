import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { type ExperienceFormValues, employmentTypes, experienceSchema } from './schemas'
import { FormActions } from './FormActions'
import { StringListField } from './StringListField'
import type { EntityFormProps } from './types'

export function ExperienceForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
}: EntityFormProps<ExperienceFormValues>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { responsibilities: [], accomplishments: [], ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entity-form">
      <div className="field-row">
        <div className="field">
          <label htmlFor="organization">Organization</label>
          <input id="organization" {...register('organization')} />
          {errors.organization && <p className="field-error">{errors.organization.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" {...register('title')} />
          {errors.title && <p className="field-error">{errors.title.message}</p>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" {...register('location')} />
        </div>
        <div className="field">
          <label htmlFor="employment_type">Employment type</label>
          <select id="employment_type" {...register('employment_type')}>
            <option value="">—</option>
            {employmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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
          <p className="field-hint">Leave blank for your current role</p>
        </div>
      </div>

      <Controller
        name="responsibilities"
        control={control}
        render={({ field }) => (
          <StringListField label="Responsibilities" values={field.value ?? []} onChange={field.onChange} />
        )}
      />

      <Controller
        name="accomplishments"
        control={control}
        render={({ field }) => (
          <StringListField label="Accomplishments" values={field.value ?? []} onChange={field.onChange} />
        )}
      />

      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  )
}
