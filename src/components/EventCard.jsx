import { getNextOccurrence, getDaysLabel, formatDisplayDate, isToday } from '../utils/dateUtils';
import dayjs from 'dayjs';

export default function EventCard({ event }) {
    const todayFlag = isToday(event.date);
    const isBirthday = event.type === 'Birthday';
    const isAnniversary = event.type === 'Anniversary';

    const nextDate = getNextOccurrence(event.date);
    const originalYear = dayjs(event.date).year();
    const currentYear = dayjs().year();
    const yearsCount = currentYear - originalYear;
    const daysLabel = getDaysLabel(event.date);
    const displayDate = formatDisplayDate(event.date);

    // Dynamic classes
    const cardClass = [
        'event-card',
        todayFlag
            ? 'event-card--today'
            : isBirthday
                ? 'event-card--birthday'
                : 'event-card--anniversary',
    ].join(' ');

    const accentClass = [
        'card-accent',
        todayFlag
            ? 'accent--today'
            : isBirthday
                ? 'accent--birthday'
                : 'accent--anniversary',
    ].join(' ');

    const iconClass = [
        'icon-circle',
        todayFlag
            ? 'icon-circle--today'
            : isBirthday
                ? 'icon-circle--birthday'
                : 'icon-circle--anniversary',
    ].join(' ');

    const nameClass = [
        'event-name',
        todayFlag
            ? 'event-name--today'
            : isBirthday
                ? 'event-name--birthday'
                : 'event-name--anniversary',
    ].join(' ');

    const countdownClass = [
        'countdown-pill',
        isBirthday ? 'countdown-birthday' : 'countdown-anniversary',
    ].join(' ');

    return (
        <div className={cardClass}>
            {/* Colored left accent bar */}
            <div className={accentClass} />

            <div className="card-body">
                <div className="card-left">
                    {/* Icon circle */}
                    <div className={iconClass}>
                        {isBirthday ? '🎂' : '💍'}
                    </div>

                    {/* Info */}
                    <div className="card-info">
                        <div className="name-row">
                            <h3 className={nameClass}>
                                {event.name}
                            </h3>
                            {todayFlag && <span className="bounce-badge">🎉</span>}
                        </div>

                        <div className="meta-row">
                            <span className={`type-badge ${isBirthday ? 'badge-birthday' : 'badge-anniversary'}`}>
                                {isBirthday ? '🎂' : '💍'} {event.type}
                            </span>
                            <span className="meta-date">{displayDate}</span>
                            {yearsCount > 0 && (
                                <span className="meta-years">
                                    {isBirthday ? `Age ${yearsCount}` : `${yearsCount} yrs`}
                                </span>
                            )}
                        </div>

                        {/* Countdown */}
                        <div className="countdown-row">
                            {todayFlag ? (
                                <p className="shimmer-text countdown-today">
                                    🎉 Today! — {event.name}'s {event.type}!
                                </p>
                            ) : (
                                <span className={countdownClass}>
                                    {isBirthday ? '🎂' : '💍'} {daysLabel}
                                </span>
                            )}
                            <p className="next-date">Next: {nextDate.format('MMM DD, YYYY')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today celebration footer */}
            {todayFlag && (
                <div className="today-footer">
                    ✨ Special day today — Don't forget to celebrate!
                </div>
            )}
        </div>
    );
}
