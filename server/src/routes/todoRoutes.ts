import { Router } from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  toggleDone,
  deleteTodo,
} from '../controllers/todoController.js';

const router = Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.patch('/:id/done', toggleDone);
router.delete('/:id', deleteTodo);

export default router;
