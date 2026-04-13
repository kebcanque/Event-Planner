Event Planner
Features
Dashboard & Event Overview
Metric Titles: Quick-glance stats showing "Total Events","Upcoming This Week," and " Reamaining Slots (base on your 100-event cap).
Dynamic List View: A clean, Sortabale table displaying event titles, dates, and status badges (e.g.,Confirmed Tentative, Completed.)
Search & Filter: Real-time filtering by date range or location to find  specific entries instantly.
Intelligent Event Management(CRUD)
Smart Creation Wizard: A guided form for adding new events. It includes a Capacity Guard that praoctively notifies the user if ther are approaching the 100-event limit.
Inline Editing: The ability to update event deatils (like changing venue or time) directly from the list view without page reloads.
Soft Deletion: Instead of permanent removal, a 'Trash', or Archive" state can be implemented to prevent accidental data loss while still freeing up one of the 100 slots.
Logistic & Detail Tracking
Location integration: A field for venue addresses with a "View on Map" shortcut for quick navigation.
Description Markdown: Support for rich text in he description field to create organized itineraries, bulleted guest list, or bolded reminders.
Countdown Timers: A visual "Days Until" indacator for all upcoming events to assist in priority planning.
Technical Guardrails & Performance
Feature | Technical Benefit | User Impact
Contraint Enforcement | Server-side validation of the 100- event limit. | Prevents broken bloat and maintains app speed.
Input Validation | Sanitizes all text and date inputs. | Prevent broken layouts or "ghost" event with invalid dates.
Auto-Archiving | Automatically past event as " Completed." | Keeps the focus on active task witout manual cleanup.

Tech Stack
Frontend
HTML5 & CSS3: Modern layouts using CSS Grid and Flexbox.
Vanilla JavaScript: Modular architecture using ES Modules.
FontAwesome: High-quality icons for a better user experience.
Backend
Node.js & Express: Fast and scalable server-side environment.
MySQL: Relational database for structured data management.
mysql2: Modern MySQL driver for Node.js.
CORS & Dotenv: Enhanced security and environment configuration.

PROJECT STRUCTRES
Event Planner/
├── client/                # Frontend application
│   ├── js/                # JavaScript modules (api.js, app.js)
│   ├── index.html         # Main entry point
│   └── style.css          # Global styles
├── server/                # Backend API
│   ├── config/            # Database configuration
│   ├── controllers/       # Business logic for each resource
│   ├── routes/            # API endpoints
│   ├── index.js           # Server entry point
│   ├── schema.sql         # Database schema
│   └── init-db.js         # Database initialization script
│   └── .env # Environment variables
└── API_DOCUMENTATION.md   # Detailed API endpoint reference