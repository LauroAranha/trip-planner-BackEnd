import express from 'express';

const router = express.Router();

import {
    addRoadmap,
    deleteRoadmap,
    editRoadmapDetails,
    getAllRoadmaps,
    getCurrentUserRoadmaps,
    getPublicRoadmaps,
    getRecommendedRoadmaps,
    getRoadmapDetails,
    reportRoadmap
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

router.get('/getRecommendedRoadmaps', getRecommendedRoadmaps);

router.get('/public', getPublicRoadmaps);

router.delete('/delete/:roadmapId', deleteRoadmap);

router.get('/get/:roadmapId', getRoadmapDetails);

router.get('/getCurrentUserRoadmaps/:userId', getCurrentUserRoadmaps);

router.put('/edit', editRoadmapDetails);

router.post('/report', reportRoadmap);

export default router;
