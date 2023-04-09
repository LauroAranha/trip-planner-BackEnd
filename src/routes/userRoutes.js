import express from 'express';
import {
    editUser,
    getUser,
    loginUser,
    registerUser,
    deleteUser,
} from '../controllers/userController.js';
import { deleteUserFA } from '../models/firebase/userAuth/deleteUser.js';
import { editUserFA } from '../models/firebase/userAuth/editUser.js';

const router = express.Router();

import { logger } from '../utils/logger.js';

router.post('/register', async (req, res) => {
    try {
        const results = await registerUser(req.body);
        res.status(results.status).send(results.message);
    } catch (err) {
        logger.error(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const results = await loginUser(req.body);
        res.status(results.status).send(JSON.stringify(results.data));
    } catch (err) {
        logger.error(err);
    }
});

router.put('/edit', async (req, res) => {
    try {
        const results = await editUserFA(req.body);
        res.status(results.status).send(results.message);
    } catch (err) {
        logger.error(err);
    }
});

router.get('/get', async (req, res) => {
    try {
        const results = await getUser(req.body);
        res.status(results.status).send(results.message);
    } catch (err) {
        logger.error(err);
    }
});

router.post('/delete', async (req, res) => {
    try {
        const results = await deleteUserFA(req.body);
        res.status(results.status).send(results.message);
    } catch (err) {
        logger.error(err);
    }
});
export default router;
