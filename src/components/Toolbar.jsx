import { useRef } from 'react';

export default function Toolbar({ onExport, onImport }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (Array.isArray(parsed)) {
                    onImport(parsed);
                } else {
                    alert('Invalid file format. Expected a JSON array of events.');
                }
            } catch {
                alert('Could not read file. Make sure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
        // Reset so same file can be re-imported
        e.target.value = '';
    };

    return (
        <div className="toolbar">
            <button
                className="toolbar-btn export-btn"
                onClick={onExport}
                title="Download events as JSON to share with family"
            >
                <span className="toolbar-icon">⬇️</span>
                <span>Export JSON</span>
            </button>

            <button
                className="toolbar-btn import-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Import a JSON file shared by a family member"
            >
                <span className="toolbar-icon">⬆️</span>
                <span>Import JSON</span>
            </button>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </div>
    );
}
