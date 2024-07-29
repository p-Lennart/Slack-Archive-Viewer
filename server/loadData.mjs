export async function loadJSON(filename) {
    try {
        let response = await fetch(`./${filename}`);
        let data = await response.json();
        return data;
    } catch (err) {
        console.error("Failed to load JSON", err);
    }
}

export async function loadData(rootPath, mapFilename) {
    const rootMap = await loadJSON(mapFilename);
    const ARCHIVE_NAME = Object.keys(rootMap)[0];
    const archivePath = `${rootPath}/${ARCHIVE_NAME}`;

    const CHANNELS_ARR = await loadJSON(archivePath + `/channels.json`);
    const USERS_ARR = await loadJSON(archivePath + `/users.json`);

    let ARCHIVE_DATA = {
        ARCHIVE_NAME: Object.keys(rootMap)[0],
        ARCHIVE_MAP: rootMap[ARCHIVE_NAME],
        CHANNELS_ARR: CHANNELS_ARR,
        USERS_ARR: USERS_ARR,
    }
    
    return ARCHIVE_DATA;
}