import { logger } from '../utils/logger.js';

import {
    addDocInCollection,
    deleteDocumentInCollection,
    listAllDocsFromCollection,
    queryDocumentInCollection,
    updateDocumentInCollection,
} from '../models/firebase/firebaseOperations.js';

/**
 * Get all travels
 * @returns {Object} all travels
 */
const getAllTravels = async () => {
    try {
        const results = await listAllDocsFromCollection('travel');
        console.log(await results);
        if (results) {
            return {
                status: 200,
                message: 'Data found successfully',
                data: results,
            };
        } else {
            return {
                status: 404,
                message: 'Any data found',
            };
        }
    } catch (err) {
        logger.error(err);
        return {
            status: 500,
            message: err,
        };
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
const addTravel = async (payload) => {
    try {
        const results = await addDocInCollection('travel', payload);
        if (results) {
            return {
                status: 200,
                message: 'Document added succesfully',
            };
        } else {
            return {
                status: 500,
                message: 'Error',
            };
        }
    } catch (err) {
        logger.error(err);
        return {
            status: 500,
            message: err,
        };
    }
};

/**
 * Get the recommended travels (basically all travels that have a rating above 200)
 * @returns {Object} all travels linked to certain user
 */
const getRecomendedTravels = async () => {
    try {
        const results = await queryDocumentInCollection(
            'travel',
            'rating',
            '>=',
            200,
        );
        if (results) {
            return {
                status: 200,
                message: 'Query made succesfully',
                data: results,
            };
        } else {
            return {
                status: 500,
                message: 'Error',
            };
        }
    } catch (err) {
        logger.error(err);
        return {
            status: 500,
            message: err,
        };
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
export const deleteTravel = async (payload) => {
    const travelId = payload.travelId;
    try {
        const results = await deleteDocumentInCollection('travel', travelId);
        if (results) {
            return {
                status: 200,
                message: 'Document deleted succesfully',
            };
        } else {
            return {
                status: 500,
                message:
                    'Document was not deleted, check if it exists or if the ID was inserted correctly',
            };
        }
    } catch (err) {
        logger.error(err);
        return {
            status: 500,
            message: err,
        };
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
export const getCurrentUserTravels = async (payload) => {
    const userCreatorId = payload.userCreatorId;
    console.log(payload);
    try {
        const results = await queryDocumentInCollection(
            'travel',
            'userCreatorId',
            '==',
            userCreatorId,
        );
        if (results) {
            return {
                status: 200,
                message: 'Query made succesfully',
                data: results,
            };
        } else {
            return {
                status: 500,
                message: 'Error',
            };
        }
    } catch (err) {
        logger.error(err);
        return {
            status: 500,
            message: err,
        };
    }
};

const editTravelDetails = async (payload) => {
    const documentId = payload.documentId;
    const newDocData = payload.newDocData;
    console.log(payload);
    try {
        const results = await updateDocumentInCollection(
            'travel',
            documentId,
            newDocData,
        );
        if (results) {
            return {
                status: 200,
                message: 'Update made succesfully',
                data: results,
            };
        } else {
            return {
                status: 500,
                message: 'Error',
            };
        }
    } catch (err) {
        logger.error(err);
        return {
            status: 500,
            message: err,
        };
    }
};

export { getAllTravels, addTravel, getRecomendedTravels, editTravelDetails };
