// ── Mock Physicians ──────────────────────────────────────────────────────────
export const physicians = [
  {
    id: 'p1',
    name: 'Dr. Sarah Chen',
    specialty: 'Family Medicine',
    bio: 'Dr. Chen has 12 years of experience in preventive care and chronic disease management.',
    initials: 'SC',
    color: '#2D9CDB',
  },
  {
    id: 'p2',
    name: 'Dr. Marcus Webb',
    specialty: 'Internal Medicine',
    bio: 'Dr. Webb focuses on complex adult conditions and coordinating multi-specialty care.',
    initials: 'MW',
    color: '#1A7F8E',
  },
  {
    id: 'p3',
    name: 'Dr. Priya Nair',
    specialty: 'Pediatrics',
    bio: 'Dr. Nair is passionate about child development and family-centred care.',
    initials: 'PN',
    color: '#7C5CBF',
  },
  {
    id: 'p4',
    name: 'Dr. James Okafor',
    specialty: 'Cardiology',
    bio: 'Dr. Okafor specialises in preventive cardiology and heart failure management.',
    initials: 'JO',
    color: '#E06C4C',
  },
];

// ── Helper: generate time slots for the next 7 days ──────────────────────────
function generateSlots(physicianId) {
  const slots = [];
  const times = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
                 '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

  for (let d = 1; d <= 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const label = date.toLocaleDateString('en-CA', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
    const iso = date.toISOString().split('T')[0];

    // Only show some times per day to look realistic
    times.slice(0, 6).forEach((time, i) => {
      if ((d + i) % 3 !== 0) { // leave some gaps so not every slot shows
        slots.push({ id: `${physicianId}-${iso}-${i}`, date: label, iso, time });
      }
    });
  }
  return slots;
}

export const availableSlots = {
  p1: generateSlots('p1'),
  p2: generateSlots('p2'),
  p3: generateSlots('p3'),
  p4: generateSlots('p4'),
};

// ── Pre-existing bookings (for admin view) ───────────────────────────────────
export const initialBookings = [
  {
    id: 'b001',
    physicianId: 'p1',
    physicianName: 'Dr. Sarah Chen',
    patientName: 'Emily Tran',
    patientEmail: 'emily.tran@email.com',
    patientPhone: '416-555-0192',
    date: 'Mon, May 5',
    time: '9:00 AM',
    reason: 'Annual check-up and blood pressure follow-up.',
    status: 'confirmed',
  },
  {
    id: 'b002',
    physicianId: 'p2',
    physicianName: 'Dr. Marcus Webb',
    patientName: 'Daniel Park',
    patientEmail: 'daniel.park@email.com',
    patientPhone: '647-555-0348',
    date: 'Mon, May 5',
    time: '10:00 AM',
    reason: 'Persistent fatigue and dizziness for the past two weeks.',
    status: 'pending',
  },
  {
    id: 'b003',
    physicianId: 'p4',
    physicianName: 'Dr. James Okafor',
    patientName: 'Susan Li',
    patientEmail: 'susan.li@email.com',
    patientPhone: '905-555-0274',
    date: 'Tue, May 6',
    time: '3:00 PM',
    reason: 'Chest discomfort during exercise.',
    status: 'pending',
  },
  {
    id: 'b004',
    physicianId: 'p3',
    physicianName: 'Dr. Priya Nair',
    patientName: 'Carlos Mendez',
    patientEmail: 'carlos.m@email.com',
    patientPhone: '416-555-0511',
    date: 'Wed, May 7',
    time: '11:00 AM',
    reason: "Child's 18-month wellness visit.",
    status: 'cancelled',
  },
];
