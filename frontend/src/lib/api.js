const IS_SERVER = typeof window === 'undefined';
const BASE_URL = IS_SERVER ? 'http://localhost:5001/api' : '/api';

const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },
    
    post: async (endpoint, data) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }
        return response.json();
    },
    
    put: async (endpoint, data) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }
        return response.json();
    },
    
    delete: async (endpoint) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }
        if (!response.ok) throw new Error('API delete failed');
        return response.json();
    },

    postForm: async (endpoint, formData) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // Content-Type is auto-set by the browser for FormData
            body: formData
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }
        return response.json();
    },

    putForm: async (endpoint, formData) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }, // Content-Type is auto-set by the browser for FormData
            body: formData
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Unauthorized');
        }
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }
        return response.json();
    }
};

export const fetchData = async (collection, locale = 'en') => {
    try {
        const formattedCollection = collection.startsWith('/') ? collection : '/' + collection;
        const response = await fetch(`${BASE_URL}${formattedCollection}`);
        if (!response.ok) return [];
        const data = await response.json();
        
        const processItem = (item) => {
            const newItem = { ...item };
            Object.keys(newItem).forEach(key => {
                if (newItem[key] && typeof newItem[key] === 'object' && newItem[key][locale]) {
                    newItem[key] = newItem[key][locale];
                }
            });
            return newItem;
        };

        if (Array.isArray(data)) {
            return data.map(processItem).sort((a, b) => (a.order || 0) - (b.order || 0));
        } else if (data && typeof data === 'object') {
            return processItem(data);
        }
        return data;
    } catch (err) {
        console.error(`Fetch error for ${collection}:`, err);
        return [];
    }
};
