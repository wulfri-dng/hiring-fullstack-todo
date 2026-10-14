import type { KeyboardEvent } from 'react'
import { DESCRIPTION_MAX, TITLE_MAX, type TodoErrors } from '@todo/shared'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface TodoValues {
  title: string
  description: string
}

interface Props {
  values: TodoValues
  errors: TodoErrors
  onChange: (values: TodoValues) => void
  onKeyDown?: (e: KeyboardEvent) => void
  autoFocus?: boolean
}

function CharCount({ length, max }: { length: number; max: number }) {
  if (length < max * 0.8) return null
  return (
    <span className={cn('text-xs text-muted-foreground', length > max && 'text-destructive')}>
      {length}/{max}
    </span>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}

function TodoFields({ values, errors, onChange, onKeyDown, autoFocus }: Props) {
  return (
    <div className="flex flex-col gap-2" onKeyDown={onKeyDown}>
      <div className="flex flex-col gap-1">
        <Input
          placeholder="What needs to be done?"
          aria-label="Title"
          aria-invalid={!!errors.title}
          value={values.title}
          autoFocus={autoFocus}
          onChange={(e) => onChange({ ...values, title: e.target.value })}
        />
        <div className="flex justify-between gap-2">
          <FieldError message={errors.title} />
          <span className="ml-auto">
            <CharCount length={values.title.trim().length} max={TITLE_MAX} />
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Textarea
          placeholder="Description (optional)"
          aria-label="Description"
          aria-invalid={!!errors.description}
          rows={2}
          value={values.description}
          onChange={(e) => onChange({ ...values, description: e.target.value })}
        />
        <div className="flex justify-between gap-2">
          <FieldError message={errors.description} />
          <span className="ml-auto">
            <CharCount length={values.description.trim().length} max={DESCRIPTION_MAX} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default TodoFields
