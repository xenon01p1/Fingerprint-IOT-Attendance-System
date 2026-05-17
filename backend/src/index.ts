import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/globalErrorMiddleware.js';
import authRoute from './routes/authRoute.js';
import adminRoute from './routes/adminRoute.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middlewares ===================
app.use(helmet());      // Basic security headers
app.use(cors());        // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Logger
app.use(express.json());

// Routes ========================

app.use('/admin', authRoute);
app.use('/admin', adminRoute);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Fingerprint Admin API is Running' });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});