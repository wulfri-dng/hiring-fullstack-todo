import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Todo, TodoInput } from '@todo/shared'
import * as api from '@/api/todos'

type Status = 'loading' | 'error' | 'ready'

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : 'Something went wrong'
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [loadError, setLoadError] = useState('')

  const load = useCallback(() => {
    api
      .getTodos()
      .then((data) => {
        setTodos(data)
        setStatus('ready')
      })
      .catch((err) => {
        setLoadError(errorMessage(err))
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function retry() {
    setStatus('loading')
    load()
  }

  async function optimistic(
    update: (list: Todo[]) => Todo[],
    request: () => Promise<unknown>,
    failMessage: string
  ) {
    const previous = todos
    setTodos(update(todos))

    try {
      await request()
    } catch (err) {
      setTodos(previous)
      toast.error(failMessage, { description: errorMessage(err) })
    }
  }

  async function addTodo(input: TodoInput) {
    try {
      const created = await api.createTodo(input)
      setTodos((prev) => [created, ...prev])
      return true
    } catch (err) {
      toast.error(`Couldn't add "${input.title}"`, { description: errorMessage(err) })
      return false
    }
  }

  function updateTodo(id: string, changes: TodoInput) {
    return optimistic(
      (list) => list.map((t) => (t._id === id ? { ...t, ...changes } : t)),
      () => api.updateTodo(id, changes),
      `Couldn't save "${changes.title}"`
    )
  }

  function toggleTodo(todo: Todo) {
    return optimistic(
      (list) => list.map((t) => (t._id === todo._id ? { ...t, done: !t.done } : t)),
      () => api.toggleTodo(todo._id),
      `Couldn't update "${todo.title}"`
    )
  }

  function deleteTodo(todo: Todo) {
    return optimistic(
      (list) => list.filter((t) => t._id !== todo._id),
      () => api.deleteTodo(todo._id),
      `Couldn't delete "${todo.title}"`
    )
  }

  return { todos, status, loadError, retry, addTodo, updateTodo, toggleTodo, deleteTodo }
}
