import express from 'express';

const router = express.Router();

import { logger } from '../utils/logger.js';

router.post('/create', (req, res) => {
    res.send('create');
});

router.get('/getLogin', (req, res) => {
    res.send('getLogin');
});

export default router;
