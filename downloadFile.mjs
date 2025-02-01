/* downloadFile.mjs exports a function to download files from a url,
sanitizing their filenames, and generating the path specified if
it doesn't exist in the file system */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

export async function downloadFile(url, filename, outputDir) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        ensureDir(outputDir);
        
        const sanitizedFilename = sanitizeFilename(filename)
        await fs.promises.writeFile(path.join(outputDir, sanitizedFilename), buffer);

        return sanitizedFilename;
    } catch(err) {
        console.log('Failed url', url);
        console.error(err);
        return false;
    }
}

function sanitizeFilename(filename) {
    const segmented = filename.split('.');
    const name = segmented.slice(0,-1).join('');
    const ext = segmented[segmented.length-1];
    var cleaned = '';

    const clean = [
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
        'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
        '0','1','2','3','4','5','6','7','8','9',
    ];

    for (let i = 0; i<name.length; i++) {
        if (clean.includes(name[i])) {
            cleaned += name[i];
        } else {
            cleaned += '_';
        }
    }

    return cleaned + '.' + ext;
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
}