import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/auth';
import cvRoutes from './api/cv';
import organizationRoutes from './api/organization';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/organization', organizationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});