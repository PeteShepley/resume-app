import { useCallback, useEffect, useState } from 'react'
import type { Profile } from '../types/schema'
import { ApiError, apiFetch } from './client'
import { useApiToken } from './useApiToken'

interface UseProfileResult {
  /** undefined = still loading, null = confirmed no profile yet (404) */
  profile: Profile | null | undefined
  error: Error | null
  refetch: () => void
}

/** GET /me/profile — 404s until the first PUT, which this hook treats as a
 * normal "no profile yet" result rather than an error. */
export function useProfile(): UseProfileResult {
  const getToken = useApiToken()
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined)
  const [error, setError] = useState<Error | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setError(null)

    void (async () => {
      try {
        const token = await getToken()
        const data = await apiFetch<Profile>('/me/profile', { token })
        if (!cancelled) setProfile(data)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 404) {
          setProfile(null)
        } else {
          setError(err instanceof Error ? err : new Error('Failed to load profile'))
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [getToken, version])

  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  return { profile, error, refetch }
}
