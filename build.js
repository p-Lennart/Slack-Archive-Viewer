const fs = require('fs');
const path = require('path');

const mapping = require('./mapViewerData')

// Specify the directory to read
const directoryPath = path.join(__dirname, './viewer/VIEWERDATA');
let directoryMap = mapping.mapViewerDataDir(directoryPath);
let dirMapJSON = JSON.stringify(directoryMap, null, 3);

try {
    fs.writeFileSync(path.join(__dirname, './VIEWERDATA_MAP.json'), dirMapJSON);
    console.log('Viewer data map written to ./VIEWERDATA_MAP.json');
} catch (err) {
    return console.error('Unable to write map file: ' + err);
}