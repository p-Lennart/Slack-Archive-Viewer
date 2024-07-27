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
    const archiveMap = await loadJSON(mapFilename);
    const archiveName = Object.keys(archiveMap)[0];
    const archivePath = `${rootPath}/${archiveName}`;

    const channelsArr = await loadJSON(archivePath + `/channels.json`);
    const usersArr = await loadJSON(archivePath + `/users.json`);

    let archiveData = {
        archiveName: Object.keys(archiveMap)[0],
        archiveMap: archiveMap,
        channelsArr: channelsArr,
        usersArr: usersArr,
    }
    
    return archiveData;
}