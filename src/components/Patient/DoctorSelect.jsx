import React from 'react';
import { physicians } from '../../data/mockData';

// This is the first step in the patient flow.
// It shows all available physicians as cards and lets the patient pick one.
export default function DoctorSelect({ onSelect }) {
  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Choose a Physician</h2>
      <p style={styles.sub}>Select the doctor you'd like to book with.</p>

      <div style={styles.grid}>
        {physicians.map((doc) => (
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
