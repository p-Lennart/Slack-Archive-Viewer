import { jml } from './jml.mjs';

export function formatUsernameFromId(USERS_ARR, userId) {
    let user = userFromId(USERS_ARR, userId);
    return `${user.profile.display_name_normalized} (${user.real_name})`;
}

export function prettyNameFromId(USERS_ARR, userId) {
    let user = userFromId(USERS_ARR, userId);
    return prettyNameFromUserObj(user);
}

export function userFromId(USERS_ARR, userId) {
    for (let u of USERS_ARR) {
        if (u.id === userId) {
            return u;
        }
    }
    return undefined;
}

export function prettyNameFromUserObj(userObj) {
    if (userObj.profile && userObj.profile['display_name'].length > 0)
        return userObj.profile['display_name'];
    else 
        return userObj['real_name'];
}

export function mentionJmlFromStr(USERS_ARR, mentionStr) {
    if (!mentionStr.startsWith('<@') || !mentionStr.endsWith('>')) {
        return console.error(`Invalid mention string: ${mentionStr}`);
    }
    return mentionJmlFromId(USERS_ARR, mentionStr.replace('<@', '').replace('>', ''));    
}

export function mentionJmlFromId(USERS_ARR, userId) {
    return jml('a', 
        { href: `./userPage.htm?id=${userId}` },
        '@' + prettyNameFromId(USERS_ARR, userId)); 
}