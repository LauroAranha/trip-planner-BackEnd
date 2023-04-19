import admin from 'firebase-admin';
import serviceAccount from '../donotcommit/trip-planner-b0cfe-firebase-adminsdk-e4r7b-d2eb2a11d7.json' assert { type: 'json' };

export default admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});