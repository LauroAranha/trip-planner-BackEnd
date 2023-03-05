export const errorHandler = (error) => {
    if (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error code - ${errorCode}: ${errorMessage}`);
    }
};
