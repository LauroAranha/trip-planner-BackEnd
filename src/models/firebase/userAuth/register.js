import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { auth } from '../../../config/firebase.js';
import admin from '../../../config/admin.js';
import { addDocInCollection } from '../firebaseOperations.js';
import { errorHandler } from '../../../utils/firebaseErrorHandler.js';
import { logger } from '../../../utils/logger.js';

export const signUp = async (userInformation) => {
    const { email, password } = userInformation;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        logger.info(`User created on auth successfully! ${email}`);

        const userRecord = await admin.auth().getUserByEmail(email);
        let authUid = userRecord.uid;
        console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);

        const storage = getStorage();
        const profilePictureRef = ref(storage, `profile_pictures/${authUid}`);
        await uploadString(profilePictureRef, userInformation.profilepic, 'data_url');
        logger.info(`Profile picture uploaded successfully!`);

        const profilePictureUrl = await getDownloadURL(profilePictureRef);

        await updateProfile(user, {
            photoURL: profilePictureUrl,
        });

        userInformation.profilepic = profilePictureUrl;
        userInformation.userId = authUid;
        await addDocInCollection('users', userInformation);

        return user;
    } catch (error) {
        errorHandler(error);
    }
};
