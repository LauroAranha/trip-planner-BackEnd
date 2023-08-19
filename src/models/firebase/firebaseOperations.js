import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    where,
    query
} from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { errorHandler } from '../../utils/firebaseErrorHandler.js';
import { logger } from '../../utils/logger.js';

/** Get all documents from one collection
 * @param {String} firebaseCollectionName
 * @returns {object} returns all data from x collection
 * ```
 * const listAllTrips = await listAllDocsFromCollection('collectionName');
 * listAllTrips;
 * ```
 */
export const listAllDocsFromCollection = async (firebaseCollectionName) => {
    try {
        const getCollection = collection(db, firebaseCollectionName);
        const docsFromCollection = await getDocs(getCollection);
        if (docsFromCollection.docs.length > 0) {
            const docsList = docsFromCollection.docs.map((doc) => doc.data());
            return docsList;
        } else {
            logger.info("No data found")
            return;
        }
    } catch (error) {
        return new Error(error, 'No such collection name. Check if it is correct or if it exists.')
    }
};

/** Get one single documents from one collection that matches with given id
 * @param {String} firebaseCollectionName
 * @param {String} documentId
 * @returns {object} returns the matching document data from x collection
 * ```
 * const listSingleUserDocument = await listDocFromCollectionWithId('user', userId)
 * listSingleUserDocument
 * ```
 */
export const listDocFromCollectionWithId = async (
    firebaseCollectionName,
    documentId,
) => {
    try {
        const getDocument = await doc(db, firebaseCollectionName, documentId);
        const document = await getDoc(getDocument);

        if (document.exists()) {
            return document.data();
        } else {
            logger.info("No data found")
            return;
        }
    } catch (error) {
        errorHandler(error, 'No such collection name. Check if it is correct or if it exists.');
    }
};

//console.log(await listDocFromCollectionWithId('users', '2Rp0A5n0gvhjvMIZ0PfEa'));

/** Add a document with an auto-generated id to certain collection
 * @param {String} firebaseCollectionName
 * @param {object} docData
 * @example
 * ```
 * const addRecommendedTrip = await addDocInCollection('test', {
 *  documentField01: 'Hello',
 *  documentField02: 'world'
 * });
 * addRecommendedTrip;
 * ```
 */
export const addDocInCollection = async (firebaseCollectionName, docData) => {
    try {
        const docRef = await addDoc(collection(db, firebaseCollectionName), {
            ...docData,
        });

        return docRef;
    } catch (error) {
        errorHandler(error);
    }
};

/** Update a document using its id
 * @param {String} firebaseCollectionName
 * @param {String} documentId
 * @param {object} newDocData
 * @example
 * ```
 * const updateTripInformation = await updateDocumentInCollection('test', "6ps5BkZ4O3YIc9b3Lk48", {
 *  documentField01: 'Hello',
 *  documentField02: 'world'
 * });
 * updateTripInformation;
 * ```
 */
export const updateDocumentInCollection = async (
    firebaseCollectionName,
    documentId,
    newDocData,
) => {
    try {
        const targetReference = doc(db, firebaseCollectionName, documentId);
        await updateDoc(targetReference, {
            ...newDocData,
        });

        return 1;
    } catch (error) {
        errorHandler(error);
    }
};

/** Deletes a document using its id
 * @param {String} firebaseCollectionName
 * @param {String} documentId
 * @example
 * ```
 * const deleteDocument = await deleteDocumentInCollection('collectionName', "6ps5BkZ4O3YIc9b3Lk48");
 * deleteDocument;
 * ```
 */
export const deleteDocumentInCollection = async (
    firebaseCollectionName,
    documentId,
) => {
    try {
        const searchForDocument = await listDocFromCollectionWithId(firebaseCollectionName, documentId)

        if (!searchForDocument) {
            throw new Error('No document with the provided ID');
        }

        const targetReference = doc(db, firebaseCollectionName, documentId);
        const docRef = await deleteDoc(targetReference);

        const searchForDocument2 = await listDocFromCollectionWithId(firebaseCollectionName, documentId)
        if (!searchForDocument2) {
            return 1;
        }
        throw new Error('Failed to delete. Check the document ID.')

    } catch (error) {
        errorHandler(error);
    }
};

/** Queries a document using its property, the operator you want and value you want
 * @param {String} firebaseCollectionName
 * @param {String} propertyName
 * @param {String} operator
 * @param {String} value
 * @example
 * ```
 * const query = await queryDocumentInCollection('users', 'age', '>', '50');
 * console.log(query);
 * ```
 */
export const queryDocumentInCollection = async (
    firebaseCollectionName,
    propertyName,
    operator,
    value
) => {
    try {
        const docRef = await collection(db, firebaseCollectionName)
        const queryResult = await query(docRef, where(propertyName, operator, value));
        const querySnapshot = await getDocs(queryResult);
        let queryData = []
        querySnapshot.forEach(async (doc) => {
            let data = doc.data()
            let docId = doc.id
            queryData.push({ ...data, docId })
        });
        return queryData
    } catch (error) {
        errorHandler(error);
    }
};