import { logger } from './logger.js';

export const errorHandler = (error) => {
    if (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        logger.error(`Error code - ${errorCode}: ${errorMessage}`);
    }
};
