import { jml } from './jml.mjs';
import { prettyNameFromUserObj } from './users.mjs';

export function usersWidgetJml(ARCHIVE_DATA, memberIdsArr) {
    const userCardNodes = [];
    
    for (const user of ARCHIVE_DATA.USERS_ARR) {
        if (!memberIdsArr || memberIdsArr.includes(user.id)) {
            userCardNodes.push(userCardJml(user));
        }
    }

    return userCardNodes;
}

function userCardJml(userObj) {
    let userCardNode = jml('div', { class: 'user'}, [
        jml('img', { class: 'user_picture', src: userObj.profile['image_72'] }, ),
        jml('div', { class: 'user_text'}, [
            jml('a', { href: `./userPage.htm?id=${userObj.id}` }, 
                jml('h3', {}, prettyNameFromUserObj(userObj)),
            ),
                jml('h5', {}, '@' + userObj.name),
            jml('span', {}, userObj.profile.title),
        ]),
    ]);

    return userCardNode;
}