import * as dotenv from 'dotenv';

dotenv.config();

import app from './server.js';

import { logger } from './utils/logger.js';

const port = process.env.PORT || 8080;

app.listen(port, async () => {
    logger.info(`Running service on port ${port}`);
});
