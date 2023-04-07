import express from 'express';

const router = express.Router();

import { logger } from '../utils/logger.js';
import { getAllTravels } from '../controllers/travelController.js';

router.get('/get/all', async (req, res) => {
    try {
        const results = await getAllTravels(req.body);
        res.status(results.status).send(results.message);
    } catch (err) {
        logger.error(err);
    }
});

export default router;