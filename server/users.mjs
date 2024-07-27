export function userFromId(id, usersArr) {
    for (let u of usersArr) {
        if (u.id === id) {
            // console.log(u);
            return u;
        }
    }
    return undefined;
}

export function formatUsernameFromId(id, usersArr) {
    let user = userFromId(id, usersArr);
    return `${user.profile.display_name_normalized} (${user.real_name})`;
}