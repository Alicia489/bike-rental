export function imagePath(assetName) {
    return `/images/${assetName}`;
}

export function formatDate(format, dateObj) {
    if (format === "YMD") {
        return dateObj.toISOString().split('T')[0]
    }

    return dateObj;
}

export function addDays(dateObj, days) {
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj;
}

export function formatDate2(date) {
    if (!date) {
        return "";
    }

    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let locale = "en-GB";

    // date = new Date(date);

    return date.toLocaleString(locale, options);
}

export function checkIfDatesOverlap(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
    if (b_start < a_start && a_end < b_end) return true; // a in b
    return false;
}