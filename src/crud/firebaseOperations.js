import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { errorHandler } from '../utils/firebaseErrorHandler.js';

//TODO Find better location to put these methods.

/** Get all documents from one collection
 * @param {String} collection
 * @returns {object} returns all data from x collection
 */
export const listAllDocsFromCollection = async (fCollection) => {
    try {
        const getCollection = collection(db, fCollection);
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
 * @param {String} collection
 * @param {String} documentId
 * @returns {object} returns the matching document data from x collection
 */
export const listDocFromCollectionWithId = async (fCollection, docId) => {
    try {
        const getDocument = await doc(db, fCollection, docId);
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
