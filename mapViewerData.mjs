/* mapViewerData.mjs reads the VIEWERDATA directory,
checks if its contents are a valid archive, 
creates a map of the archive files,
and downloads any attatchments contained in messages */

import fs from 'fs';
import path from 'path';
import { downloadFile } from './downloadFile.mjs'

export async function mapViewerData(rootPath, downloadFiles) {
    const rootMap = {};
    var rootEntries = [];

    try {
        rootEntries = fs.readdirSync(rootPath, { withFileTypes: true });
    } catch (err) {
        throw new Error('Unable to scan viewer directory: ' + err);
    }
    
    if (rootEntries.length != 1) {
        throw new Error('VIEWERDATA must contain a single archive directory. It is currently empty or containing multiple contents.');
    }
    
    const archive = rootEntries[0];
    const archiveName = archive.name;

    if (!archive.isDirectory() || archive.isFile()) {
        throw new Error('VIEWERDATA must contain a single archive directory. It currently contains a file.');
    }

    if (!archiveName.includes(" Slack export ")) {
        throw new Error('The single archive directory VIEWERDATA contains must match Slack archive naming convention.');
    }

    const archivePath = path.join(rootPath, archiveName);
    rootMap[archiveName] = await mapArchiveDir(archivePath, downloadFiles);
    return rootMap;

}

async function mapArchiveDir(archivePath, downloadFiles) {
    const archiveMap = {};
    var archiveEntries = [];

    try {
        archiveEntries = fs.readdirSync(archivePath, { withFileTypes: true });
    } catch (err) {
        throw new Error('Unable to scan archive directory: ' + err);
    }
    
    for (const entry of archiveEntries) {
        const entryName = entry.name;
        const entryPath = path.join(archivePath, entry.name);

        if (entry.isFile()) {
            if (entryName.endsWith('.json')) {
                archiveMap[entryName] = 'JSON';
            } else {
                throw new Error(`Archive directory ${archivePath} must contain only folders and JSON files, but contains file '${entryName}'`);
            }
        } else if (entry.isDirectory()) {
            if (entryName === 'VIEWERDATA_FILES') {
                archiveMap[entryName] = await mapViewerDataFiles(entryPath);
            } else {
                archiveMap[entryName] = await mapChannelDir(entryPath, downloadFiles);
            }
        }
    }

    let archiveMapKeys = Object.keys(archiveMap);

    ['channels.json', 'users.json'].forEach(entry => {
        if (!archiveMapKeys.includes(entry)) {
            throw new Error(`Archive directory ${archivePath} is missing critial JSON file ${entry}`);
        }
    });

    return archiveMap;
}

async function mapViewerDataFiles(channelPath) {
    const viewerDataFileMap = {}
    var fileEntries = []
    
    try {
        fileEntries = fs.readdirSync(channelPath, { withFileTypes: true });
    } catch (err) {
        throw new Error('Unable to scan files directory: ' + err);
    }
    
    for (const entry of fileEntries) {
        const entryName = entry.name;
        
        if (entry.isFile() || !entry.isDirectory()) {
            throw new Error(`Channel directory ${channelPath} must contain only folders, but contains file '${entryName}'`);
        }

        try {
            const entryContents = fs.readdirSync(path.join(channelPath, entryName), { withFileTypes: true });
    
            if (entryContents.length != 1) {
                throw new Error(`File folder ${entryName} must have one file, but has multiple/no contents`);
            }
    
            let containedFile = entryContents[0];
            if (containedFile.isDirectory() || !containedFile.isFile()) {
                throw new Error(`Content of file folder ${entryName} isn't a file: '${containedFile.name}'`);
            }
    
            viewerDataFileMap[entryName] = containedFile.name;

        } catch (err) {
            throw new Error('Unable to scan file folder contents: ' + err);
        }
    }

    return viewerDataFileMap;
}


async function mapChannelDir(channelPath, downloadFiles) {
    const channelMap = {}
    var channelEntries = []
    
    try {
        channelEntries = fs.readdirSync(channelPath, { withFileTypes: true });
    } catch (err) {
        throw new Error('Unable to scan channel directory: ' + err);
    }
    
    for (const entry of channelEntries) {
        const entryName = entry.name;
        
        if (entry.isDirectory() || !entry.isFile()) {
            throw new Error(`Channel directory ${channelPath} must contain only JSON files, but contains folder '${entryName}'`);
        } else if (!entryName.endsWith('.json')) {
            throw new Error(`Channel directory ${channelPath} must contain only JSON files, but contains file '${entryName}'`);
        }

        let messagesData = fs.readFileSync(path.join(channelPath, entryName));
        let messages = JSON.parse(messagesData);

        channelMap[entryName] = await processMessages(channelPath, messages, entryName, downloadFiles);
    }

    return channelMap;
}

async function processMessages(channelPath, messages, messageGroupName, downloadFiles) {
    const archivePath = path.dirname(channelPath);
    const channelName = path.basename(channelPath);

    const writtenFiles = {};
    var count = 0;

    for (let m of messages) {
        if (m.files) {
            var fileCount = 0;
            for (let file of m.files) {
                console.log(`${channelName} | ${messageGroupName} ${count+1}/${messages.length} | Downloading file ${fileCount+1}/${m.files.length}: ${file.name}`);
                writtenFiles[file.id] = await processMessageFile(archivePath, channelName, file);
                fileCount += 1;
            }
        }
        count += 1;
    }
    
    const messageEntry = {
        count: count,
    }

    if (downloadFiles && Object.values(writtenFiles).length > 0) {
        messageEntry.files = writtenFiles;
    }
    
    return messageEntry;
}

async function processMessageFile(archivePath, channelName, file) {
    let result = [];
    let downloadUrls = [
        file.url_private_download,
    ];

    file.VIEWERDATA = {
        channel: channelName,
        writtenPaths: [],
    }

    for (let url of downloadUrls) {
        if (!url) {
            console.log('Skipping missing url: ', url, file);
            continue;
        }

        let sourceName = url.split('/').slice('-1')[0].split('?')[0];
        let filePath = path.join(archivePath, 'VIEWERDATA_FILES', file.id);
        let writtenName = await downloadFile(url, sourceName, filePath);

        if (!writtenName) {
            console.log('Failed downloading ', file);
            continue;
        }
        
        result.push(writtenName);
        file['VIEWERDATA'].writtenPaths.push(filePath);
    }

    return result;
}