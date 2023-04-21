import express from 'express';

const router = express.Router();

import { logger } from '../utils/logger.js';
import {
    addTravel,
    deleteTravel,
    editTravelDetails,
    getAllTravels,
    getCurrentUserTravels,
    getRecomendedTravels,
    getTravelDetails
} from '../controllers/travelController.js';

/**
 * Get all travels that we have in firebase
 * @param {any}
 * @returns {Object} returns all travels that we have in our collection
 */
router.get('/get/all', getAllTravels);

/**
 * Add a travel in database
 * @param {any}
 * @returns {Object} returns all travels that we have in our collection
 */
router.post('/add', addTravel);

router.get('/recommendedTravels', getRecomendedTravels);

router.delete('/delete/:travelId', deleteTravel);

router.get('/get/:travelId', getTravelDetails);

router.get('/getCurrentUserTravels/:userId', getCurrentUserTravels);

router.post('/edit', editTravelDetails);

export default router;
