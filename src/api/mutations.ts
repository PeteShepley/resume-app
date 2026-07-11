import type { Profile, ProfileInput } from '../types/schema'
import { apiFetch } from './client'

export function saveProfile(token: string | null, body: ProfileInput) {
  return apiFetch<Profile>('/me/profile', { token, method: 'PUT', body })
}

/** Generic collection mutations, parameterized by the collection's URL
 * segment (e.g. "experience") — the frontend analogue of resume_api/crud.py's
 * build_collection_router factory: one implementation for all six
 * collections instead of six near-identical copies. */
export function createItem<TInput, TItem>(token: string | null, entityPath: string, body: TInput) {
  return apiFetch<TItem>(`/me/${entityPath}`, { token, method: 'POST', body })
}

export function updateItem<TInput, TItem>(
  token: string | null,
  entityPath: string,
  id: string,
  body: TInput,
) {
  return apiFetch<TItem>(`/me/${entityPath}/${id}`, { token, method: 'PUT', body })
}

export function deleteItem(token: string | null, entityPath: string, id: string) {
  return apiFetch<void>(`/me/${entityPath}/${id}`, { token, method: 'DELETE' })
}
