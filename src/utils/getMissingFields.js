export const getMissingFields = (requestBody, requiredFields) => {
    const missingFields = [];

    requiredFields.forEach((field) => {
        if (requestBody[field] === null || requestBody === undefined) {
            missingFields.push(field);
        }
    });

    return missingFields;
}