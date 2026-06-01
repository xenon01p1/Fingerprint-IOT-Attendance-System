import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/globalErrorMiddleware.js';
import authRoute from './routes/authRoute.js';
import adminRoute from './routes/adminRoute.js';
import employeeRoute from './routes/employeeRoute.js';
import attendanceRoute from './routes/attendanceRoute.js';
import logDeviceRoute from './routes/logDeviceRoute.js';
import deviceRoute from './routes/deviceRoute.js';

dotenv.config();

const app: Application = express();
const PORT = 8000;

// Middlewares ===================
app.use(helmet());      // Basic security headers
app.use(cors());        // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Logger
app.use(express.json());

// Routes ========================

app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/employee', employeeRoute);
app.use('/api/attendance', attendanceRoute);
app.use('/api/logDevice', logDeviceRoute);
app.use('/api/device', deviceRoute);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Fingerprint Admin API is Running' });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});