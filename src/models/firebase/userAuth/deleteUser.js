import admin from 'firebase-admin';
import { deleteDocumentInCollection } from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';
import { logger } from '../../../utils/logger.js';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../../../config/firebase.js';

export const deleteUserFA = async (userId) => {
    try {
        await admin.auth().deleteUser(userId);
        console.log('Successfully deleted user from Authentication');

        const docRef = collection(db, 'users');
        const emailQuery = query(docRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(emailQuery);

        querySnapshot.forEach(async (doc) => {
            console.log(doc.id);
            const uid = doc.id;
            await deleteDocumentInCollection('users', uid);
        });

        console.log('Successfully deleted user from Firestore');
        logger.info('User deleted successfully!');
    } catch (error) {
        errorHandler(error);
    }
};
