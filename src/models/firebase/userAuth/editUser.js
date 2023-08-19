import {
    deleteUser,
    signInWithCustomToken,
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../../../config/firebase.js';
import { updateDocumentInCollection } from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';
import { logger } from '../../../utils/logger.js';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';

/**
 * Description
 * @param {any} payload
 * @returns {any}
 */
export const editUserFA = async (payload) => {
    const token = payload.headers.auth;
    const userNewInfo = payload.body;

    try {
        const { email, docId, name, profilepic, password, userId } = userNewInfo;

        await signInWithCustomToken(auth, token);
        const currentUser = await auth.currentUser;
        logger.info(userId)

        if (name) {
            try {
                await updateProfile(currentUser, {
                    displayName: name,
                });
                logger.info('Name updated successfully');
            } catch (error) {
                errorHandler(error, 'Failed changing display name');
            }
        }

        if (profilepic) {
            try {
                // Upload the new profile picture to Firebase Storage
                const storage = getStorage();
                const profilePictureRef = ref(storage, `profile_pictures/${userId}`);
                await uploadString(profilePictureRef, profilepic, 'data_url');

                // Get the download URL of the uploaded image
                const downloadURL = await getDownloadURL(profilePictureRef);

                // Update the user's photo URL
                await updateProfile(currentUser, {
                    photoURL: downloadURL,
                });

                logger.info('Image updated successfully');
            } catch (error) {
                errorHandler(error, 'Failed changing profile picture');
            }
        }

        if (email) {
            try {
                await updateEmail(currentUser, email);
                logger.info('Email updated, now it\'s: ' + email);
            } catch (error) {
                errorHandler(error);
                throw new Error(error);
            }
        }

        if (password) {
            try {
                await updatePassword(currentUser, password);
                logger.info('Password updated, now it\'s: ' + password);
            } catch (error) {
                errorHandler(error, 'Failed changing password');
            }
        }

        await updateDocumentInCollection('users', docId, userNewInfo);

        return true;
    } catch (error) {
        errorHandler(error);
    }
};
