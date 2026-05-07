import React, { useState } from 'react';

const STATUS_COLORS = {
  pending:   { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  confirmed: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

// The admin/physician dashboard.
// Shows all bookings in a table and lets staff confirm or cancel them.
export default function AdminDashboard({ bookings, onUpdateStatus }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'cancelled'

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  // Count bookings per status for the summary cards at the top
  const counts = {
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Upcoming Bookings</h2>
      <p style={styles.sub}>Review and manage all appointment requests.</p>

      {/* Summary stat cards */}
      <div style={styles.statsRow}>
        <StatCard label="Pending" count={counts.pending} color="#F59E0B" bg="#FEF3C7" />
        <StatCard label="Confirmed" count={counts.confirmed} color="#10B981" bg="#D1FAE5" />
        <StatCard label="Cancelled" count={counts.cancelled} color="#EF4444" bg="#FEE2E2" />
      </div>

      {/* Filter tabs */}
      <div style={styles.tabs}>
        {['all', 'pending', 'confirmed', 'cancelled'].map(tab => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(filter === tab ? styles.tabActive : {}) }}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', marginTop: 24 }}>No bookings found.</p>
      ) : (
        <div style={styles.list}>
          {filtered.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Individual booking card
function BookingCard({ booking, onUpdateStatus }) {
  const colors = STATUS_COLORS[booking.status];

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div>
          <p style={styles.patientName}>{booking.patientName}</p>
          <p style={styles.meta}>{booking.physicianName} · {booking.date} at {booking.time}</p>
        </div>
        {/* Status badge */}
        <span style={{ ...styles.badge, background: colors.bg, color: colors.text }}>
          <span style={{ ...styles.dot, background: colors.dot }} />
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <p style={styles.reason}>"{booking.reason}"</p>

      <div style={styles.contactRow}>
        <span style={styles.contact}>✉ {booking.patientEmail}</span>
        <span style={styles.contact}>📞 {booking.patientPhone}</span>
      </div>

      {/* Action buttons — only show if booking is still actionable */}
      {booking.status !== 'cancelled' && (
        <div style={styles.actions}>
          {booking.status === 'pending' && (
            <button
              style={{ ...styles.actionBtn, ...styles.confirmBtn }}
              onClick={() => onUpdateStatus(booking.id, 'confirmed')}
            >
              ✓ Confirm
            </button>
          )}
          <button
            style={{ ...styles.actionBtn, ...styles.cancelBtn }}
            onClick={() => onUpdateStatus(booking.id, 'cancelled')}
          >
            ✕ Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// Small stat summary card
function StatCard({ label, count, color, bg }) {
  return (
    <div style={{ ...styles.stat, background: bg }}>
      <p style={{ ...styles.statCount, color }}>{count}</p>
      <p style={{ ...styles.statLabel, color }}>{label}</p>
    </div>
  );
}

const styles = {
  wrapper: { paddingBottom: 40 },
  heading: { fontSize: 26, color: 'var(--navy)', marginBottom: 6 },
  sub: { color: 'var(--muted)', marginBottom: 24, fontSize: 15 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 },
  stat: { borderRadius: 10, padding: '14px 18px', textAlign: 'center' },
  statCount: { fontSize: 28, fontFamily: 'Lora, serif', fontWeight: 600 },
  statLabel: { fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: {
    padding: '7px 16px', borderRadius: 20, border: '1.5px solid var(--border)',
    background: 'var(--white)', fontSize: 13, color: 'var(--muted)', cursor: 'pointer',
  },
  tabActive: { background: 'var(--navy)', color: '#fff', borderColor: 'var(--navy)', fontWeight: 500 },
  list: { display: 'grid', gap: 14 },
  card: {
    background: 'var(--white)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '18px 20px',
    boxShadow: 'var(--shadow)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  patientName: { fontFamily: 'Lora, serif', fontSize: 16, color: 'var(--navy)', marginBottom: 3 },
  meta: { fontSize: 13, color: 'var(--muted)' },
  badge: { display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, flexShrink: 0 },
  dot: { width: 7, height: 7, borderRadius: '50%' },
  reason: { fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 10, lineHeight: 1.5 },
  contactRow: { display: 'flex', gap: 16, marginBottom: 14 },
  contact: { fontSize: 12, color: 'var(--muted)' },
  actions: { display: 'flex', gap: 10 },
  actionBtn: { padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  confirmBtn: { background: 'var(--confirmed)', color: '#fff' },
  cancelBtn: { background: '#fff', color: 'var(--cancelled)', border: '1.5px solid var(--cancelled)' },
};
