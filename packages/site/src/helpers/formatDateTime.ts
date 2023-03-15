import moment from "moment"

export const formatDateTime = (time: string) => {
    const stillUtc = moment.utc(time).toDate();
    const local = moment(stillUtc).local().format('YYYY-MM-DD, HH:mm:ss');
    return local
}