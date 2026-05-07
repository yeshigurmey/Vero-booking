import React, { useState } from 'react';

// Step 3: patient fills in their personal details and reason for visit.
export default function BookingForm({ physician, slot, onSubmit, onBack }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});

  // Update a single field in the form state
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear error on type
  }

  // Simple validation before submitting
  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Please enter your full name.';
    if (!form.email.includes('@')) newErrors.email = 'Please enter a valid email.';
    if (!form.phone.trim()) newErrors.phone = 'Please enter your phone number.';
    if (!form.reason.trim()) newErrors.reason = 'Please describe your reason for visit.';
    return newErrors;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  }

  return (
    <div style={styles.wrapper}>
      <button style={styles.back} onClick={onBack}>← Back</button>

      <h2 style={styles.heading}>Your Details</h2>

      {/* Appointment summary box */}
      <div style={styles.summary}>
        <p style={styles.summaryTitle}>Appointment Summary</p>
        <p style={styles.summaryLine}><span style={styles.summaryKey}>Doctor</span> {physician.name} — {physician.specialty}</p>
        <p style={styles.summaryLine}><span style={styles.summaryKey}>Date</span> {slot.date}</p>
        <p style={styles.summaryLine}><span style={styles.summaryKey}>Time</span> {slot.time}</p>
      </div>

      {/* Form fields */}
      <div style={styles.fields}>
        <Field label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Jane Smith" />
        <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="jane@example.com" />
        <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="416-555-0100" />

        <div style={styles.fieldWrapper}>
          <label style={styles.label}>Reason for Visit</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Briefly describe your symptoms or reason for the appointment..."
            rows={4}
            style={{ ...styles.input, resize: 'vertical', ...(errors.reason ? styles.inputError : {}) }}
          />
          {errors.reason && <p style={styles.errorMsg}>{errors.reason}</p>}
        </div>
      </div>

      <button style={styles.submit} onClick={handleSubmit}>
        Confirm Booking
      </button>
    </div>
  );
}

// Reusable single-line input field
function Field({ label, name, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
      />
      {error && <p style={styles.errorMsg}>{error}</p>}
    </div>
  );
}

const styles = {
  wrapper: { paddingBottom: 40 },
  back: { background: 'none', color: 'var(--teal)', fontSize: 14, marginBottom: 20, padding: 0, cursor: 'pointer' },
  heading: { fontSize: 26, color: 'var(--navy)', marginBottom: 20 },
  summary: {
    background: 'var(--teal-lt)',
    border: '1px solid #b2dfe4',
    borderRadius: 10,
    padding: '16px 20px',
    marginBottom: 28,
  },
  summaryTitle: { fontWeight: 600, color: 'var(--teal)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 },
  summaryLine: { fontSize: 14, color: 'var(--navy)', marginBottom: 4 },
  summaryKey: { fontWeight: 600, marginRight: 8 },
  fields: { display: 'grid', gap: 18 },
  fieldWrapper: {},
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--navy)', marginBottom: 6 },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 8,
    border: '1.5px solid var(--border)',
    fontSize: 15,
    color: 'var(--text)',
    background: 'var(--white)',
    transition: 'border-color 0.15s',
    outline: 'none',
  },
  inputError: { borderColor: 'var(--cancelled)' },
  errorMsg: { fontSize: 12, color: 'var(--cancelled)', marginTop: 4 },
  submit: {
    marginTop: 28,
    width: '100%',
    padding: '15px',
    background: 'var(--navy)',
    color: '#fff',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
};
