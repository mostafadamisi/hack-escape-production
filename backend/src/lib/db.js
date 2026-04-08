const fs = require('fs');
const path = require('path');

const STORAGE_ROOT = process.env.NODE_ENV === 'production' ? '/app/storage' : path.join(process.cwd(), '../storage');
const DATA_DIR = process.env.DATA_PATH || path.join(STORAGE_ROOT, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  
  const syncData = process.env.SYNC_DATA || '';
  const shouldForceSync = syncData === 'all' || syncData.split(',').includes(collection);

  // Auto-seed if file doesn't exist OR force sync is requested
  if (!fs.existsSync(filePath) || shouldForceSync) {
    const defaultPath = path.join(__dirname, '../defaults', `${collection}.json`);
    if (fs.existsSync(defaultPath)) {
      try {
        const content = fs.readFileSync(defaultPath, 'utf8');
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        
        // Log sync reason
        if (shouldForceSync && fs.existsSync(filePath)) {
          console.log(`[DB] Force-syncing ${collection} from updated defaults.`);
        } else {
          console.log(`[DB] Seeded ${collection} from defaults.`);
        }

        fs.writeFileSync(filePath, content);
      } catch (e) {
        console.error(`[DB] Failed to sync ${collection}:`, e);
      }
    } else if (!fs.existsSync(filePath)) {
      return [];
    }
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeData = (collection, data) => {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2));
};

const db = {
  find: (collection) => readData(collection),
  findOne: (collection, query) => {
    const data = readData(collection);
    return data.find(item => Object.keys(query).every(key => item[key] === query[key]));
  },
  create: (collection, item) => {
    const data = readData(collection);
    const newItem = { ...item, _id: Date.now().toString(), createdAt: new Date().toISOString() };
    data.push(newItem);
    writeData(collection, data);
    return newItem;
  },
  update: (collection, query, update) => {
    const data = readData(collection);
    const index = data.findIndex(item => Object.keys(query).every(key => item[key] === query[key]));
    if (index === -1) return null;
    data[index] = { ...data[index], ...update, updatedAt: new Date().toISOString() };
    writeData(collection, data);
    return data[index];
  },
  delete: (collection, query) => {
    const data = readData(collection);
    const filtered = data.filter(item => !Object.keys(query).every(key => item[key] === query[key]));
    writeData(collection, filtered);
    return true;
  }
};

module.exports = db;
