import React, { useState } from 'react';

function matchSymptoms(symptoms) {
  const text = symptoms.toLowerCase();
  const rules = [
    { specialty: 'Cardiology', keywords: ['chest', 'heart', 'palpitation', 'blood pressure', 'shortness of breath', 'dizzy', 'fainting'], reason: 'Your symptoms may be related to your heart or cardiovascular system.', urgency: 'soon' },
    { specialty: 'Pediatrics', keywords: ['child', 'baby', 'infant', 'kid', 'toddler', 'my son', 'my daughter', 'vaccination'], reason: 'For children and infants, a pediatrician is the right choice.', urgency: 'routine' },
    { specialty: 'Internal Medicine', keywords: ['fatigue', 'chronic', 'diabetes', 'thyroid', 'kidney', 'liver', 'weight loss', 'night sweats', 'persistent'], reason: 'Your symptoms suggest a complex condition that an internal medicine specialist handles best.', urgency: 'soon' },
    { specialty: 'Family Medicine', keywords: ['cold', 'flu', 'cough', 'sore throat', 'stomach', 'headache', 'back pain', 'rash', 'checkup', 'nausea', 'fever'], reason: 'A family medicine doctor is a great first point of contact for your symptoms.', urgency: 'routine' },
  ];
  for (const rule of rules) {
    if (rule.keywords.some(k => text.includes(k))) return { specialty: rule.specialty, reason: rule.reason, urgency: rule.urgency };
  }
  return { specialty: 'Family Medicine', reason: 'When in doubt, a family medicine doctor is the best starting point.', urgency: 'routine' };
}

export default function SymptomHelper({ onSelectPhysician, physicians }) {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [open, setOpen] = useState(false);

  function handleAsk() {
    if (!symptoms.trim()) return;
    setLoading(true);
    setSuggestion(null);
    setTimeout(() => {
      const result = matchSymptoms(symptoms);
      const doctor = physicians.find(p => p.specialty === result.specialty);
      setSuggestion({ ...result, doctor });
      setLoading(false);
    }, 900);
  }

  const urgencyColors = {
    routine: { bg: '#D1FAE5', text: '#065F46' },
    soon: { bg: '#FEF3C7', text: '#92400E' },
  };

  return (
    <div style={styles.wrapper}>
      <button style={styles.trigger} onClick={() => setOpen(!open)}>
        <span>✦</span> Not sure which doctor to see? <span style={{ marginLeft: 'auto' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={styles.panel}>
          <p style={styles.panelDesc}>Describe your symptoms and our AI will suggest the right specialist for you.</p>
          <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="e.g. I've had chest tightness and shortness of breath..." rows={3} style={styles.textarea} />
          <button style={{ ...styles.askBtn, opacity: loading || !symptoms.trim() ? 0.5 : 1 }} onClick={handleAsk} disabled={loading || !symptoms.trim()}>
            {loading ? 'Thinking...' : '✦ Suggest a Doctor'}
          </button>
          {suggestion && (
            <div style={styles.result}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <p style={styles.resultTitle}>Recommended: {suggestion.specialty}</p>
                <span style={{ ...styles.urgencyBadge, background: urgencyColors[suggestion.urgency]?.bg, color: urgencyColors[suggestion.urgency]?.text }}>
                  {suggestion.urgency === 'routine' ? '🟢' : '🟡'} {suggestion.urgency}
                </span>
              </div>
              <p style={styles.resultReason}>{suggestion.reason}</p>
              {suggestion.doctor && (
                <button style={styles.selectDocBtn} onClick={() => { setOpen(false); onSelectPhysician(suggestion.doctor); }}>
                  Book with {suggestion.doctor.name} →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { marginBottom: 28 },
  trigger: { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--teal-lt)', border: '1.5px solid #b2dfe4', borderRadius: 10, padding: '12px 18px', width: '100%', cursor: 'pointer', fontSize: 14, color: 'var(--teal)', fontWeight: 500 },
  panel: { background: 'var(--white)', border: '1.5px solid #b2dfe4', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '18px 18px 20px' },
  panelDesc: { fontSize: 13, color: 'var(--muted)', marginBottom: 12 },
  textarea: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'DM Sans, sans-serif', resize: 'vertical', outline: 'none', marginBottom: 12, color: 'var(--text)' },
  askBtn: { padding: '10px 24px', background: 'var(--teal)', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none' },
  result: { marginTop: 16, background: 'var(--teal-lt)', border: '1px solid #b2dfe4', borderRadius: 10, padding: '14px 16px' },
  resultTitle: { fontFamily: 'Lora, serif', fontSize: 15, color: 'var(--navy)', fontWeight: 600 },
  urgencyBadge: { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  resultReason: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 },
  selectDocBtn: { padding: '9px 20px', background: 'var(--navy)', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none' },
};
