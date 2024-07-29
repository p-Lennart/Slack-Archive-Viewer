import { jml, jml_nester } from './jml.mjs';
import { channelHeadingWidgetMjs } from './channelHeadingWidget.mjs';

export function channelsWidgetJml(ARCHIVE_DATA) {
    const CHANNELS_ARR = ARCHIVE_DATA.CHANNELS_ARR;
    const channelNodes = [];

    for (const channelObj of CHANNELS_ARR) {
        if (!channelObj.pins) {
            channelObj.pins = [];
        }
    
        let channelNodeNodes = [
            jml('a', { href: `./channelPage.htm?id=${channelObj.id}` },
            jml('h3', {}, `#${channelObj.name} (${channelObj.id})`),
        )];

        channelNodeNodes = channelNodeNodes.concat(channelHeadingWidgetMjs(ARCHIVE_DATA, channelObj.name));

        channelNodes.push(jml('div', { class: 'channel'}, channelNodeNodes));
    }
    return channelNodes;
}