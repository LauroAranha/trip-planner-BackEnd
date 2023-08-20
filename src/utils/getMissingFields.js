export const getMissingFields = (requestBody, requiredFields) => {
    const missingFields = [];

    requiredFields.forEach((field) => {
        if (!requestBody[field]) {
            missingFields.push(field);
        }
    });

    return missingFields;
}