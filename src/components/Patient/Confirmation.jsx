import React from 'react';

// Final step: shown after the patient successfully submits their booking.
// Displays a summary and a "Book Another" button.
export default function Confirmation({ booking, onReset }) {
  return (
    <div style={styles.wrapper}>
      {/* Success checkmark */}
      <div style={styles.iconCircle}>✓</div>

      <h2 style={styles.heading}>Booking Requested!</h2>
      <p style={styles.sub}>
        Your appointment request has been sent. You'll receive a confirmation once the physician's office reviews it.
      </p>

      {/* Booking details card */}
      <div style={styles.card}>
        <Row label="Doctor" value={`${booking.physicianName}`} />
        <Row label="Date" value={booking.date} />
        <Row label="Time" value={booking.time} />
        <Row label="Patient" value={booking.patientName} />
        <Row label="Email" value={booking.patientEmail} />
        <div style={styles.statusRow}>
          <span style={styles.badge}>⏳ Pending Review</span>
        </div>
      </div>

      <button style={styles.btn} onClick={onReset}>
        Book Another Appointment
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.key}>{label}</span>
      <span style={styles.val}>{value}</span>
    </div>
  );
}

const styles = {
  wrapper: { paddingBottom: 40, textAlign: 'center' },
  iconCircle: {
    width: 64, height: 64, borderRadius: '50%',
    background: 'var(--confirmed)', color: '#fff',
    fontSize: 28, display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 20px',
  },
  heading: { fontSize: 26, color: 'var(--navy)', marginBottom: 10 },
  sub: { color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' },
  card: {
    background: 'var(--white)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px 24px',
    textAlign: 'left',
    marginBottom: 24,
    boxShadow: 'var(--shadow)',
  },
  row: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' },
  key: { fontSize: 13, color: 'var(--muted)', fontWeight: 500 },
  val: { fontSize: 14, color: 'var(--navy)', fontWeight: 500 },
  statusRow: { paddingTop: 12 },
  badge: {
    display: 'inline-block',
    background: '#FEF3C7',
    color: '#92400E',
    borderRadius: 20,
    padding: '4px 14px',
    fontSize: 13,
    fontWeight: 500,
  },
  btn: {
    padding: '13px 32px',
    background: 'var(--navy)',
    color: '#fff',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
  },
};
