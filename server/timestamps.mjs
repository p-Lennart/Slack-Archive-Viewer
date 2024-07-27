export function slackDateFromTs(ts) {
    return new Date(ts * 1000);
}

export function formatSlackDateFromTs(ts) {
    let d = slackDateFromTs(ts)
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}