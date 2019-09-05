/**
 * Format a JS Date() into 'yyy-mm-dd' string
 * @param date
 * @returns {string}
 */
export const formatDate = date => {

        if (!date) {
            return '';
        }

        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
}