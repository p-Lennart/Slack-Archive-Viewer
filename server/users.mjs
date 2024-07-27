export function userFromId(id, usersArr) {
    for (let u of usersArr) {
        if (u.id === id) {
            return u;
        }
    }
    return undefined;
}

export function formatUsernameFromId(id, usersArr) {
    let user = userFromId(id, usersArr);
    return `${user.profile.display_name_normalized} (${user.real_name})`;
}

export function prettyNameFromId(id, usersArr) {
    let user = userFromId(id, usersArr);
    if (user.profile && user.profile['display_name'].length > 0)
        return user.profile['display_name'];
    else 
        return user['real_name'];
}