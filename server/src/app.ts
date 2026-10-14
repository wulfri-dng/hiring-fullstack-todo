import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
import { notFoundRoute, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/todos', todoRoutes);

app.use(notFoundRoute);
app.use(errorHandler);

export default app;
