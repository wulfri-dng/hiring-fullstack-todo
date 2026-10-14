import mongoose from 'mongoose';
import { TITLE_MAX, DESCRIPTION_MAX } from '@todo/shared';

interface TodoDoc {
  title: string;
  description: string;
  done: boolean;
}

const todoSchema = new mongoose.Schema<TodoDoc>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [TITLE_MAX, `Title must be ${TITLE_MAX} characters or less`],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [DESCRIPTION_MAX, `Description must be ${DESCRIPTION_MAX} characters or less`],
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<TodoDoc>('Todo', todoSchema);
