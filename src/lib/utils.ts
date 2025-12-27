import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Simple object path accessor
// Simple object path accessor with support for keys containing dots
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNestedValue(obj: any, path: string) {
  if (!path || !obj) return obj;
  if (path in obj) return obj[path]; // Direct match

  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length; i++) {
    if (current === undefined || current === null) return undefined;
    
    // 1. Try standard key
    if (keys[i] in current) {
        current = current[keys[i]];
        continue;
    }

    // 2. Lookahead for keys with dots (e.g., "05. price")
    let joinedKey = keys[i];
    let found = false;
    for (let j = i + 1; j < keys.length; j++) {
        joinedKey += '.' + keys[j];
        if (joinedKey in current) {
            current = current[joinedKey];
            i = j; // Skip consumed parts
            found = true;
            break;
        }
    }
    
    if (!found) return undefined;
  }
  
  return current;
}

export type FlattenedField = {
  path: string;
  value: any;
  type: string;
};

// Recursive function to flatten object into paths
export function flattenObject(obj: any, prefix = '', res: FlattenedField[] = []) {
  if (!obj || typeof obj !== 'object') {
     return res;
  }

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newPath = prefix ? `${prefix}.${key}` : key;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
       flattenObject(value, newPath, res);
    } else {
       res.push({
         path: newPath,
         value: Array.isArray(value) ? `Array[${value.length}]` : value,
         type: Array.isArray(value) ? 'array' : typeof value
       });
    }
  });
  return res;
}
