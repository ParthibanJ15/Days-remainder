import { useState } from 'react';
import dayjs from 'dayjs';

const EVENT_TYPES = ['Birthday', 'Anniversary'];

export default function AddEvent({ onAdd, editEvent, onCancelEdit }) {
    const [name, setName] = useState(editEvent?.name || '');
    const [type, setType] = useState(editEvent?.type || 'Birthday');
    const [date, setDate] = useState(editEvent?.date || '');
    const [error, setError] = useState('');

    // Sync with editEvent changes
    useState(() => {
        if (editEvent) {
            setName(editEvent.name);
            setType(editEvent.type);
            setDate(editEvent.date);
        }
    }, [editEvent]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return setError('Please enter a name.');
        if (!date) return setError('Please select a date.');
        setError('');

        const event = {
            id: editEvent?.id || crypto.randomUUID(),
            name: name.trim(),
            type,
            date, // stored as YYYY-MM-DD
        };

        onAdd(event);
        setName('');
        setType('Birthday');
        setDate('');
    };

    return (
        <div className="w-full max-w-lg mx-auto mb-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                    {editEvent ? (
                        <><span className="text-2xl">✏️</span> Edit Event</>
                    ) : (
                        <><span className="text-2xl">➕</span> Add New Event</>
                    )}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Amma, Dad, Mr. & Mrs. Smith"
                            className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30
                         px-4 py-3 text-sm outline-none focus:border-yellow-400/60 focus:ring-2
                         focus:ring-yellow-400/20 transition-all"
                        />
                    </div>

                    {/* Event Type */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Event Type</label>
                        <div className="flex gap-3">
                            {EVENT_TYPES.map((t) => (
                                <button
                                    type="button"
                                    key={t}
                                    onClick={() => setType(t)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all
                    ${type === t
                                            ? t === 'Birthday'
                                                ? 'bg-purple-500/30 border-purple-400 text-purple-200'
                                                : 'bg-rose-500/30 border-rose-400 text-rose-200'
                                            : 'bg-white/5 border-white/20 text-white/50 hover:border-white/40'
                                        }`}
                                >
                                    {t === 'Birthday' ? '🎂' : '💍'} {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={dayjs().format('YYYY-MM-DD')}
                            className="w-full rounded-xl bg-white/10 border border-white/20 text-white
                         px-4 py-3 text-sm outline-none focus:border-yellow-400/60 focus:ring-2
                         focus:ring-yellow-400/20 transition-all [color-scheme:dark]"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl font-semibold text-sm text-black
                         bg-gradient-to-r from-yellow-400 to-orange-400
                         hover:from-yellow-300 hover:to-orange-300
                         transition-all shadow-lg shadow-yellow-400/20 active:scale-95"
                        >
                            {editEvent ? 'Update Event' : 'Save Event'}
                        </button>
                        {editEvent && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="px-5 py-3 rounded-xl font-semibold text-sm text-white/70
                           bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
