import { useState, useEffect, useCallback } from 'react';
import AddEvent from './components/AddEvent';
import EventList from './components/EventList';
import './index.css';

const STORAGE_KEY = 'family-events';

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export default function App() {
  const [events, setEvents] = useState(loadEvents);
  const [editEvent, setEditEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date().toDateString());

  // Persist to LocalStorage on change
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  // Auto-reorder: re-render at midnight when the day changes
  useEffect(() => {
    const checkDayChange = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== lastRefresh) {
        setLastRefresh(today);
        // Trigger re-render so sorting recalculates
        setEvents((prev) => [...prev]);
      }
    }, 60 * 1000); // check every minute

    return () => clearInterval(checkDayChange);
  }, [lastRefresh]);

  const handleAddOrUpdate = useCallback((event) => {
    setEvents((prev) => {
      const existing = prev.find((e) => e.id === event.id);
      if (existing) {
        return prev.map((e) => (e.id === event.id ? event : e));
      }
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

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <header className="text-center mb-10 max-w-lg mx-auto">
        <div className="text-5xl mb-3">🎊</div>
        <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">
          Family Reminders
        </h1>
        <p className="text-white/40 text-sm">
          Never miss a birthday or anniversary
        </p>

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-gradient-to-r from-yellow-400 to-orange-400 text-black
                       font-bold text-sm shadow-lg shadow-yellow-400/25
                       hover:from-yellow-300 hover:to-orange-300 active:scale-95 transition-all"
          >
            <span className="text-lg">＋</span> Add Event
          </button>
        )}
      </header>

      <main className="max-w-lg mx-auto">
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
  );
}
