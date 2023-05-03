import { logger } from '../utils/logger.js';

import {
    addDocInCollection,
    deleteDocumentInCollection,
    listAllDocsFromCollection,
    queryDocumentInCollection,
    updateDocumentInCollection,
} from '../models/firebase/firebaseOperations.js';
import { listDocFromCollectionWithId } from '../models/firebase/firebaseOperations.js';

const removeEmptyAttrs = (obj) => {
    var entries = Object.entries(obj).filter(function (entry) {
        return entry[1] !== '';
    });
    return Object.fromEntries(entries);
};

/**
 * Get all roadmaps
 * @returns {Object} all roadmaps
 */
const getAllRoadmaps = async (req, res) => {
    try {
        const results = await listAllDocsFromCollection('roadmap');
        if (results != undefined || results != null) {
            // Check if results array has data
            res.status(200).send({
                message: 'Data found successfully',
                data: results,
            });
        } else {
            res.status(404).send('No data found');
        }
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

/**
 * Add roadmap
 * @param {Object} payload
 * @param {String} payload.title
 * @param {String} payload.description
 * @param {String} payload.image
 * @param {boolean} payload.criancaOk
 * @param {boolean} payload.petOk
 * @param {String} payload.recomendacaoTransporte
 * @param {String} payload.pontoInicial
 * @param {String} payload.pontoFinal
 * @param {double} payload.custoMedio
 * @param {Object} payload.paradasRecomendadas
 * @param {String} payload.paradasRecomendadas.arrayIndex
 * @returns {String} response message
 * ```
 * Post example:
 * {
 *     "title": "Mockup Roteiro",
 *     "description": "Descrição maneira",
 *     "image": "https://i.pinimg.com/280x280_RS/3f/b5/27/3fb527a657ea80ec279e7b399a112929.jpg",
 *     "cidadeRoteiro": "Sao Paulo",
 *     "pontoInicial": "Ermelino Matarazzo",
 *     "pontoFinal": "Mooca",
 *     "recomendacaoTransporte": "transportePublico",
 *     "custoMedio": "1000",
 *     "petsOk": "true",
 *     "criancaOk": "true",
 *     "paradasRecomendadas": [
 *         "Fatec Zona Leste",
 *         "Delegacia de Polícia",
 *         "Cemitério da Saudade"
 *     ]
 * }
 *
 * ```
 */
const addRoadmap = async (req, res) => {
    try {
        const results = await addDocInCollection('roadmap', req.body);
        if (results) {
            res.status(201).send('Document added succesfully');
        } else {
            res.status(500).send('Error');
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

/**
 * Get the recommended roadmaps (basically all roadmaps that have a rating above 200)
 * @returns {Object} all roadmaps linked to certain user
 */
const getRecomendedRoadmaps = async (req, res) => {
    try {
        const results = await queryDocumentInCollection(
            'roadmap',
            'rating',
            '>=',
            200,
        );
        if (results) {
            res.status(200).send({
                message: 'Data found successfully',
                data: results,
            });
        } else {
            res.status(500).send('Error');
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const getPublicRoadmaps = async (req, res) => {
    try {
        const results = await queryDocumentInCollection(
            'roadmap',
            'visibilidadePublica',
            '==',
            (true || 'true'),
        );
        console.log(results);
        if (results) {
            res.status(200).send({
                message: 'Data found successfully',
                data: results,
            });
        } else {
            res.status(500).send('Error');
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

// TODO Change success and error responses, currently they are only return error no matter what. To confirm if a document was really deleted, check it out in firebase
/**
 * Delete a roadmap doc using its id
 * @param {Object} payload
 * @param {String} payload.roadmapId
 * @returns {Object}
 * ```
 * Post example:
 * {
 *     "roadmapId": "2Rp0A5n0gvhjvMIZ0a34"
 * }
 *
 * ```
 */
const deleteRoadmap = async (req, res) => {
    const roadmapId = req.params.roadmapId;
    try {
        const results = await deleteDocumentInCollection('roadmap', roadmapId);
        if (results) {
            res.status(200).send({
                message: 'Document deleted successfully',
                data: results,
            });
        } else {
            res.status(500).send('Error');
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

/**
 * Get current user registered roadmaps
 * @param {Object} payload
 * @param {String} payload.currentUserId
 * @returns {Object} all roadmaps linked to certain user
 * ```
 * Post example:
 * {
 *     "currentUserId": "2Rp0A5n0gvhjvMIZ0PfE"
 * }
 *
 * ```
 */
const getCurrentUserRoadmaps = async (req, res) => {
    const userCreatorId = req.params.userId;
    try {
        const results = await queryDocumentInCollection(
            'roadmap',
            'userCreatorId',
            '==',
            userCreatorId,
        );
        if (results) {
            res.status(200).send({
                message: 'Data found successfully',
                data: results,
            });
        } else {
            res.status(500).send('Error');
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const editRoadmapDetails = async (req, res) => {
    const documentId = req.body.documentId;
    const newDocData = removeEmptyAttrs(req.body.newDocData);

    try {
        const results = await updateDocumentInCollection(
            'roadmap',
            documentId,
            newDocData,
        );
        if (results) {
            res.status(200).send({
                message: 'Update made successfully',
                data: results,
            });
        } else {
            res.status(500).send('Error');
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const editUserRating = async (req, res) => {
    const { documentId, feedback } = req.body
    const getDocument = await listDocFromCollectionWithId(
        'roadmap',
        documentId,
    );
    const currentRating = getDocument.rating

    let newRating;

    // 0 -> undefined; 1 -> like; 2 -> dislike
    // I didnt use a switch statement here because it was causing strange behaviours
    if (feedback === 0) {
        console.log('we have to implement it.');
    } else if (feedback === 1) {
        newRating = currentRating + 1;
    } else if (feedback === 2) {
        newRating = currentRating - 1;
    }

    const results = await updateDocumentInCollection(
        'roadmap',
        documentId,
        { rating: newRating },
    );

    try {
        if (results) {
            res.status(200).send({
                message: 'Feedback sent successfully!',
                data: results,
            });
        } else {
            res.status(500).send('Error');
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

const getRoadmapDetails = async (req, res) => {
    const documentId = req.params.roadmapId;
    try {
        const results = await listDocFromCollectionWithId(
            'roadmap',
            documentId,
        );
        if (results) {
            res.status(200).send({
                message: 'Roadmap details found!',
                data: results,
            });
        } else {
            res.status(404).send({
                message: 'Roadmap details found!',
            });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
};

export {
    getAllRoadmaps,
    addRoadmap,
    getRecomendedRoadmaps,
    deleteRoadmap,
    getCurrentUserRoadmaps,
    editRoadmapDetails,
    getRoadmapDetails,
    getPublicRoadmaps,
    editUserRating
};
