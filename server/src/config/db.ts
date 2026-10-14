import mongoose from 'mongoose';

export async function connectDB(uri: string | undefined) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}
