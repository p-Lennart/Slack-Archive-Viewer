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
    const archiveName = Object.keys(rootMap)[0];
    const archivePath = `${rootPath}/${archiveName}`;

    const channelsArr = await loadJSON(archivePath + `/channels.json`);
    const usersArr = await loadJSON(archivePath + `/users.json`);

    let archiveData = {
        archiveName: Object.keys(rootMap)[0],
        archiveMap: rootMap[archiveName],
        channelsArr: channelsArr,
        usersArr: usersArr,
    }
    
    return archiveData;
}