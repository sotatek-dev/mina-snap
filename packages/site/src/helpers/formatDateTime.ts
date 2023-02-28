export const formatDateTime = (time: string) => {
    let m = new Date(time);
    const dateString = ("0" + m.getUTCDate()).slice(-2) + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    m.getUTCFullYear()+ ", " +
    ("0" + m.getUTCHours()).slice(-2) + ":" +
    ("0" + m.getUTCMinutes()).slice(-2) + ":" +
    ("0" + m.getUTCSeconds()).slice(-2);
    return dateString
}