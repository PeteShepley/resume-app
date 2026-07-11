import { SignedIn, SignedOut } from '@clerk/clerk-react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useProfile } from '../api/useProfile'
import { ErrorScreen } from '../components/ErrorScreen'
import { LoadingScreen } from '../components/LoadingScreen'

export function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  )
}

/** Wraps /resume — redirects to /onboarding if GET /me/profile 404s. */
export function RequireProfile({ children }: { children: ReactNode }) {
  const { profile, error, refetch } = useProfile()
  if (error) return <ErrorScreen error={error} onRetry={refetch} />
  if (profile === undefined) return <LoadingScreen />
  if (profile === null) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

/** Wraps /onboarding — redirects to /resume if a profile already exists, so
 * a returning user can't land back on the "create your profile" flow. */
export function RedirectIfHasProfile({ children }: { children: ReactNode }) {
  const { profile, error, refetch } = useProfile()
  if (error) return <ErrorScreen error={error} onRetry={refetch} />
  if (profile === undefined) return <LoadingScreen />
  if (profile) return <Navigate to="/resume" replace />
  return <>{children}</>
}
