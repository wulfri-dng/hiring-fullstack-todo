import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 4000;

try {
  await connectDB(process.env.MONGODB_URI);
} catch (err) {
  console.error(`Could not connect to MongoDB: ${(err as Error).message}`);
  process.exit(1);
}

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
