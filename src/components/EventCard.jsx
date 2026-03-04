import { getNextOccurrence, getDaysLabel, formatDisplayDate, isToday } from '../utils/dateUtils';
import dayjs from 'dayjs';

const TYPE_CONFIG = {
    Birthday: {
        icon: '🎂',
        accentColor: '#a855f7',
        accentGlow: 'rgba(168,85,247,0.35)',
        badge: 'badge-birthday',
        countdownClass: 'countdown-birthday',
    },
    Anniversary: {
        icon: '💍',
        accentColor: '#f43f5e',
        accentGlow: 'rgba(244,63,94,0.35)',
        badge: 'badge-anniversary',
        countdownClass: 'countdown-anniversary',
    },
};

export default function EventCard({ event }) {
    const todayFlag = isToday(event.date);
    const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.Birthday;
    const nextDate = getNextOccurrence(event.date);
    const originalYear = dayjs(event.date).year();
    const currentYear = dayjs().year();
    const yearsCount = currentYear - originalYear;
    const daysLabel = getDaysLabel(event.date);
    const displayDate = formatDisplayDate(event.date);

    return (
        <div className={`event-card ${todayFlag ? 'event-card--today' : ''}`}>
            {/* Colored left accent bar */}
            <div
                className="card-accent"
                style={{
                    background: todayFlag
                        ? 'linear-gradient(180deg,#facc15,#f97316)'
                        : `linear-gradient(180deg,${config.accentColor},${config.accentColor}88)`,
                    boxShadow: todayFlag
                        ? '0 0 12px rgba(250,204,21,0.6)'
                        : `0 0 10px ${config.accentGlow}`,
                }}
            />

            <div className="card-body">
                <div className="card-left">
                    {/* Icon circle */}
                    <div className={`icon-circle ${todayFlag ? 'icon-circle--today' : ''}`}>
                        {config.icon}
                    </div>

                    {/* Info */}
                    <div className="card-info">
                        <div className="name-row">
                            <h3 className={`event-name ${todayFlag ? 'event-name--today' : ''}`}>
                                {event.name}
                            </h3>
                            {todayFlag && <span className="bounce-badge">🎉</span>}
                        </div>

                        <div className="meta-row">
                            <span className={`type-badge ${config.badge}`}>
                                {config.icon} {event.type}
                            </span>
                            <span className="meta-date">{displayDate}</span>
                            {yearsCount > 0 && (
                                <span className="meta-years">
                                    {event.type === 'Birthday' ? `Age ${yearsCount}` : `${yearsCount} yrs`}
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
                                <span className={`countdown-pill ${config.countdownClass}`}>
                                    {daysLabel}
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
