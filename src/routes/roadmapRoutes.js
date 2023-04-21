import express from 'express';

const router = express.Router();

import { logger } from '../utils/logger.js';
import {
    addRoadmap,
    deleteRoadmap,
    editRoadmapDetails,
    getAllRoadmaps,
    getCurrentUserRoadmaps,
    getRecomendedRoadmaps,
    getRoadmapDetails
} from '../controllers/roadmapController.js';

/**
 * Get all roadmaps that we have in firebase
 * @param {any}
 * @returns {Object} returns all roadmaps that we have in our collection
 */
router.get('/get/all', getAllRoadmaps);

/**
 * Add a roadmap in database
 * @param {any}
 * @returns {Object} returns all roadmaps that we have in our collection
 */
router.post('/add', addRoadmap);

router.get('/recommendedRoadmaps', getRecomendedRoadmaps);

router.delete('/delete/:roadmapId', deleteRoadmap);

router.get('/get/:roadmapId', getRoadmapDetails);

router.get('/getCurrentUserRoadmaps/:userId', getCurrentUserRoadmaps);

router.post('/edit', editRoadmapDetails);

export default router;
