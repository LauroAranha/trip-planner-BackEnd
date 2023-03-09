import express from 'express';
import cors from 'cors';

const app = express();

import userRoutes from './routes/userRoutes.js';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/ready', (req, res) => res.status(200).send({ status: 'ok' }));
app.get('/live', (req, res) => res.status(200).send({ status: 'ok' }));

app.use('/user', userRoutes);

export default app;
