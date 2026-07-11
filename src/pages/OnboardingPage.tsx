import { useClerk } from '@clerk/clerk-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveProfile } from '../api/mutations'
import { useApiToken } from '../api/useApiToken'
import { ProfileForm } from '../forms/ProfileForm'
import { type ProfileFormValues, profileFormValuesToInput } from '../forms/schemas'

export function OnboardingPage() {
  const navigate = useNavigate()
  const getToken = useApiToken()
  const { signOut } = useClerk()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: ProfileFormValues) => {
    setSubmitting(true)
    setError(null)
    try {
      const token = await getToken()
      await saveProfile(token, profileFormValuesToInput(values))
      navigate('/resume', { replace: true })
    } catch {
      setError("Couldn't save your profile — try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="onboarding">
      <h1>Let's create your profile</h1>
      <p>This is the foundation of your resume — you can add experience, education, and everything else next.</p>
      {error && <p className="field-error">{error}</p>}
      <ProfileForm
        onSubmit={handleSubmit}
        onCancel={() => void signOut({ redirectUrl: '/' })}
        submitting={submitting}
      />
    </div>
  )
}
