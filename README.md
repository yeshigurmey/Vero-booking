# Vero — Patient Booking System

A lightweight patient appointment booking app built as a technical work sample.

---

## How to Run

**Prerequisites:** Node.js (v18+) installed on your machine.

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/vero-booking.git
cd vero-booking

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:5173 in your browser
```

No environment variables or database setup required — the app runs entirely on mock data.

---

## What I Built

A single-page React application with two views:

### Patient Flow
A guided 3-step booking process:
1. **Choose a Physician** — browse available doctors with specialty and bio
2. **Pick a Time** — select from available slots grouped by day
3. **Your Details** — fill in name, contact info, and reason for visit
4. **Confirmation** — summary screen with pending status

### Admin / Physician View
A dashboard where clinic staff can:
- See all bookings (including newly submitted ones from the patient flow)
- Filter by status: All, Pending, Confirmed, Cancelled
- Confirm or cancel pending appointments
- View patient contact info and reason for visit at a glance

---

## Key Technical & Product Decisions

**No backend / local state only**
All data lives in React state seeded from a `mockData.js` file. The patient and admin views share the same state, so a booking made in the patient flow immediately appears in the admin dashboard — simulating a real-time feel without infrastructure.

**Vite + React**
Vite was chosen for fast startup and zero config. React's component model maps naturally to the multi-step flow and the admin list.

**Step-based patient flow over a single long form**
Breaking booking into steps (doctor → time → details) reduces cognitive load and mirrors how real scheduling UX works (e.g. Calendly, ZocDoc). Each step is its own component with a clear single responsibility.

**Bookings start as "pending"**
New bookings are always `pending` by default, requiring an admin to confirm. This reflects a realistic clinical workflow where appointments need staff review before being locked in.

**Mock data with realistic slot generation**
Available time slots are generated programmatically for the next 7 weekdays with intentional gaps to look realistic, rather than a perfectly uniform grid.

---

## What I Would Improve With More Time

- **Persistent storage** — swap mock state for a lightweight backend (e.g. Supabase or a simple Express + SQLite API) so bookings survive page refreshes
- **Authentication** — separate patient and admin sessions; patients should only see their own bookings
- **Email notifications** — send a confirmation email to the patient when their booking status changes
- **Real calendar integration** — connect to Google Calendar or iCal for slot availability
- **Search and filtering in admin** — filter by physician, date range, or patient name
- **Mobile responsiveness** — the layout is functional on mobile but could be more polished
- **Accessibility** — add proper ARIA labels, keyboard navigation, and focus management throughout
