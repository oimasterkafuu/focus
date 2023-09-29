const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cachePath = path.join(__dirname, '..', 'data', 'cache.json');

function checkCache(url, options) {
    if (!fs.existsSync(cachePath)) {
        fs.writeFileSync(cachePath, '{}');
    }

    let content = {};
    try {
        let fileContent = fs.readFileSync(cachePath);
        content = JSON.parse(fileContent);
    } catch (e) {
        fs.writeFileSync(cachePath, '{}');
    }

    let hash = crypto
        .createHash('md5')
        .update(url + JSON.stringify(options))
        .digest('hex');
    return content[hash];
}

async function saveCache(url, options, data) {
    let hash = crypto
        .createHash('md5')
        .update(url + JSON.stringify(options))
        .digest('hex');

    let existsCache = {};
    try {
        let fileContent = fs.readFileSync(cachePath);
        existsCache = JSON.parse(fileContent);
    } catch (e) {
        fs.writeFileSync(cachePath, '{}');
    }

    existsCache[hash] = data;
    fs.writeFileSync(cachePath, JSON.stringify(existsCache));
}

async function fetchWithCache(url, options) {
    let cacheContent = checkCache(url, options);
    if (cacheContent) {
        return cacheContent;
    }

    let response = await fetch(url, options);
    let content = await response.json();

    saveCache(url, options, content);
    return content;
}

module.exports = {
    fetchWithCache
};
