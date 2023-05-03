import express from 'express';

const router = express.Router();

import { logger } from '../utils/logger.js';
import {
    addRoadmap,
    deleteRoadmap,
    editRoadmapDetails,
    editUserRating,
    getAllRoadmaps,
    getCurrentUserRoadmaps,
    getPublicRoadmaps,
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

router.get('/public', getPublicRoadmaps);

router.delete('/delete/:roadmapId', deleteRoadmap);

router.get('/get/:roadmapId', getRoadmapDetails);

router.get('/getCurrentUserRoadmaps/:userId', getCurrentUserRoadmaps);

router.put('/edit', editRoadmapDetails);

router.put('/edit/feedback', editUserRating);

export default router;
