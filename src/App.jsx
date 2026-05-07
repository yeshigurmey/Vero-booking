import React, { useState } from 'react';
import { initialBookings } from './data/mockData';
import DoctorSelect   from './components/Patient/DoctorSelect';
import TimeSelect     from './components/Patient/TimeSelect';
import BookingForm    from './components/Patient/BookingForm';
import Confirmation   from './components/Patient/Confirmation';
import AdminDashboard from './components/Admin/AdminDashboard';

// The patient flow has 4 steps:
//   'doctor'  → pick a physician
//   'time'    → pick a time slot
//   'form'    → fill in patient details
//   'confirm' → success screen
const PATIENT_STEPS = ['doctor', 'time', 'form', 'confirm'];

export default function App() {
  // Which top-level view: 'patient' or 'admin'
  const [view, setView] = useState('patient');

  // ── Patient flow state ───────────────────────────────────────────────────
  const [step, setStep]           = useState('doctor');
  const [physician, setPhysician] = useState(null);
  const [slot, setSlot]           = useState(null);
  const [lastBooking, setLastBooking] = useState(null);

  // ── Shared bookings list (patient adds to it, admin manages it) ──────────
  const [bookings, setBookings] = useState(initialBookings);

  // ── Patient flow handlers ────────────────────────────────────────────────

  function handleDoctorSelect(doc) {
    setPhysician(doc);
    setStep('time');
  }

  function handleTimeSelect(selectedSlot) {
    setSlot(selectedSlot);
    setStep('form');
  }

  function handleFormSubmit(formData) {
    // Build a new booking object and add it to the shared bookings list
    const newBooking = {
      id: 'b' + Date.now(),
      physicianId:   physician.id,
      physicianName: physician.name,
      patientName:   formData.name,
      patientEmail:  formData.email,
      patientPhone:  formData.phone,
      date:          slot.date,
      time:          slot.time,
      reason:        formData.reason,
      status:        'pending', // all new bookings start as pending
    };

    setBookings(prev => [newBooking, ...prev]);
    setLastBooking(newBooking);
    setStep('confirm');
  }

  function resetPatientFlow() {
    setStep('doctor');
    setPhysician(null);
    setSlot(null);
    setLastBooking(null);
  }

  // ── Admin handler ────────────────────────────────────────────────────────

  function handleUpdateStatus(bookingId, newStatus) {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={styles.page}>
      {/* Top navigation bar */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logo}>✦ Vero</span>
          <nav style={styles.nav}>
            <NavBtn active={view === 'patient'} onClick={() => { setView('patient'); }}>
              Book Appointment
            </NavBtn>
            <NavBtn active={view === 'admin'} onClick={() => setView('admin')}>
              Admin View
            </NavBtn>
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main style={styles.main}>
        <div style={styles.card}>

          {view === 'patient' && (
            <>
              {/* Progress indicator at the top of the patient flow */}
              {step !== 'confirm' && (
                <ProgressBar currentStep={step} />
              )}

              {step === 'doctor'  && <DoctorSelect onSelect={handleDoctorSelect} />}
              {step === 'time'    && <TimeSelect physician={physician} onSelect={handleTimeSelect} onBack={() => setStep('doctor')} />}
              {step === 'form'    && <BookingForm physician={physician} slot={slot} onSubmit={handleFormSubmit} onBack={() => setStep('time')} />}
              {step === 'confirm' && <Confirmation booking={lastBooking} onReset={resetPatientFlow} />}
            </>
          )}

          {view === 'admin' && (
            <AdminDashboard bookings={bookings} onUpdateStatus={handleUpdateStatus} />
          )}

        </div>
      </main>
    </div>
  );
}

// Shows which step of the patient booking flow we're on
function ProgressBar({ currentStep }) {
  const steps = [
    { key: 'doctor', label: 'Choose Doctor' },
    { key: 'time',   label: 'Pick Time' },
    { key: 'form',   label: 'Your Details' },
  ];
  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div style={prog.wrapper}>
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div style={prog.step}>
            <div style={{
              ...prog.circle,
              background: i <= currentIndex ? 'var(--teal)' : 'var(--border)',
              color: i <= currentIndex ? '#fff' : 'var(--muted)',
            }}>
              {i < currentIndex ? '✓' : i + 1}
            </div>
            <span style={{ ...prog.label, color: i <= currentIndex ? 'var(--teal)' : 'var(--muted)' }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ ...prog.line, background: i < currentIndex ? 'var(--teal)' : 'var(--border)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function NavBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 18px',
        borderRadius: 20,
        border: 'none',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        background: active ? 'var(--navy)' : 'transparent',
        color: active ? '#fff' : 'var(--muted)',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--off)' },
  header: {
    background: 'var(--white)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 10,
  },
  headerInner: {
    maxWidth: 720, margin: '0 auto', padding: '14px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logo: { fontFamily: 'Lora, serif', fontSize: 20, color: 'var(--navy)', fontWeight: 600 },
  nav: { display: 'flex', gap: 6 },
  main: { maxWidth: 720, margin: '0 auto', padding: '36px 24px' },
  card: {
    background: 'var(--white)',
    borderRadius: 16,
    padding: '32px 36px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--border)',
  },
};

const prog = {
  wrapper: { display: 'flex', alignItems: 'center', marginBottom: 32 },
  step: { display: 'flex', alignItems: 'center', gap: 8 },
  circle: {
    width: 28, height: 28, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 600, flexShrink: 0,
  },
  label: { fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' },
  line: { flex: 1, height: 2, margin: '0 10px' },
};
