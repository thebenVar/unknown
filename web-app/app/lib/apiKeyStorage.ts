/**
 * Secure client-side API key storage using Web Crypto API
 * Keys are encrypted before storing in localStorage
 */

const STORAGE_KEY = 'skhoolar_encrypted_api_keys';
const ENCRYPTION_KEY_NAME = 'skhoolar_encryption_key';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Generate or retrieve encryption key from IndexedDB
async function getEncryptionKey(): Promise<CryptoKey> {
  if (!isBrowser) {
    throw new Error('Encryption only available in browser');
  }

  // Try to get existing key from IndexedDB
  const db = await openDB();
  const existingKey = await getKeyFromDB(db);
  
  if (existingKey) {
    return existingKey;
  }

  // Generate new key if none exists
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );

  await saveKeyToDB(db, key);
  return key;
}

// Simple IndexedDB wrapper for key storage
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open('SkhoolarKeyStore', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('keys')) {
        db.createObjectStore('keys');
      }
    };
  });
}

async function getKeyFromDB(db: IDBDatabase): Promise<CryptoKey | null> {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(['keys'], 'readonly');
      const store = transaction.objectStore('keys');
      const request = store.get(ENCRYPTION_KEY_NAME);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        if (request.result) {
          crypto.subtle.importKey(
            'jwk',
            request.result,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
          ).then(resolve).catch(reject);
        } else {
          resolve(null);
        }
      };
    } catch (error) {
      reject(error);
    }
  });
}

async function saveKeyToDB(db: IDBDatabase, key: CryptoKey): Promise<void> {
  const exportedKey = await crypto.subtle.exportKey('jwk', key);
  
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(['keys'], 'readwrite');
      const store = transaction.objectStore('keys');
      const request = store.put(exportedKey, ENCRYPTION_KEY_NAME);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Encrypt data
async function encrypt(data: string, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(data);
  
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encodedData
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

// Decrypt data
async function decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data
  );

  return new TextDecoder().decode(decryptedData);
}

export interface APIKeyData {
  provider: 'openai' | 'gemini' | 'custom';
  apiKey: string;
  endpoint?: string; // For custom providers
  model?: string;
}

// Store API key securely
export async function storeAPIKey(data: APIKeyData): Promise<void> {
  if (!isBrowser) {
    console.error('Cannot store API key: not in browser environment');
    return;
  }

  try {
    const key = await getEncryptionKey();
    const jsonData = JSON.stringify(data);
    const encryptedData = await encrypt(jsonData, key);
    
    localStorage.setItem(STORAGE_KEY, encryptedData);
    console.log('API key stored successfully');
  } catch (error) {
    console.error('Failed to store API key:', error);
    throw new Error('Failed to securely store API key');
  }
}

// Retrieve API key
export async function getAPIKey(): Promise<APIKeyData | null> {
  if (!isBrowser) {
    return null;
  }

  try {
    const encryptedData = localStorage.getItem(STORAGE_KEY);
    if (!encryptedData) {
      console.log('No encrypted API key found');
      return null;
    }

    const key = await getEncryptionKey();
    const decryptedData = await decrypt(encryptedData, key);
    const result = JSON.parse(decryptedData);
    console.log('API key retrieved successfully');
    return result;
  } catch (error) {
    console.error('Failed to retrieve API key:', error);
    return null;
  }
}

// Remove API key
export function clearAPIKey(): void {
  if (!isBrowser) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  console.log('API key cleared');
}

// Check if API key exists
export function hasAPIKey(): boolean {
  if (!isBrowser) {
    return false;
  }
  return localStorage.getItem(STORAGE_KEY) !== null;
}
