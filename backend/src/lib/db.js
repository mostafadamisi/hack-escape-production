const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_PATH || path.join(__dirname, '../../storage/data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  
  // Auto-seed if file doesn't exist
  if (!fs.existsSync(filePath)) {
    const defaultPath = path.join(__dirname, '../defaults', `${collection}.json`);
    if (fs.existsSync(defaultPath)) {
      try {
        const content = fs.readFileSync(defaultPath, 'utf8');
        fs.writeFileSync(filePath, content);
        console.log(`[DB] Seeded ${collection} from defaults.`);
      } catch (e) {
        console.error(`[DB] Failed to seed ${collection}:`, e);
      }
    } else {
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
