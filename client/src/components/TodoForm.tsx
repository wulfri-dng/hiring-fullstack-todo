import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { validateTodo, type TodoInput } from '@todo/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TodoFields, { type TodoValues } from './TodoFields'

const EMPTY: TodoValues = { title: '', description: '' }

interface Props {
  onAdd: (todo: TodoInput) => Promise<boolean>
}

function TodoForm({ onAdd }: Props) {
  const [values, setValues] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  const errors = submitted ? validateTodo(values) : {}

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (Object.keys(validateTodo(values)).length > 0) {
      setSubmitted(true)
      return
    }

    setSaving(true)
    const added = await onAdd({ title: values.title.trim(), description: values.description.trim() })
    setSaving(false)

    if (added) {
      setValues(EMPTY)
      setSubmitted(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
          <TodoFields values={values} errors={errors} onChange={setValues} />
          <Button type="submit" className="self-end" disabled={saving}>
            <Plus />
            {saving ? 'Adding...' : 'Add todo'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default TodoForm
