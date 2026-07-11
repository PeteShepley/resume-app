import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type ProfileFormValues, profileSchema } from './schemas'
import { FormActions } from './FormActions'
import type { EntityFormProps } from './types'

export function ProfileForm({ defaultValues, onSubmit, onCancel, submitting }: EntityFormProps<ProfileFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
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
        <label htmlFor="headline">Headline</label>
        <input id="headline" {...register('headline')} placeholder="e.g. Senior Software Engineer" />
      </div>

      <div className="field">
        <label htmlFor="summary">Summary</label>
        <textarea id="summary" {...register('summary')} rows={4} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" {...register('location')} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="linkedin">LinkedIn</label>
          <input id="linkedin" {...register('linkedin')} placeholder="https://linkedin.com/in/…" />
        </div>
        <div className="field">
          <label htmlFor="github">GitHub</label>
          <input id="github" {...register('github')} placeholder="https://github.com/…" />
        </div>
        <div className="field">
          <label htmlFor="site">Site</label>
          <input id="site" {...register('site')} placeholder="https://…" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="goals_summary">Goals summary</label>
        <textarea id="goals_summary" {...register('goals_summary')} rows={3} />
      </div>

      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  )
}
