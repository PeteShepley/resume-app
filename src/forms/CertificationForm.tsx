import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type CertificationFormValues, certificationSchema, certificationTypes } from './schemas'
import { FormActions } from './FormActions'
import type { EntityFormProps } from './types'

export function CertificationForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
}: EntityFormProps<CertificationFormValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: { type: 'professional', ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entity-form">
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" {...register('name')} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="issuing_organization">Issuing organization</label>
          <input id="issuing_organization" {...register('issuing_organization')} />
          {errors.issuing_organization && <p className="field-error">{errors.issuing_organization.message}</p>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="issue_date">Issue date</label>
          <input id="issue_date" type="date" {...register('issue_date')} />
          {errors.issue_date && <p className="field-error">{errors.issue_date.message}</p>}
        </div>
        <div className="field">
          <label htmlFor="expiration_date">Expiration date</label>
          <input id="expiration_date" type="date" {...register('expiration_date')} />
        </div>
        <div className="field">
          <label htmlFor="type">Type</label>
          <select id="type" {...register('type')}>
            {certificationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="credential_id">Credential ID</label>
          <input id="credential_id" {...register('credential_id')} />
        </div>
        <div className="field">
          <label htmlFor="credential_url">Credential URL</label>
          <input id="credential_url" {...register('credential_url')} />
        </div>
      </div>

      <FormActions onCancel={onCancel} submitting={submitting} />
    </form>
  )
}
