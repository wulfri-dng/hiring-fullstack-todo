import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTodos } from '@/hooks/useTodos'
import ThemeToggle from '@/components/ThemeToggle'
import TodoForm from '@/components/TodoForm'
import TodoItem from '@/components/TodoItem'

type Filter = 'all' | 'active' | 'done'

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: 'No todos yet. Add your first one above.',
  active: 'Nothing left to do. Nice work!',
  done: 'No completed todos yet.',
}

function App() {
  const { todos, status, loadError, retry, addTodo, updateTodo, toggleTodo, deleteTodo } =
    useTodos()
  const [filter, setFilter] = useState<Filter>('all')

  const activeCount = todos.filter((t) => !t.done).length
  const doneCount = todos.length - activeCount

  const visible = todos.filter((t) => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Todos</h1>
          {status === 'ready' && (
            <p className="text-sm text-muted-foreground">
              {todos.length === 0
                ? 'Your list is empty'
                : `${activeCount} of ${todos.length} left to do`}
            </p>
          )}
        </div>
        <ThemeToggle />
      </header>

      <TodoForm onAdd={addTodo} />

      {status === 'loading' && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <CircleAlert className="size-8 text-destructive" />
            <div>
              <p className="font-medium">Couldn't load your todos</p>
              <p className="text-sm text-muted-foreground">{loadError}</p>
            </div>
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      {status === 'ready' && (
        <section className="flex flex-col gap-3">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
            <TabsList>
              <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
              <TabsTrigger value="done">Done ({doneCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {EMPTY_MESSAGES[filter]}
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>
      )}
    </main>
  )
}

export default App
