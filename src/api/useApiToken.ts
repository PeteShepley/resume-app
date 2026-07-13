import { useAuth } from '@clerk/clerk-react'
import { useCallback } from 'react'

/** Must exist as a JWT template in the Clerk dashboard for whichever Clerk
 * application `VITE_CLERK_PUBLISHABLE_KEY` points at, and match resume-api's
 * `CLERK_AUDIENCE` if it enforces one. */
const CLERK_JWT_TEMPLATE = 'resume-api'

/** Returns a function resolving a fresh bearer token for resume-api. Clerk
 * session tokens are short-lived, so callers should call this right before
 * each request rather than caching the resolved token. */
export function useApiToken() {
  const { getToken } = useAuth()
  return useCallback(() => getToken({ template: CLERK_JWT_TEMPLATE }), [getToken])
}
