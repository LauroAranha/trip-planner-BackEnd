import { logger } from '../utils/logger.js';

import {
    addDocInCollection,
    deleteDocumentInCollection,
    listAllDocsFromCollection,
    queryDocumentInCollection,
    updateDocumentInCollection,
} from '../models/firebase/firebaseOperations.js';
import { listDocFromCollectionWithId } from '../models/firebase/firebaseOperations.js';

/**
 * Get all travels
 * @returns {Object} all travels
 */
const getAllTravels = async (req, res) => {
    try {
        const results = await listAllDocsFromCollection('travel');
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
 * Add travel
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
const addTravel = async (req, res) => {
    try {
        const results = await addDocInCollection('travel', req.body);
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
 * Get the recommended travels (basically all travels that have a rating above 200)
 * @returns {Object} all travels linked to certain user
 */
const getRecomendedTravels = async (req, res) => {
    try {
        const results = await queryDocumentInCollection(
            'travel',
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

// TODO Change success and error responses, currently they are only return error no matter what. To confirm if a document was really deleted, check it out in firebase
/**
 * Delete a travel doc using its id
 * @param {Object} payload
 * @param {String} payload.travelId
 * @returns {Object}
 * ```
 * Post example:
 * {
 *     "travelId": "2Rp0A5n0gvhjvMIZ0a34"
 * }
 *
 * ```
 */
export const deleteTravel = async (req, res) => {
    const travelId = req.params.travelId;
    try {
        const results = await deleteDocumentInCollection('travel', travelId);
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
 * Get current user registered travels
 * @param {Object} payload
 * @param {String} payload.currentUserId
 * @returns {Object} all travels linked to certain user
 * ```
 * Post example:
 * {
 *     "currentUserId": "2Rp0A5n0gvhjvMIZ0PfE"
 * }
 *
 * ```
 */
export const getCurrentUserTravels = async (req, res) => {
    const userCreatorId = req.params.userId;
    try {
        const results = await queryDocumentInCollection(
            'travel',
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

const editTravelDetails = async (req, res) => {
    const documentId = req.body.documentId;
    const newDocData = req.body.newDocData;
    try {
        const results = await updateDocumentInCollection(
            'travel',
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

const getTravelDetails = async (req, res) => {
    console.log(req.params);
    const documentId = req.params.travelId;
    try {
        const results = await listDocFromCollectionWithId(
            'travel',
            documentId,
        );
        if (results) {
            res.status(200).send({
                message: 'Travel details found!',
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

export { getAllTravels, addTravel, getRecomendedTravels, editTravelDetails, getTravelDetails };
