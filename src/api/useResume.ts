import { useCallback, useEffect, useState } from 'react'
import type { Resume } from '../types/schema'
import { apiFetch } from './client'
import { useApiToken } from './useApiToken'

interface UseResumeResult {
  resume: Resume | undefined
  loading: boolean
  error: Error | null
  refetch: () => void
}

/** GET /me/resume — the whole resume (profile + all six collections) in one
 * call. The dashboard's single source of truth: every mutation is followed
 * by refetch() rather than local cache surgery, matching resume-api's own
 * "one query returns everything" design (see resume_api/routers/resume.py). */
export function useResume(): UseResumeResult {
  const getToken = useApiToken()
  const [resume, setResume] = useState<Resume | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const token = await getToken()
        const data = await apiFetch<Resume>('/me/resume', { token })
        if (!cancelled) setResume(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load resume'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [getToken, version])

  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  return { resume, loading, error, refetch }
}
