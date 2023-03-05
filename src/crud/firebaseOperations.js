import { collection, doc, getDoc, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { errorHandler } from '../utils/firebaseErrorHandler.js';

//TODO Find better location to put these methods.

/** Get all documents from one collection
 * @param {String} firebaseCollectionName
 * @returns {object} returns all data from x collection
 * ```
 * const addRecommendedTrip = await listAllDocsFromCollection('collectionName');
 * addRecommendedTrip;
 * ```
 */
export const listAllDocsFromCollection = async (firebaseCollectionName) => {
    try {
        const getCollection = collection(db, firebaseCollectionName);
        const docsFromCollection = await getDocs(getCollection);
        if (docsFromCollection != []) {
            const docsList = docsFromCollection.docs.map((doc) => doc.data());
            return docsList;
        } else {
            // docsFromCollection will be an empty array in this case
            console.log(
                'No such collection. Check if the collection name is correct.',
            );
        }
    } catch (error) {
        errorHandler(error);
    }
};

/** Get one single documents from one collection that matches with given id
 * @param {String} firebaseCollectionName
 * @param {String} documentId
 * @returns {object} returns the matching document data from x collection
 * ```
 * const listSingleUserDocument = await listDocFromCollectionWithId('user', userId)
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
            // doc.data() will be undefined in this case
            console.log(
                'No such document. Check if the collection or document names are inserted correctly.',
            );
        }
    } catch (error) {
        errorHandler(error);
    }
};

/** Add a document with an auto-generated id to certain collection
 * @param {String} firebaseCollectionName
 * @param {object} docData
 * @returns {object} returns the matching document data from x collection
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