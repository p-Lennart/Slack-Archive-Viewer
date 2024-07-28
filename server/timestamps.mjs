export function slackDateFromTs(ts) {
    return new Date(parseFloat(ts) * 1000);
}

export function formatSlackDateFromTs(ts) {
    let d = slackDateFromTs(ts)
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()} ${formatSlackTimeFromTs(ts)}`;
}

export function formatSlackTimeFromTs(ts) {
    let d = slackDateFromTs(ts)
    let hours = d.getHours();
    let minutes = d.getMinutes(); 
    let seconds = d.getSeconds();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}