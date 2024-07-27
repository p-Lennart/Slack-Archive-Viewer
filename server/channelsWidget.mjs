const { jml, jml_nester } = await import('./jml.mjs');

export function channelsWidgetUI(channelsObj) {
    const channelNodes = [];

    console.log('chanobj ', channelsObj);
    for (const i of channelsObj) {
        if (!i.pins) {
            i.pins = [];
        }
        let chan = jml('div', { class: 'channel'}, [
            jml('h3', {}, `#${i.name} (${i.id})`),
            jml('span', {}, 'Created: ' + i.created),
            jml('br'),
            jml('span', {}, 'Creator: ' + i.creator),
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