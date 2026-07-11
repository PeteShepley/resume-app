import { useAuth } from '@clerk/clerk-react'
import { useCallback } from 'react'

/** JWT template already configured in Clerk's dashboard for resume-api — see
 * api-console/src/apis.ts, which uses the same template against the same API. */
const CLERK_JWT_TEMPLATE = 'resume-api'

/** Returns a function resolving a fresh bearer token for resume-api. Clerk
 * session tokens are short-lived, so callers should call this right before
 * each request rather than caching the resolved token. */
export function useApiToken() {
  const { getToken } = useAuth()
  return useCallback(() => getToken({ template: CLERK_JWT_TEMPLATE }), [getToken])
}
