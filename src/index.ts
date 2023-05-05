import express from 'express';
import * as mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { errorMiddleware } from './middleware/errorMiddleware';



import authRoutes from './routes/auth';
// import userRoutes from './routes/user';
// import reportRoutes from './routes/report';

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGODB_URI!, { retryWrites: true, w: 'majority' })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/reports', reportRoutes);

app.use(errorMiddleware);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});