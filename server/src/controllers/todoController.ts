import type { Request, Response } from 'express';
import type { TodoInput } from '@todo/shared';
import Todo from '../models/Todo.js';

type IdParams = { id: string };

function notFound(res: Response) {
  return res.status(404).json({ message: 'Todo not found' });
}

export async function getTodos(req: Request, res: Response) {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
}

export async function createTodo(req: Request<{}, unknown, Partial<TodoInput>>, res: Response) {
  const { title, description } = req.body ?? {};
  const todo = await Todo.create({ title, description });
  res.status(201).json(todo);
}

export async function updateTodo(
  req: Request<IdParams, unknown, Partial<TodoInput>>,
  res: Response
) {
  const { title, description } = req.body ?? {};

  const todo = await Todo.findById(req.params.id);
  if (!todo) return notFound(res);

  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;

  await todo.save();
  res.json(todo);
}

export async function toggleDone(req: Request<IdParams>, res: Response) {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return notFound(res);

  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
}

export async function deleteTodo(req: Request<IdParams>, res: Response) {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) return notFound(res);

  res.status(204).end();
}
