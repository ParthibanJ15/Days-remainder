import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(dayOfYear);
dayjs.extend(isSameOrAfter);

/**
 * Given an event's stored date string (YYYY-MM-DD or similar),
 * compute its next occurrence relative to today.
 * Returns a dayjs object for the upcoming date in the current or next year.
 */
export function getNextOccurrence(dateStr) {
    const today = dayjs().startOf('day');
    const original = dayjs(dateStr);

    // Try this year's occurrence
    let next = original.year(today.year());

    // If it's already past today, use next year
    if (next.isBefore(today)) {
        next = next.add(1, 'year');
    }

    return next;
}

/**
 * Returns how many days until the next occurrence from today.
 * 0 = today, negative = past (shouldn't normally happen after getNextOccurrence).
 */
export function getDaysRemaining(dateStr) {
    const today = dayjs().startOf('day');
    const next = getNextOccurrence(dateStr);
    return next.diff(today, 'day');
}

/**
 * Returns true if the event occurs today.
 */
export function isToday(dateStr) {
    return getDaysRemaining(dateStr) === 0;
}

/**
 * Sort events: today first → upcoming chronologically → (past last, shouldn't exist
 * once we compute next occurrences, but just in case).
 */
export function sortEvents(events) {
    return [...events].sort((a, b) => {
        const daysA = getDaysRemaining(a.date);
        const daysB = getDaysRemaining(b.date);
        return daysA - daysB;
    });
}

/**
 * Format a date string to display (Month DD, YYYY).
 */
export function formatDisplayDate(dateStr) {
    const original = dayjs(dateStr);
    return original.format('MMM DD');
}

/**
 * Get the "days remaining" label string.
 */
export function getDaysLabel(dateStr) {
    const days = getDaysRemaining(dateStr);
    if (days === 0) return 'Today! 🎉';
    if (days === 1) return 'Tomorrow';
    if (days === 365) return 'In 1 year';
    return `In ${days} days`;
}
