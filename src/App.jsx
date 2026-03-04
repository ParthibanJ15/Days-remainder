import { useState, useEffect } from 'react';
import EventList from './components/EventList';
import './index.css';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date().toDateString());

  // Always fetch events from events.json — it is the single source of truth
  useEffect(() => {
    fetch('/events.json')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  // Auto-reorder at midnight
  useEffect(() => {
    const checkDayChange = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== lastRefresh) {
        setLastRefresh(today);
        setEvents((prev) => [...prev]);
      }
    }, 60 * 1000);
    return () => clearInterval(checkDayChange);
  }, [lastRefresh]);

  // Stats
  const now = new Date();
  const upcomingWeek = events.filter((e) => {
    const parts = e.date.split('-');
    const next = new Date(now.getFullYear(), parseInt(parts[1]) - 1, parseInt(parts[2]));
    if (next < now) next.setFullYear(now.getFullYear() + 1);
    const diff = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  });

  return (
    <div className="app-wrapper">
      {/* Animated background orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <div className="content-shell">
        {/* Header */}
        <header className="app-header">
          <div className="header-emoji">🎊</div>
          <h1 className="header-title">Family Reminders</h1>
          <p className="header-sub">Never miss a birthday or anniversary</p>

          {/* Stats pills */}
          {events.length > 0 && (
            <div className="stats-row">
              <span className="stat-pill">
                📋 {events.length} event{events.length !== 1 ? 's' : ''}
              </span>
              {upcomingWeek.length > 0 && (
                <span className="stat-pill urgent">
                  🔔 {upcomingWeek.length} this week
                </span>
              )}
            </div>
          )}
        </header>

        <main className="app-main">
          {loading ? (
            <div className="text-center py-16 text-white/50">Loading events…</div>
          ) : (
            <EventList events={events} />
          )}
        </main>
      </div>
    </div>
  );
}
