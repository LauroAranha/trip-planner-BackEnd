import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const router = express.Router();

import { logger } from '../utils/logger.js';

router.post('/register', (req, res) => {
    try {
        const results = registerUser(req.body);
        res.status(results.status).send(results.message);
    } catch (err) {
        logger.error('Deu erro na rota');
    }
});

router.post('/login', (req, res) => {
    try {
        const results = loginUser(req.body);
        res.status(results.status).send(results.message);
    } catch (err) {
        logger.error('Deu erro na rota');
    }
});

export default router;
