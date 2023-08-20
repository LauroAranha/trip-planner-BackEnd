import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

export default admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});