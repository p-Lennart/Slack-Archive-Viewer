import { jml } from './jml.mjs';
import { mentionJmlFromId } from './users.mjs';
import { formatSlackDateFromTs } from './timestamps.mjs';

export function channelHeadingWidgetMjs(ARCHIVE_DATA, channelName) {
    let channelObj = ARCHIVE_DATA.CHANNELS_ARR.find((c) => c.name === channelName);
    let channelHeadingNodes = [
        jml('span', {}, 'Created by '),
        mentionJmlFromId(ARCHIVE_DATA.USERS_ARR, channelObj.creator),
        jml('span', {}, ' on ' + formatSlackDateFromTs(channelObj.created)),
        jml('br'),
        jml('span', {}, 'Archived: ' + channelObj.is_archived),
        jml('br'),
        jml('span', {}, 'Topic: ' + channelObj.topic.value),
        jml('br'),
        jml('span', {}, 'Purpose:  ' + channelObj.purpose.value),
        jml('br'),
    
        jml('span', {}, channelObj.members.length + ' members'),
        jml('br'),
        jml('span', {}, channelObj.pins.length + ' pins'), 
    ];
    return channelHeadingNodes;
} 