import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { Pencil, Trash2 } from 'lucide-react'
import { validateTodo, type Todo, type TodoInput } from '@todo/shared'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import TodoFields from './TodoFields'

interface Props {
  todo: Todo
  onToggle: (todo: Todo) => void
  onUpdate: (id: string, changes: TodoInput) => void
  onDelete: (todo: Todo) => void
}

function EditForm({
  todo,
  onSave,
  onCancel,
}: {
  todo: Todo
  onSave: (changes: TodoInput) => void
  onCancel: () => void
}) {
  const [values, setValues] = useState({ title: todo.title, description: todo.description })
  const errors = validateTodo(values)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (Object.keys(errors).length > 0) return
    onSave({ title: values.title.trim(), description: values.description.trim() })
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') onCancel()
  }

  return (
    <form className="flex flex-1 flex-col gap-3" onSubmit={handleSubmit} noValidate>
      <TodoFields
        values={values}
        errors={errors}
        onChange={setValues}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={Object.keys(errors).length > 0}>
          Save
        </Button>
      </div>
    </form>
  )
}

function TodoItem({ todo, onToggle, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)

  function handleSave(changes: TodoInput) {
    setEditing(false)
    if (changes.title !== todo.title || changes.description !== todo.description) {
      onUpdate(todo._id, changes)
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'flex-row items-start gap-3 px-4 py-3 transition-opacity',
          todo.done && !editing && 'opacity-60'
        )}
      >
        {editing ? (
          <EditForm todo={todo} onSave={handleSave} onCancel={() => setEditing(false)} />
        ) : (
          <>
            <Checkbox
              className="mt-0.5"
              checked={todo.done}
              onCheckedChange={() => onToggle(todo)}
              aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
            />

            <div className="min-w-0 flex-1 break-words">
              <p
                className={cn(
                  'font-medium transition-colors',
                  todo.done && 'text-muted-foreground line-through'
                )}
              >
                {todo.title}
              </p>
              {todo.description && (
                <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
                  {todo.description}
                </p>
              )}
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Edit"
                onClick={() => setEditing(true)}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(todo)}
              >
                <Trash2 />
              </Button>
            </div>
          </>
        )}
      </Card>
    </motion.li>
  )
}

export default TodoItem
