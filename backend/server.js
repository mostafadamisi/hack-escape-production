const app = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5001;

console.log('--- STARTING IN LOCAL JSON MODE ---');

app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
    const STORAGE_ROOT = process.env.NODE_ENV === 'production' ? '/app/storage' : require('path').join(process.cwd(), '../storage');
    const DATA_DIR = process.env.DATA_PATH || require('path').join(STORAGE_ROOT, 'data');
    console.log(`[DB] Using persistent JSON storage in ${DATA_DIR}`);
});
