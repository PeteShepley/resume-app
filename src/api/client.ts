/**
 * Thin fetch wrapper for resume-api: attaches a bearer token to every
 * request and normalizes error responses.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    super(`resume-api request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface ApiFetchOptions {
  token: string | null
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

export async function apiFetch<T>(path: string, { token, method = 'GET', body }: ApiFetchOptions): Promise<T> {
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data as T
}
