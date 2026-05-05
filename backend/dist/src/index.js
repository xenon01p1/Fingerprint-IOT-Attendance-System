import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
// Middlewares
app.use(helmet()); // Basic security headers
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Logger
app.use(express.json());
// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Fingerprint Admin API is Running' });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
