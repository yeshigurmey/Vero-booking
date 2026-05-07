import React, { useState } from 'react';
import { availableSlots } from '../../data/mockData';

// Groups an array of slots by their date label.
// e.g. { "Mon, May 12": [ {id, date, time, ...}, ... ], ... }
function groupByDate(slots) {
  return slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});
}

// Step 2: patient picks an available time slot for their chosen doctor.
export default function TimeSelect({ physician, onSelect, onBack }) {
  const [selected, setSelected] = useState(null);

  const slots = availableSlots[physician.id] || [];
  const grouped = groupByDate(slots);
  const dates = Object.keys(grouped);

  function handleConfirm() {
    if (selected) onSelect(selected);
  }

  return (
    <div style={styles.wrapper}>
      <button style={styles.back} onClick={onBack}>← Back</button>

      <h2 style={styles.heading}>Available Times</h2>
      <p style={styles.sub}>
        Booking with <strong>{physician.name}</strong> · {physician.specialty}
      </p>

      {dates.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>No available slots at this time.</p>
      )}

      {dates.map((date) => (
        <div key={date} style={styles.dayBlock}>
          <p style={styles.dateLabel}>{date}</p>
          <div style={styles.slotsRow}>
            {grouped[date].map((slot) => {
              const isSelected = selected?.id === slot.id;
              return (
                <button
                  key={slot.id}
                  style={{
                    ...styles.slotBtn,
                    ...(isSelected ? styles.slotSelected : {}),
                  }}
                  onClick={() => setSelected(slot)}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        style={{ ...styles.confirm, opacity: selected ? 1 : 0.4 }}
        disabled={!selected}
        onClick={handleConfirm}
      >
        Continue →
      </button>
    </div>
  );
}

const styles = {
  wrapper: { paddingBottom: 40 },
  back: { background: 'none', color: 'var(--teal)', fontSize: 14, marginBottom: 20, padding: 0, cursor: 'pointer' },
  heading: { fontSize: 26, color: 'var(--navy)', marginBottom: 6 },
  sub: { color: 'var(--muted)', marginBottom: 28, fontSize: 15 },
  dayBlock: { marginBottom: 24 },
  dateLabel: { fontSize: 13, fontWeight: 600, color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 },
  slotsRow: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  slotBtn: {
    padding: '8px 18px',
    borderRadius: 8,
    border: '1.5px solid var(--border)',
    background: 'var(--white)',
    fontSize: 14,
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  slotSelected: {
    background: 'var(--teal)',
    borderColor: 'var(--teal)',
    color: '#fff',
    fontWeight: 600,
  },
  confirm: {
    marginTop: 32,
    padding: '14px 36px',
    background: 'var(--navy)',
    color: '#fff',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};
