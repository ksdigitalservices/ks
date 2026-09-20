/*
 * ============================================================
 * BOOKING CONFIGURATION
 * ============================================================
 *
 * Change ONLY these two values to change the daily opening time.
 *
 * Example:
 * 21:40 = 9:40 PM IST
 * 10:30 = 10:30 AM IST
 */

const OPEN_HOUR = 2;
const OPEN_MINUTE = 10;

const TIME_ZONE = "Asia/Kolkata";

/*
 * Returns the current date/time components in India.
 *
 * We deliberately do NOT use:
 *
 *   new Date().getHours()
 *
 * because that uses the visitor's local timezone.
 *
 * Instead, Intl.DateTimeFormat converts the current instant
 * into Asia/Kolkata time.
 */
function getIndiaDateParts() {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    });

    const parts = formatter.formatToParts(new Date());

    const result = {};

    for (const part of parts) {
        if (part.type !== "literal") {
            result[part.type] = Number(part.value);
        }
    }

    return result;
}


/*
 * Returns the current India time as a simple numeric value.
 *
 * We use YYYYMMDDHHMMSS so that comparison is independent
 * of the visitor's timezone.
 */
function getIndiaTimeNumber() {
    const p = getIndiaDateParts();

    return (
        p.year * 10000000000 +
        p.month * 100000000 +
        p.day * 1000000 +
        p.hour * 10000 +
        p.minute * 100 +
        p.second
    );
}


/*
 * Returns today's opening time as a numeric value.
 */
function getTodayOpeningTimeNumber() {
    const p = getIndiaDateParts();

    return (
        p.year * 10000000000 +
        p.month * 100000000 +
        p.day * 1000000 +
        OPEN_HOUR * 10000 +
        OPEN_MINUTE * 100
    );
}


/*
 * Returns true if booking is currently open.
 *
 * AT the opening time = OPEN
 * AFTER the opening time = OPEN
 * BEFORE the opening time = CLOSED
 */
function isBookingOpen() {
    return getIndiaTimeNumber() >= getTodayOpeningTimeNumber();
}


/*
 * Returns today's opening time represented as a Date object.
 *
 * Important:
 * This Date is constructed using UTC components that represent
 * the India wall-clock time. We use the same representation for
 * the current India time when calculating the countdown, so the
 * visitor's local timezone does not affect the countdown.
 */
function getOpeningDateForToday() {
    const p = getIndiaDateParts();

    return new Date(
        Date.UTC(
            p.year,
            p.month - 1,
            p.day,
            OPEN_HOUR,
            OPEN_MINUTE,
            0
        )
    );
}


/*
 * Returns the next opening time.
 *
 * If today's opening time has already passed, the next opening
 * is tomorrow.
 */
function getNextOpeningDate() {
    const todayOpening = getOpeningDateForToday();

    const nowIndia = getIndiaDateParts();

    const nowAsUTC = new Date(
        Date.UTC(
            nowIndia.year,
            nowIndia.month - 1,
            nowIndia.day,
            nowIndia.hour,
            nowIndia.minute,
            nowIndia.second
        )
    );

    if (nowAsUTC < todayOpening) {
        return todayOpening;
    }

    // Tomorrow
    const tomorrow = new Date(todayOpening);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    return tomorrow;
}


/*
 * Formats the configured opening time for display.
 *
 * Example:
 * 21:40 -> "9:40 PM"
 */
function getOpeningTimeText() {
    const date = new Date(
        Date.UTC(
            2000,
            0,
            1,
            OPEN_HOUR,
            OPEN_MINUTE,
            0
        )
    );

    return new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(date);
}


/*
 * Converts the current India time into the same UTC-based
 * representation used by the countdown target.
 */
function getIndiaNowAsUTC() {
    const p = getIndiaDateParts();

    return new Date(
        Date.UTC(
            p.year,
            p.month - 1,
            p.day,
            p.hour,
            p.minute,
            p.second
        )
    );
}
