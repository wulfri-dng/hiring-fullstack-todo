export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 500;

export interface Todo {
  _id: string;
  title: string;
  description: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoInput {
  title: string;
  description?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

export type TodoErrors = Partial<Record<keyof TodoInput, string>>;

export function validateTodo({ title, description = '' }: TodoInput): TodoErrors {
  const errors: TodoErrors = {};

  if (!title.trim()) errors.title = 'Title is required';
  else if (title.trim().length > TITLE_MAX) errors.title = `Title must be ${TITLE_MAX} characters or less`;

  if (description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or less`;
  }

  return errors;
}
