/* build.mjs maps the VIEWERDATA directory using mapViewerData.mjs,
and launches a viewing server that reads from the map data */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url'
import { dirname, join } from 'path';
import { createServer } from 'http-server';
import open from 'open';

import { mapViewerData } from './mapViewerData.mjs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Specify the directory to read
const viewerPath = join(__dirname, './server')
const viewerDataPath = join(viewerPath, './VIEWERDATA');

init(process.argv[2] === 'launchOnly');

async function init(launchOnly) {
    if (!launchOnly) {
        let viewerDirMap = await mapViewerData(viewerDataPath, true);
        writeMapJSON(viewerDirMap, viewerPath, './VIEWERDATA_map.json');
    }

    launchViewingServer(8080, viewerPath, './index.htm');
}

function writeMapJSON(mapObj, path, filename) {
    try {
        let mapJSON = JSON.stringify(mapObj, null, 3);
        writeFileSync(join(path, filename), mapJSON);

        console.log(`Viewer data map written to ${join(path, filename)}`);
    } catch (err) {
        throw new Error('Failed to write viewer data map file: ' + err);
    }
}

function launchViewingServer(port, rootPath, appFile) {
    // Start the server
    const server = createServer({ root: rootPath });
    console.log(`Server created to root path ${rootPath}`);
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);

        // Open the application in the browser
        open(join(`http://localhost:${port}`, appFile));
    });
}