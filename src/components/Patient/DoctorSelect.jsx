import React, { useState } from 'react';
import { physicians } from '../../data/mockData';
import SymptomHelper from './SymptomHelper';

const SPECIALTIES = ['All', ...new Set(physicians.map(p => p.specialty))];

// This is the first step in the patient flow.
// It shows all available physicians as cards and lets the patient pick one.
// Includes specialty filter and AI symptom helper.
export default function DoctorSelect({ onSelect }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = physicians.filter(doc => {
    const matchesSpecialty = filter === 'All' || doc.specialty === filter;
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(search.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Choose a Physician</h2>
      <p style={styles.sub}>Select the doctor you'd like to book with.</p>

      {/* AI Symptom Helper */}
      <SymptomHelper physicians={physicians} onSelectPhysician={onSelect} />

      {/* Search bar */}
      <input
        style={styles.search}
        placeholder="🔍  Search by name or specialty..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Specialty filter pills */}
      <div style={styles.filters}>
        {SPECIALTIES.map(s => (
          <button
            key={s}
            style={{ ...styles.pill, ...(filter === s ? styles.pillActive : {}) }}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filtered.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>No doctors match your search.</p>
        )}
        {filtered.map((doc) => (
          <button
            key={doc.id}
            style={styles.card}
            onClick={() => onSelect(doc)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Avatar circle with doctor's initials */}
            <div style={{ ...styles.avatar, background: doc.color }}>
              {doc.initials}
            </div>
            <div style={styles.info}>
              <p style={styles.name}>{doc.name}</p>
              <p style={styles.specialty}>{doc.specialty}</p>
              <p style={styles.bio}>{doc.bio}</p>
            </div>
            <span style={styles.arrow}>→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { padding: '0 0 40px' },
  heading: { fontSize: 26, color: 'var(--navy)', marginBottom: 6 },
  sub: { color: 'var(--muted)', marginBottom: 28, fontSize: 15 },
  search: {
    width: '100%', padding: '11px 16px', borderRadius: 10,
    border: '1.5px solid var(--border)', fontSize: 14,
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
    marginBottom: 12, background: 'var(--white)', color: 'var(--text)',
  },
  filters: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  pill: {
    padding: '6px 14px', borderRadius: 20, border: '1.5px solid var(--border)',
    background: 'var(--white)', fontSize: 13, color: 'var(--muted)', cursor: 'pointer',
  },
  pillActive: { background: 'var(--navy)', color: '#fff', borderColor: 'var(--navy)', fontWeight: 500 },
  grid: { display: 'grid', gap: 16 },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    background: 'var(--white)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px 24px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
    boxShadow: 'var(--shadow)',
  },
  avatar: {
    width: 56, height: 56, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 600, fontSize: 18, flexShrink: 0,
  },
  info: { flex: 1 },
  name: { fontFamily: 'Lora, serif', fontSize: 17, color: 'var(--navy)', marginBottom: 2 },
  specialty: { fontSize: 13, color: 'var(--teal)', fontWeight: 500, marginBottom: 6 },
  bio: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 },
  arrow: { fontSize: 20, color: 'var(--teal)', flexShrink: 0 },
};
