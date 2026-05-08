import React, { useState } from 'react';

const STATUS_COLORS = {
  pending:   { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  confirmed: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

export default function AdminDashboard({ bookings, onUpdateStatus }) {
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');

  const doctors = ['all', ...new Set(bookings.map(b => b.physicianName))];

  const filtered = bookings.filter(b => {
    const matchesStatus = filter === 'all' || b.status === filter;
    const matchesDoctor = doctorFilter === 'all' || b.physicianName === doctorFilter;
    const matchesSearch = b.patientName.toLowerCase().includes(search.toLowerCase()) ||
                          b.patientEmail.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesDoctor && matchesSearch;
  });

  const counts = {
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Upcoming Bookings</h2>
      <p style={styles.sub}>Review and manage all appointment requests.</p>

      <div style={styles.statsRow}>
        <StatCard label="Pending"   count={counts.pending}   color="#F59E0B" bg="#FEF3C7" onClick={() => setFilter('pending')} />
        <StatCard label="Confirmed" count={counts.confirmed} color="#10B981" bg="#D1FAE5" onClick={() => setFilter('confirmed')} />
        <StatCard label="Cancelled" count={counts.cancelled} color="#EF4444" bg="#FEE2E2" onClick={() => setFilter('cancelled')} />
      </div>

      <input
        style={styles.search}
        placeholder="🔍  Search by patient name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={styles.filterRow}>
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
        <select
          style={styles.select}
          value={doctorFilter}
          onChange={e => setDoctorFilter(e.target.value)}
        >
          {doctors.map(d => (
            <option key={d} value={d}>{d === 'all' ? 'All Doctors' : d}</option>
          ))}
        </select>
      </div>

      <p style={styles.resultCount}>Showing {filtered.length} of {bookings.length} bookings</p>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--muted)', marginTop: 24 }}>No bookings found.</p>
      ) : (
        <div style={styles.list}>
          {filtered.map(booking => (
            <BookingCard key={booking.id} booking={booking} onUpdateStatus={onUpdateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, onUpdateStatus }) {
  const colors = STATUS_COLORS[booking.status];
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div style={{ flex: 1 }}>
          <p style={styles.patientName}>{booking.patientName}</p>
          <p style={styles.meta}>{booking.physicianName} · {booking.date} at {booking.time}</p>
        </div>
        <div style={styles.cardRight}>
          <span style={{ ...styles.badge, background: colors.bg, color: colors.text }}>
            <span style={{ ...styles.dot, background: colors.dot }} />
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
          <button style={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={styles.details}>
          <p style={styles.reason}>"{booking.reason}"</p>
          <div style={styles.contactRow}>
            <span style={styles.contact}>✉ {booking.patientEmail}</span>
            <span style={styles.contact}>📞 {booking.patientPhone}</span>
          </div>
        </div>
      )}

      {booking.status !== 'cancelled' && (
        <div style={styles.actions}>
          {booking.status === 'pending' && (
            <button style={{ ...styles.actionBtn, ...styles.confirmBtn }} onClick={() => onUpdateStatus(booking.id, 'confirmed')}>
              ✓ Confirm
            </button>
          )}
          {booking.status === 'confirmed' && (
            <button style={{ ...styles.actionBtn, ...styles.pendingBtn }} onClick={() => onUpdateStatus(booking.id, 'pending')}>
              ↩ Mark Pending
            </button>
          )}
          <button style={{ ...styles.actionBtn, ...styles.cancelBtn }} onClick={() => onUpdateStatus(booking.id, 'cancelled')}>
            ✕ Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, count, color, bg, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.stat, background: bg, cursor: 'pointer', border: 'none', textAlign: 'center' }}>
      <p style={{ ...styles.statCount, color }}>{count}</p>
      <p style={{ ...styles.statLabel, color }}>{label}</p>
    </button>
  );
}

const styles = {
  wrapper: { paddingBottom: 40 },
  heading: { fontSize: 26, color: 'var(--navy)', marginBottom: 6 },
  sub: { color: 'var(--muted)', marginBottom: 24, fontSize: 15 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 },
  stat: { borderRadius: 10, padding: '14px 18px' },
  statCount: { fontSize: 28, fontFamily: 'Lora, serif', fontWeight: 600 },
  statLabel: { fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' },
  search: {
    width: '100%', padding: '11px 16px', borderRadius: 10,
    border: '1.5px solid var(--border)', fontSize: 14,
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
    marginBottom: 12, background: 'var(--white)', color: 'var(--text)',
  },
  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 10 },
  tabs: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tab: {
    padding: '7px 16px', borderRadius: 20, border: '1.5px solid var(--border)',
    background: 'var(--white)', fontSize: 13, color: 'var(--muted)', cursor: 'pointer',
  },
  tabActive: { background: 'var(--navy)', color: '#fff', borderColor: 'var(--navy)', fontWeight: 500 },
  select: {
    padding: '7px 12px', borderRadius: 8, border: '1.5px solid var(--border)',
    fontSize: 13, color: 'var(--text)', background: 'var(--white)',
    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', outline: 'none',
  },
  resultCount: { fontSize: 12, color: 'var(--muted)', marginBottom: 16 },
  list: { display: 'grid', gap: 14 },
  card: {
    background: 'var(--white)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '18px 20px', boxShadow: 'var(--shadow)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardRight: { display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  patientName: { fontFamily: 'Lora, serif', fontSize: 16, color: 'var(--navy)', marginBottom: 3 },
  meta: { fontSize: 13, color: 'var(--muted)' },
  badge: { display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  dot: { width: 7, height: 7, borderRadius: '50%' },
  expandBtn: { background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 11, padding: '4px' },
  details: { borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 },
  reason: { fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.5 },
  contactRow: { display: 'flex', gap: 16, marginBottom: 8 },
  contact: { fontSize: 12, color: 'var(--muted)' },
  actions: { display: 'flex', gap: 10, marginTop: 12 },
  actionBtn: { padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  confirmBtn: { background: 'var(--confirmed)', color: '#fff', border: 'none' },
  pendingBtn: { background: '#E0F2FE', color: '#0369A1', border: 'none' },
  cancelBtn: { background: '#fff', color: 'var(--cancelled)', border: '1.5px solid var(--cancelled)' },
};
