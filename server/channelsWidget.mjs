import { jml, jml_nester } from './jml.mjs';
import { formatSlackDateFromTs } from './timestamps.mjs';
import { formatUsernameFromId } from './users.mjs';

export function channelsWidgetJml(data) {
    const CHANNELS_ARR = data.CHANNELS_ARR;
    const USERS_ARR = data.USERS_ARR;

    const channelNodes = [];

    console.log('chanobj ', CHANNELS_ARR);
    for (const i of CHANNELS_ARR) {
        if (!i.pins) {
            i.pins = [];
        }
        
        let createdStr = formatSlackDateFromTs(i.created);
        let creatorStr = formatUsernameFromId(USERS_ARR, i.creator);

        let chan = jml('div', { class: 'channel'}, [
            jml('a', { href: `./channelPage.htm?id=${i.id}` },
                jml('h3', {}, `#${i.name} (${i.id})`),
            ),
            jml('span', {}, 'Created: ' + createdStr),
            jml('br'),
            jml('span', {}, 'Creator: ' + creatorStr),
            jml('br'),
            jml('span', {}, 'Archived: ' + i.is_archived),
            jml('br'),
            jml('span', {}, 'Topic: ' + i.topic.value),
            jml('br'),
            jml('span', {}, 'Purpose:  ' + i.purpose.value),
            jml('br'),

            jml('span', {}, i.members.length + ' members'),
            jml('br'),
            jml('span', {}, i.pins.length + ' pins'),
            
        ]);

        channelNodes.push(chan);

    }

    return channelNodes;
}