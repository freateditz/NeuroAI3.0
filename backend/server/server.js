import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import testRoutes from './routes/test.js';
import courseRoutes from './routes/course.js';
import parentRoutes from './routes/parent.js';
import learningRoutes from './routes/learning.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.json({ message: 'NeuroAI API Server', status: 'running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/test', testRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/learning', learningRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
