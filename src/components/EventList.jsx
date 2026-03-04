import EventCard from './EventCard';
import { sortEvents, isToday } from '../utils/dateUtils';

export default function EventList({ events }) {
    if (events.length === 0) {
        return (
            <div className="text-center py-16 px-6">
                <div className="text-6xl mb-4">🗓️</div>
                <h3 className="text-white/60 text-lg font-medium">No events yet</h3>
                <p className="text-white/30 text-sm mt-1">Add entries to events.json to get started!</p>
            </div>
        );
    }

    const sorted = sortEvents(events);
    const todayEvents = sorted.filter((e) => isToday(e.date));
    const upcomingEvents = sorted.filter((e) => !isToday(e.date));

    return (
        <div className="space-y-6">
            {/* Today section */}
            {todayEvents.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🎉</span>
                        <h2 className="font-bold text-base uppercase tracking-widest" style={{ color: '#166534' }}>
                            Today
                        </h2>
                        <span className="flex-1 h-px" style={{ background: 'rgba(22,101,52,0.25)' }} />
                    </div>
                    <div className="space-y-3">
                        {todayEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming section */}
            {upcomingEvents.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">📅</span>
                        <h2 className="font-bold text-base uppercase tracking-widest" style={{ color: '#a16207' }}>
                            Upcoming
                        </h2>
                        <span className="flex-1 h-px" style={{ background: 'rgba(161,98,7,0.20)' }} />
                        <span className="text-xs" style={{ color: '#9ca3af' }}>{upcomingEvents.length} events</span>
                    </div>
                    <div className="space-y-3">
                        {upcomingEvents.map((event, index) => (
                            <div
                                key={event.id}
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                <EventCard
                                    event={event}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
