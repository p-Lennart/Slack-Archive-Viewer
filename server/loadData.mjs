export function VIEWERDATA_PATH() {
    return './VIEWERDATA';
}

export function VIEWERDATA_MAP_PATH() {
    return './VIEWERDATA_map.json';
}

export function ARCHIVE_PATH(ARCHIVE_DATA) {
    return `${VIEWERDATA_PATH()}/${ARCHIVE_DATA.ARCHIVE_NAME}`;
}

export function FILES_PATH(ARCHIVE_DATA) {
    return ARCHIVE_PATH(ARCHIVE_DATA) + '/VIEWER_FILES';
}

export function CHANNELS_JSON_PATH(ARCHIVE_DATA) {
    return ARCHIVE_PATH(ARCHIVE_DATA) + '/channels.json';
}

export function USERS_JSON_PATH(ARCHIVE_DATA) {
    return ARCHIVE_PATH(ARCHIVE_DATA) + '/users.json'; 
}

export function getChannelPath(ARCHIVE_DATA, channelName) {
    return `${ARCHIVE_PATH(ARCHIVE_DATA)}/${channelName}`;
}

export async function getChannelMessages(ARCHIVE_DATA, channelName, messagesDate) {
    return await loadJSON(`${getChannelPath(ARCHIVE_DATA, channelName)}/${messagesDate}.json`);
}

export function localPathFromFile(ARCHIVE_DATA, file) {
    let filename = file.permalink.split('/').pop();
    return `${FILES_PATH(ARCHIVE_DATA)}/${file.id}/${filename}`;
}

export async function loadJSON(path) {
    try {
        let response = await fetch(path);
        let data = await response.json();
        return data;
    } catch (err) {
        console.error("Failed to load JSON", err);
    }
}

export async function loadData() {
    const rootMap = await loadJSON(VIEWERDATA_MAP_PATH());
    
    let ARCHIVE_DATA = {
        ARCHIVE_NAME: Object.keys(rootMap)[0],
        ARCHIVE_MAP: {},
        CHANNELS_ARR: [],
        USERS_ARR: [],
    }

    ARCHIVE_DATA['ARCHIVE_MAP'] = rootMap[ARCHIVE_DATA.ARCHIVE_NAME];
    ARCHIVE_DATA['CHANNELS_ARR'] = await loadJSON(CHANNELS_JSON_PATH(ARCHIVE_DATA));
    ARCHIVE_DATA['USERS_ARR'] = await loadJSON(USERS_JSON_PATH(ARCHIVE_DATA));
    
    return ARCHIVE_DATA;
}