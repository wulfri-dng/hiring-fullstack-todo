import type { ApiError, Todo, TodoInput } from '@todo/shared'

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/todos`

const UNREACHABLE = "Can't reach the server. Check your connection and try again."

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error(UNREACHABLE)
  }

  if (res.status === 204) return undefined as T

  if ([502, 503, 504].includes(res.status)) throw new Error(UNREACHABLE)

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = data as ApiError | null
    const fieldErrors = error?.errors ? Object.values(error.errors).join(', ') : ''
    throw new Error(fieldErrors || error?.message || `Request failed (${res.status})`)
  }

  return data as T
}

export function getTodos() {
  return request<Todo[]>(BASE_URL)
}

export function createTodo(todo: TodoInput) {
  return request<Todo>(BASE_URL, { method: 'POST', body: JSON.stringify(todo) })
}

export function updateTodo(id: string, changes: TodoInput) {
  return request<Todo>(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(changes) })
}

export function toggleTodo(id: string) {
  return request<Todo>(`${BASE_URL}/${id}/done`, { method: 'PATCH' })
}

export function deleteTodo(id: string) {
  return request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' })
}
