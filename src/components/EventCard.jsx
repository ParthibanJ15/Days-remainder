import { getNextOccurrence, getDaysLabel, formatDisplayDate, isToday } from '../utils/dateUtils';
import dayjs from 'dayjs';

const TYPE_CONFIG = {
    Birthday: {
        icon: '🎂',
        gradientFrom: '#7c3aed',
        gradientTo: '#4f46e5',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
        accent: 'text-purple-300',
    },
    Anniversary: {
        icon: '💍',
        gradientFrom: '#e11d48',
        gradientTo: '#9f1239',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
        accent: 'text-rose-300',
    },
};

export default function EventCard({ event, onDelete, onEdit }) {
    const today = isToday(event.date);
    const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.Birthday;
    const nextDate = getNextOccurrence(event.date);
    const originalYear = dayjs(event.date).year();
    const currentYear = dayjs().year();
    const yearsCount = currentYear - originalYear;
    const daysLabel = getDaysLabel(event.date);
    const displayDate = formatDisplayDate(event.date);

    return (
        <div
            className={`card-enter rounded-2xl p-5 border transition-all duration-300 group
        ${today
                    ? 'today-card'
                    : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                }`}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Left: Icon + Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Icon circle */}
                    <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl
              ${today ? 'bg-yellow-400/20 ring-2 ring-yellow-400/50' : 'bg-white/10'}`}
                    >
                        {config.icon}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-base font-bold truncate ${today ? 'text-yellow-300' : 'text-white'}`}>
                                {event.name}
                            </h3>
                            {today && (
                                <span className="today-badge text-lg">🎉</span>
                            )}
                        </div>

                        {/* Type badge + date */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.badge}`}>
                                {config.icon} {event.type}
                            </span>
                            <span className="text-xs text-white/40">{displayDate}</span>
                            {yearsCount > 0 && (
                                <span className="text-xs text-white/30">
                                    {event.type === 'Birthday' ? `Age ${yearsCount}` : `${yearsCount} yrs`}
                                </span>
                            )}
                        </div>

                        {/* Days remaining */}
                        <div className="mt-2">
                            {today ? (
                                <p className="shimmer-text text-sm font-bold">
                                    🎉 Today! — {event.name}'s {event.type}!
                                </p>
                            ) : (
                                <p className={`text-sm font-semibold ${config.accent}`}>
                                    {daysLabel}
                                </p>
                            )}
                            {/* Next date indicator */}
                            <p className="text-xs text-white/30 mt-0.5">
                                Next: {nextDate.format('MMM DD, YYYY')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(event)}
                        title="Edit"
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-blue-500/30 border border-white/10
                       hover:border-blue-400/40 text-white/60 hover:text-blue-300
                       flex items-center justify-center text-sm transition-all"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => onDelete(event.id)}
                        title="Delete"
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/30 border border-white/10
                       hover:border-red-400/40 text-white/60 hover:text-red-300
                       flex items-center justify-center text-sm transition-all"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {/* Today bottom bar */}
            {today && (
                <div className="mt-4 pt-3 border-t border-yellow-400/20">
                    <p className="text-center text-xs text-yellow-300/70 font-medium">
                        ✨ Special day today — Don't forget to celebrate!
                    </p>
                </div>
            )}
        </div>
    );
}
