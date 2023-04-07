import { logger } from '../utils/logger.js';

import { listAllDocsFromCollection } from '../models/firebase/firebaseOperations.js'

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

console.log(await getAllTravels)

export { getAllTravels };
