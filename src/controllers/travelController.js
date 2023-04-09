import { logger } from '../utils/logger.js';

import { addDocInCollection, listAllDocsFromCollection } from '../models/firebase/firebaseOperations.js'

const getAllTravels = async () => {
    try {
        const results = await listAllDocsFromCollection('travel');
        console.log(await results);
        if (results) {
            return {
                status: 200,
                message: JSON.stringify(results),
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

export { getAllTravels, addTravel };
