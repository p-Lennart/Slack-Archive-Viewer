import { jml, jml_nester } from './jml.mjs';

export function channelEntriesWidgetJml(ARCHIVE_DATA, channelName) {
    const channelData = ARCHIVE_DATA.CHANNELS_ARR.find((c) => c.name === channelName);
    const channelMap = ARCHIVE_DATA.ARCHIVE_MAP[channelName];    
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