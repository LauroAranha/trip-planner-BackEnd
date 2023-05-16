import { logger } from './logger.js';


/**
 * Error hand
 * @param {Error} error
 * @param {String} customMessage
 * @returns {any}
 */
export const errorHandler = (error, customMessage) => {
    customMessage ? customMessage : '';
    const errorCode = error && error.code ? error.code : 'Unknown Error';
    const errorMessage = error && error.message ? error.message : 'Unknown Error';
    console.error(`logger - Error code (${errorCode}): ${errorMessage}`);
    throw new Error(`${customMessage}`);
};
