import { db } from './firebase.js';
import { collection, doc, getDocs } from 'firebase/firestore';

/**
 * @param {String} collection
 * @returns {object} returns all data from x collection
 */
export const listAllDocsFromCollection = async (collection) => {
    const getCollection = collection(db, collection);
    const docsFromCollection = await getDocs(getCollection);
    const docsList = docsFromCollection.docs.map((doc) => doc.data());
    console.log(docsList);
    return docsList;
};

/**
 * @param {String} documentId
 * @param {String} collection
 * @returns {object} returns the matching document data from x collection
 */
export const listDocFromCollectionWithId = async (docId, collection) => {
    return doc(db, collection, docId);
};
