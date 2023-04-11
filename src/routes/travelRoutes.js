import express from 'express';

const router = express.Router();

import { logger } from '../utils/logger.js';
import { addTravel, deleteTravel, getAllTravels, getCurrentUserTravels, getRecomendedTravels } from '../controllers/travelController.js';


/**
 * Get all travels that we have in firebase
 * @param {any}
 * @returns {Object} returns all travels that we have in our collection
 */
router.get('/get/all', async (req, res) => {
    try {
        const results = await getAllTravels(req.body);
        res.status(results.status).send(results);
    } catch (err) {
        logger.error(err);
    }
});


/**
 * Add a travel in database
 * @param {any}
 * @returns {Object} returns all travels that we have in our collection
 */
router.post('/add', async (req, res) => {
    try {
        const results = await addTravel(req.body);
        res.status(results.status).send(results);
    } catch (err) {
        logger.error(err);
    }
});

router.get('/recommendedTravels', async (req, res) => {
    try {
        const results = await getRecomendedTravels(req.body);
        res.status(results.status).send(results);
    } catch (err) {
        logger.error(err);
    }
});

router.post('/delete', async (req, res) => {
    try {
        const results = await deleteTravel(req.body);
        res.status(results.status).send(results);
    } catch (err) {
        logger.error(err);
    }
});

router.post('/getCurrentUserTravels', async (req, res) => {
    try {
        const results = await getCurrentUserTravels(req.body);
        res.status(results.status).send(results);
    } catch (err) {
        logger.error(err);
    }
});

export default router;