import { jml } from './jml.mjs';
import { userFromId, prettyNameFromId } from './users.mjs';

export function membersWidgetJml(archiveData, memberIds) {
    const memberNodes = [];

    for (const id of memberIds) {
        let user = userFromId(id, archiveData.usersArr);

        let memNode = jml('div', { class: 'user'}, [
            jml('img', { class: 'user_picture', src: user.profile['image_72'] }, ),
            jml('div', { class: 'user_text'}, [
                jml('h3', {}, prettyNameFromId(id, archiveData.usersArr)),
                jml('h5', {}, '@' + user.name),
                jml('span', {}, user.profile.title),
            ]),
        ]);

        memberNodes.push(memNode);
    }

    return memberNodes;
}