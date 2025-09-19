import { cache } from 'react';
import path from 'node:path';
import { promises as fs } from 'node:fs';

// TODO: maybe add better error handling later?
async function loadMetaFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), 'src', 'meta', filePath);
    const data = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // just return empty object if file doesn't exist
    return {};
  }
}

// simple object check
function isObject(val) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

// quick and dirty deep merge - works for our use case
function merge(...objects) {
  const result = {};
  for (const obj of objects) {
    for (const key in obj) {
      const val = obj[key];
      if (isObject(val)) {
        result[key] = merge(result[key] || {}, val);
      } else if (val !== undefined) {
        result[key] = val;
      }
    }
  }
  return result;
}

// loads meta in this order: en defaults -> lang defaults -> en page -> lang page
export const getMetaContent = cache(async (lang = 'en', page = 'home') => {
  const defaults = await loadMetaFile('en/_defaults.json');
  const langDefaults = await loadMetaFile(`${lang}/_defaults.json`);
  const enPage = await loadMetaFile(`en/${page}.json`);
  const langPage = await loadMetaFile(`${lang}/${page}.json`);
  
  return merge(defaults, langDefaults, enPage, langPage);
});