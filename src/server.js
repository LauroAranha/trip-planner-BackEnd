import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

import userRoutes from './routes/userRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js'

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/ready', (req, res) => res.status(200).send({ status: 'ok' }));
app.get('/live', (req, res) => res.status(200).send({ status: 'ok' }));

app.use('/user', userRoutes);
app.use('/roadmap', roadmapRoutes);

export default app;
