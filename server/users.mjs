
export function formatUsernameFromId(USERS_ARR, id) {
    let user = userFromId(USERS_ARR, id);
    return `${user.profile.display_name_normalized} (${user.real_name})`;
}

export function prettyNameFromId(USERS_ARR, id) {
    let user = userFromId(USERS_ARR, id);
    return prettyNameFromUserObj(user);
}

export function userFromId(USERS_ARR, id) {
    for (let u of USERS_ARR) {
        if (u.id === id) {
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