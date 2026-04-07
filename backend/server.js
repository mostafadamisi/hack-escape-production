const app = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5001;

console.log('--- STARTING IN LOCAL JSON MODE ---');

app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
    console.log(`[DB] Using persistent JSON storage in /data`);
});
