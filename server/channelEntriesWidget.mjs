import { jml, jml_nester } from './jml.mjs';

export function channelEntriesWidgetJml(archiveData, channelName) {
    const channelData = archiveData.channelsArr.find((c) => c.name === channelName);
    const channelMap = archiveData.archiveMap[channelName];    
    const channelEntries = Object.keys(channelMap);

    const channelEntryNodes = [];

    for (const e of channelEntries) {
        let entryName = e.replace('.json', '');
        let entryNode = jml('li', { class: 'channelEntry'}, [
            jml('a', { href: `./channelViewer.htm?id=${channelData.id}&date=${entryName}` }, entryName),
            jml('span', {}, `: ${channelMap[e]} messages`),
        ]);

        channelEntryNodes.push(entryNode);
    }
    return channelEntryNodes;
}