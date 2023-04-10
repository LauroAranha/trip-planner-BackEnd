import { logger } from '../utils/logger.js';

import { addDocInCollection, deleteDocumentInCollection, listAllDocsFromCollection, queryDocumentInCollection } from '../models/firebase/firebaseOperations.js'

const getAllTravels = async () => {
    try {
        const results = await listAllDocsFromCollection('travel');
        console.log(await results);
        if (results) {
            return {
                status: 200,
                message: 'Data found successfully',
                data: results
            };
        } else {
            return {
                status: 404,
                message: "Any data found",
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

const addTravel = async (payload) => {
    try {
        const results = await addDocInCollection('travel', payload);
        if (results) {
            return {
                status: 200,
                message: "Document added succesfully",
            };
        } else {
            return {
                status: 500,
                message: "Error",
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

const getRecomendedTravels = async (payload) => {
    try {
        const results = await queryDocumentInCollection('travel', 'rating', '>=', 200)
        if (results) {
            return {
                status: 200,
                message: "Query made succesfully",
                data: results
            };
        } else {
            return {
                status: 500,
                message: "Error",
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

export const deleteTravel = async (payload) => {
    const travelId = payload.documentId
    try {
        const results = await deleteDocumentInCollection('travel', travelId)
        if (results) {
            return {
                status: 200,
                message: "Document deleted succesfully",
            };
        } else {
            return {
                status: 500,
                message: "Document was not deleted",
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

export const getCurrentUserTravels = async (payload) => {
    const currentUserId = payload.currentUserId
    try {
        const results = await queryDocumentInCollection('travel', 'userCreatorId', '==', currentUserId)
        if (results) {
            return {
                status: 200,
                message: "Query made succesfully",
                data: results
            };
        } else {
            return {
                status: 500,
                message: "Error",
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


export { getAllTravels, addTravel, getRecomendedTravels };
