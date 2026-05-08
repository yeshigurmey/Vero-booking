import React, { useState } from 'react';

// This component uses the Anthropic API to suggest the right doctor
// based on the patient's symptoms. It's the "AI" feature that makes
// this app stand out — similar to what Vero actually builds.
export default function SymptomHelper({ onSelectPhysician, physicians }) {
  const [symptoms, setSymptoms]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [suggestion, setSuggestion] = useState(null); // { specialty, reason, doctorId }
  const [error, setError]         = useState('');
  const [open, setOpen]           = useState(false);

  async function handleAsk() {
    if (!symptoms.trim()) return;
    setLoading(true);
    setError('');
    setSuggestion(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a helpful medical triage assistant for a clinic booking system.
Given a patient's symptoms, suggest which type of physician they should see from this list:
- Family Medicine (general health, check-ups, common illness)
- Internal Medicine (complex adult conditions, chronic disease)
- Pediatrics (children and infants)
- Cardiology (heart, chest pain, blood pressure)

Respond ONLY with valid JSON in this exact format, no other text:
{
  "specialty": "one of the four specialties above",
  "reason": "one sentence explaining why in simple, friendly language",
  "urgency": "routine" or "soon" or "urgent"
}`,
          messages: [{ role: 'user', content: `Patient symptoms: ${symptoms}` }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || '';

      // Parse the JSON response from Claude
      const parsed = JSON.parse(text.trim());

      // Find the matching doctor from our physician list
      const matchedDoc = physicians.find(
        p => p.specialty.toLowerCase() === parsed.specialty.toLowerCase()
      );

      setSuggestion({ ...parsed, doctor: matchedDoc });
    } catch (e) {
      setError('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const urgencyColors = {
    routine: { bg: '#D1FAE5', text: '#065F46' },
    soon:    { bg: '#FEF3C7', text: '#92400E' },
    urgent:  { bg: '#FEE2E2', text: '#991B1B' },
  };

  return (
    <div style={styles.wrapper}>
      {/* Collapsed trigger button */}
      <button style={styles.trigger} onClick={() => setOpen(!open)}>
        <span style={styles.sparkle}>✦</span>
        Not sure which doctor to see?
        <span style={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Expandable panel */}
      {open && (
        <div style={styles.panel}>
          <p style={styles.panelDesc}>
            Describe your symptoms and our AI will suggest the right specialist for you.
          </p>

          <textarea
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            placeholder="e.g. I've had chest tightness and shortness of breath during exercise for the past week..."
            rows={3}
            style={styles.textarea}
          />

          <button
            style={{ ...styles.askBtn, opacity: loading || !symptoms.trim() ? 0.5 : 1 }}
            onClick={handleAsk}
            disabled={loading || !symptoms.trim()}
          >
            {loading ? 'Thinking...' : '✦ Suggest a Doctor'}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          {/* AI suggestion result */}
          {suggestion && (
            <div style={styles.result}>
              <div style={styles.resultHeader}>
                <p style={styles.resultTitle}>Recommended: {suggestion.specialty}</p>
                {suggestion.urgency && (
                  <span style={{
                    ...styles.urgencyBadge,
                    background: urgencyColors[suggestion.urgency]?.bg,
                    color: urgencyColors[suggestion.urgency]?.text,
                  }}>
                    {suggestion.urgency === 'routine' ? '🟢' : suggestion.urgency === 'soon' ? '🟡' : '🔴'} {suggestion.urgency}
                  </span>
                )}
              </div>
              <p style={styles.resultReason}>{suggestion.reason}</p>

              {suggestion.doctor && (
                <button
                  style={styles.selectDocBtn}
                  onClick={() => {
                    setOpen(false);
                    onSelectPhysician(suggestion.doctor);
                  }}
                >
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
  trigger: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--teal-lt)', border: '1.5px solid #b2dfe4',
    borderRadius: 10, padding: '12px 18px', width: '100%',
    cursor: 'pointer', fontSize: 14, color: 'var(--teal)', fontWeight: 500,
  },
  sparkle: { fontSize: 16 },
  chevron: { marginLeft: 'auto', fontSize: 11 },
  panel: {
    background: 'var(--white)', border: '1.5px solid #b2dfe4',
    borderTop: 'none', borderRadius: '0 0 10px 10px',
    padding: '18px 18px 20px',
  },
  panelDesc: { fontSize: 13, color: 'var(--muted)', marginBottom: 12 },
  textarea: {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid var(--border)', fontSize: 14,
    fontFamily: 'DM Sans, sans-serif', resize: 'vertical',
    outline: 'none', marginBottom: 12, color: 'var(--text)',
  },
  askBtn: {
    padding: '10px 24px', background: 'var(--teal)', color: '#fff',
    borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
    border: 'none', transition: 'opacity 0.2s',
  },
  error: { color: 'var(--cancelled)', fontSize: 13, marginTop: 10 },
  result: {
    marginTop: 16, background: 'var(--teal-lt)',
    border: '1px solid #b2dfe4', borderRadius: 10, padding: '14px 16px',
  },
  resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  resultTitle: { fontFamily: 'Lora, serif', fontSize: 15, color: 'var(--navy)', fontWeight: 600 },
  urgencyBadge: { fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  resultReason: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 },
  selectDocBtn: {
    padding: '9px 20px', background: 'var(--navy)', color: '#fff',
    borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
  },
};
