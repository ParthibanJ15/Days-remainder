import { useState, useEffect, useCallback } from 'react';
import AddEvent from './components/AddEvent';
import EventList from './components/EventList';
import Toolbar from './components/Toolbar';
import './index.css';

const STORAGE_KEY = 'family-events';

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null; // null = not yet seeded
  } catch {
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date().toDateString());
  const [importMsg, setImportMsg] = useState('');

  // Seed from events.json if localStorage is empty on first load
  useEffect(() => {
    const stored = loadEvents();
    if (stored !== null && stored.length > 0) {
      setEvents(stored);
    } else {
      fetch('/events.json')
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
            saveEvents(data);
          }
        })
        .catch(() => { }); // silent fail if no seed file
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (events.length > 0) saveEvents(events);
  }, [events]);

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

  const handleAddOrUpdate = useCallback((event) => {
    setEvents((prev) => {
      const existing = prev.find((e) => e.id === event.id);
      if (existing) return prev.map((e) => (e.id === event.id ? event : e));
      return [...prev, event];
    });
    setEditEvent(null);
    setShowForm(false);
  }, []);

  const handleDelete = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleEdit = useCallback((event) => {
    setEditEvent(event);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditEvent(null);
    setShowForm(false);
  }, []);

  // Export current events as a downloadable JSON file
  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(events, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family-events.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [events]);

  // Import events from a JSON file — merges by id (avoids duplicates)
  const handleImport = useCallback((incoming) => {
    setEvents((prev) => {
      const ids = new Set(prev.map((e) => e.id));
      const newOnes = incoming.filter((e) => !ids.has(e.id));
      const merged = [...prev, ...newOnes];
      saveEvents(merged);
      setImportMsg(`✅ Imported ${newOnes.length} new event${newOnes.length !== 1 ? 's' : ''}!`);
      setTimeout(() => setImportMsg(''), 3000);
      return merged;
    });
  }, []);

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

          {/* Toolbar */}
          <Toolbar onExport={handleExport} onImport={handleImport} />

          {/* Import success message */}
          {importMsg && <div className="import-toast">{importMsg}</div>}

          {/* Add button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="add-btn"
            >
              <span>＋</span> Add Event
            </button>
          )}
        </header>

        <main className="app-main">
          {/* Form */}
          {showForm && (
            <AddEvent
              onAdd={handleAddOrUpdate}
              editEvent={editEvent}
              onCancelEdit={handleCancelEdit}
            />
          )}

          {/* Event List */}
          <EventList
            events={events}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </main>
      </div>
    </div>
  );
}
