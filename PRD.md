# Niyyah — Product Requirements Document

> **Niyyah** (نية) — "Intention." Every action in Islam begins with intention.
> This app turns intention into daily action — as simple as a to-do list, as deep as self-transformation.

---

## 1. Vision

**Niyyah is a simple, beautiful to-do and habit tracker rooted in Islamic values.**

A user sets one Super Objective (life purpose), breaks it into Personas (life roles), then tracks daily habits, views progress on a calendar, and optionally shares progress with an accountability partner.

It should feel like a clean to-do app — not an enterprise project manager.

**Core loop: Set intention > Check off daily habits > See progress on calendar > Reflect > Adjust.**

---

## 2. Core Concepts

| Concept | What it is | Example |
|---|---|---|
| **Super Objective** | Single life aim. Default: "Allah SWT's Satisfaction." Editable. | "Earn Jannah through service and knowledge." |
| **Persona** | A life role. Has a vision, one focus, a ritual, and a guardrail. | "The Scholar", "The Provider", "The Servant" |
| **Milestone** | A concrete goal under a Persona with a target date. | "Finish Juz 5 by March 15." |
| **Principle** | A guiding value, optionally tied to a Quranic verse. | "Tawakkul — Trust in Allah's plan." |
| **Non-Negotiable** | A daily habit. The core trackable unit. Categories: spiritual, health, growth. | "Pray Fajr on time." |
| **Daily Check** | Did you do it today? Yes/No. One check per habit per day. | Checked: Fajr on time (Jan 31) |
| **Streak** | Consecutive days completed. Current + longest. | Current: 14, Longest: 45 |
| **Schedule Block** | A time slot tied to a Persona. Can be a prayer block. | "06:00–07:00 Quran review" |

---

## 3. User Experience Principles

1. **Simple as a to-do app.** If it feels complicated, it's wrong. Add item, check it off, see your calendar.
2. **Everything is inline-editable.** Tap an edit icon, change text in-place, save. No modal forms for simple edits.
3. **Calendar is the centerpiece.** A month-view calendar with green/red/grey dots showing daily completion. Tap a day to see details.
4. **Light theme by default.** Clean whites, soft greys, emerald green accents. Dark mode available in settings.
5. **Typography matters.** Use Inter for Latin text (clean, highly legible). Use Amiri for Arabic text (beautiful Naskh). Generous line-height, large touch targets.
6. **Privacy first.** Accountability partner is opt-in, 1:1 only. No social feed. No public profiles.
7. **Mobile-first responsive.** Designed for phone screens. Works well on desktop too.

---

## 4. User Journey

```
1. Sign up / Log in
   ↓
2. Set Super Objective (or keep default)
   ↓
3. Create Personas (life roles) — keep it to 2-4
   Add milestones to each
   ↓
4. Add Non-Negotiables (daily habits)
   Categorize: spiritual / health / growth
   ↓
5. Optionally set Principles and Schedule blocks
   ↓
6. DAILY USE:
   Open app → See today's checklist → Check items off
   View calendar for streak/progress overview
   ↓
7. WEEKLY:
   Glance at calendar → Spot patterns → Adjust habits
   ↓
8. Optionally: Invite accountability partner
   They receive daily/weekly/monthly progress summaries
```

---

## 5. Feature Scope

### Phase 1 — Foundation (COMPLETE)

Everything below exists in the codebase today.

| Feature | Details |
|---|---|
| Auth | JWT + refresh tokens, register, login |
| Super Objective | Stored in settings, editable |
| Personas | CRUD, reorder, icon/color, free tier max 3 |
| Milestones | Per-persona goals with target date |
| Principles | Ordered list with Arabic, meaning, verse |
| Non-Negotiables | CRUD, categories (spiritual/health/growth) |
| Daily Check-in | Check/uncheck per habit per day |
| Streaks | Auto-calculated current + longest |
| Schedule Blocks | Time blocks linked to personas, prayer flag |
| Dashboard | Aggregated view: personas, schedule, progress, streaks |
| Settings | Timezone, prayer calc method, location, theme |

### Phase 2 — Calendar & Polish (NEXT)

| Feature | Priority | Description |
|---|---|---|
| **Calendar View** | P0 | Month-view calendar on the main dashboard. Each day shows a colored dot: green (all done), amber (partial), grey (nothing), hollow (future). Tap a day to expand and see which items were checked. This is the primary progress visualization. |
| **Inline Edit** | P0 | Every text field (persona name, non-negotiable title, milestone goal, principle meaning, super objective) gets a pencil icon. Tap to toggle inline edit mode. Save on blur or Enter. Cancel on Escape. No modals for simple text edits. |
| **Streak Calendar** | P0 | Per-habit calendar view showing a GitHub-style contribution grid for any single non-negotiable. Green squares for completed days. |
| **Light Theme Default** | P0 | Set light as the default theme. Clean white background (#FAFAFA), emerald accents (#059669), warm greys for text. |
| **Typography Upgrade** | P0 | Inter (400, 500, 600) for all Latin text. Amiri for Arabic text. Base size 16px, line-height 1.6. Headings in Inter 600. |
| **Grace Day** | P1 | 1 configurable grace day per streak before reset. Prevents discouragement from one miss. |
| **Daily Summary View** | P1 | Tapping a calendar day shows: date, checked items, missed items, completion %. |

### Phase 3 — Accountability Partner

| Feature | Priority | Description |
|---|---|---|
| **Partner Invite** | P0 | Invite one person by email. They create an account (or already have one). You choose what to share. |
| **Share Settings** | P0 | Per-partnership config: share daily / weekly / monthly summaries. Choose what's visible: streaks, completion %, habit names, or just an overall score. |
| **Partner Dashboard** | P0 | The partner sees a read-only view: calendar overview, completion %, active streaks. No ability to edit your data. |
| **Notifications to Partner** | P1 | Automated email/in-app notification to partner at chosen frequency (daily/weekly/monthly) with a summary. |
| **Mutual Accountability** | P2 | Both users can be each other's partner. Symmetrical sharing. |

### Phase 4 — Depth

| Feature | Priority | Description |
|---|---|---|
| Prayer Time Integration | P1 | Auto-generate prayer blocks from location + calculation method |
| Quran Progress Tracker | P2 | Track juz/surah/ayah reading and memorization |
| Weekly Reflection | P2 | Simple guided prompt: "What went well? What to adjust?" Saved as text entry. |
| PWA | P1 | Service worker + manifest for install-to-homescreen |
| Progress Report Export | P2 | PDF/image export of monthly progress |

---

## 6. Information Architecture

```
User
 ├── Super Objective (single text, editable)
 │
 ├── Personas (1..n, ordered)
 │    ├── name / arabic_name / domain
 │    ├── eventually (vision)
 │    ├── one_thing (current focus)
 │    ├── ritual / guardrail
 │    ├── icon / color
 │    ├── Milestones (1..n)
 │    │    ├── goal (editable)
 │    │    ├── target_date
 │    │    └── is_completed
 │    └── Schedule Blocks (1..n)
 │         ├── start_time / end_time
 │         ├── activity (editable)
 │         ├── day_type (weekday/weekend/daily)
 │         └── is_prayer_block
 │
 ├── Principles (1..n, ordered)
 │    ├── name / arabic (editable)
 │    ├── meaning / verse (editable)
 │    └── icon
 │
 ├── Non-Negotiables (1..n, ordered)
 │    ├── title (editable)
 │    ├── category (spiritual | health | growth)
 │    ├── Daily Checks (1 per day)
 │    └── Streak (current / longest)
 │
 ├── Accountability Partners (0..n)
 │    ├── partner_user_id
 │    ├── share_frequency (daily/weekly/monthly)
 │    ├── share_level (full/summary/score_only)
 │    └── is_accepted
 │
 └── Settings
      ├── super_objective
      ├── prayer_calculation_method
      ├── latitude / longitude
      ├── timezone / locale
      └── theme (default: "light")
```

---

## 7. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Next.js App Router                       │  │
│  │                                                           │  │
│  │  (auth)                    (app)                          │  │
│  │  ┌──────────┐   ┌──────────────────────────────────────┐  │  │
│  │  │ /login   │   │ /dashboard  ← Calendar + Overview    │  │  │
│  │  │ /register│   │ /tracker   ← Daily Checklist         │  │  │
│  │  └──────────┘   │ /personas  ← Life Roles              │  │  │
│  │                 │ /schedule  ← Time Blocks             │  │  │
│  │                 │ /principles← Guiding Values          │  │  │
│  │                 │ /settings  ← Preferences             │  │  │
│  │                 │ /partner   ← Accountability (Phase 3)│  │  │
│  │                 └──────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  packages/ui ─── Shared components (Button, Spinner, ...) │  │
│  │  packages/shared-types ─── TypeScript interfaces          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                         fetch / SWR                              │
└──────────────────────────────┼──────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API SERVER                                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     FastAPI (Python)                       │  │
│  │                                                           │  │
│  │  /api/v1/auth/*          ← Register, Login, Refresh      │  │
│  │  /api/v1/dashboard       ← Aggregated view               │  │
│  │  /api/v1/personas/*      ← CRUD + milestones + reorder   │  │
│  │  /api/v1/principles/*    ← CRUD                          │  │
│  │  /api/v1/tracker/*       ← Non-negotiables + checks      │  │
│  │  /api/v1/schedule/*      ← CRUD                          │  │
│  │  /api/v1/settings        ← Get / Update                  │  │
│  │  /api/v1/partners/*      ← Invite, Accept, View (Ph.3)   │  │
│  │  /api/v1/calendar/*      ← Month data, day detail (Ph.2) │  │
│  │                                                           │  │
│  │  core/     ← Config, DB, Security, Dependencies          │  │
│  │  models/   ← SQLAlchemy ORM models                       │  │
│  │  schemas/  ← Pydantic request/response schemas            │  │
│  │  services/ ← Business logic (auth, streaks, etc.)         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                    SQLAlchemy Async ORM                          │
│                       + Alembic migrations                      │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │    PostgreSQL        │    │      Redis           │            │
│  │                     │    │                     │            │
│  │  users              │    │  Session cache       │            │
│  │  refresh_tokens     │    │  Rate limiting       │            │
│  │  user_settings      │    │  (future: notif      │            │
│  │  personas           │    │   queue)             │            │
│  │  milestones         │    └─────────────────────┘            │
│  │  schedule_blocks    │                                       │
│  │  principles         │                                       │
│  │  non_negotiables    │                                       │
│  │  daily_checks       │                                       │
│  │  streaks            │                                       │
│  │  partnerships (Ph.3)│                                       │
│  └─────────────────────┘                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     INFRASTRUCTURE                               │
│                                                                 │
│  Turborepo          ← Monorepo orchestration                    │
│  Docker Compose     ← Local development                         │
│  Kubernetes (k8s/)  ← Production deployment                     │
│    ├── postgres.yaml                                            │
│    ├── redis.yaml                                               │
│    └── ingress.yaml                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. UI Design Specifications

### Color Palette (Light Theme — Default)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#FAFAFA` | Page background |
| `--bg-card` | `#FFFFFF` | Card surfaces |
| `--bg-hover` | `#F3F4F6` | Hover states |
| `--text-primary` | `#111827` | Headings, primary text |
| `--text-secondary` | `#6B7280` | Descriptions, timestamps |
| `--text-muted` | `#9CA3AF` | Placeholders, disabled |
| `--accent` | `#059669` | Primary actions, streaks, checked states (emerald-600) |
| `--accent-light` | `#D1FAE5` | Accent backgrounds (emerald-100) |
| `--amber` | `#D97706` | Partial completion, warnings |
| `--red` | `#DC2626` | Missed days, destructive actions |
| `--border` | `#E5E7EB` | Card borders, dividers |

### Typography

| Element | Font | Weight | Size | Line Height |
|---|---|---|---|---|
| Page title | Inter | 600 | 24px / 1.5rem | 1.3 |
| Section heading | Inter | 600 | 18px / 1.125rem | 1.4 |
| Body text | Inter | 400 | 16px / 1rem | 1.6 |
| Body medium | Inter | 500 | 16px / 1rem | 1.6 |
| Small / caption | Inter | 400 | 14px / 0.875rem | 1.5 |
| Arabic text | Amiri | 400 | 18px / 1.125rem | 1.8 |
| Arabic heading | Amiri | 700 | 22px / 1.375rem | 1.5 |

### Inline Edit Pattern

Every editable text field follows this pattern:

```
┌──────────────────────────────────────┐
│  Pray Fajr on time              [✏]  │   ← Display mode (pencil icon)
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  [Pray Fajr on time           ] [✓]  │   ← Edit mode (input + save)
└──────────────────────────────────────┘

- Tap ✏ → field becomes editable input
- Enter or tap ✓ → save via PATCH API
- Escape → cancel, revert to original
- Blur → save (auto-save on focus loss)
```

### Calendar Component

```
         January 2026
  Mo  Tu  We  Th  Fr  Sa  Su
               1   2   3   4
   5   6   7   8   9  10  11
  12  13  14  15  16  17  18
  19  20  21  22  23  24  25
  26  27  28  29  30  31

  ● = all non-negotiables completed (green)
  ◐ = partial completion (amber)
  ○ = nothing completed (grey)
  · = future / no data (muted)

  Tap any day → expands detail panel below calendar:

  ┌─ January 29, 2026 ──────── 4/5 (80%) ─┐
  │  ✅ Fajr on time                        │
  │  ✅ Read 2 pages Quran                  │
  │  ✅ Exercise 30min                      │
  │  ✅ No phone after Isha                 │
  │  ❌ Review Arabic vocabulary            │
  └─────────────────────────────────────────┘
```

---

## 9. Data Model — Existing Tables

| Table | Key Fields | Relationships |
|---|---|---|
| `users` | email, password_hash, timezone, locale, subscription_tier | -> personas, principles, non_negotiables, settings |
| `refresh_tokens` | token_hash, expires_at | -> user |
| `user_settings` | super_objective, prayer_calc_method, lat, long, theme | -> user (1:1) |
| `personas` | name, arabic_name, domain, eventually, one_thing, ritual, guardrail, points, icon, color, order | -> milestones, schedule_blocks |
| `milestones` | goal, target_date, is_completed | -> persona |
| `schedule_blocks` | start_time, end_time, activity, day_type, is_prayer_block, order | -> user, persona |
| `principles` | name, arabic, meaning, verse, icon, order | -> user |
| `non_negotiables` | title, category, order | -> user, daily_checks, streak |
| `daily_checks` | check_date, is_completed | -> non_negotiable (unique: nn_id + date) |
| `streaks` | current_streak, longest_streak, last_check_date | -> non_negotiable (1:1) |

### New Tables (Phase 2+)

**`calendar_cache`** (optional, for fast month-view queries)
| Field | Type |
|---|---|
| user_id | FK -> users |
| date | date |
| total_habits | int |
| completed_habits | int |
| completion_pct | float |

**`partnerships`** (Phase 3)
| Field | Type |
|---|---|
| id | UUID |
| inviter_id | FK -> users |
| partner_id | FK -> users (nullable until accepted) |
| partner_email | string |
| share_frequency | enum: daily / weekly / monthly |
| share_level | enum: full / summary / score_only |
| status | enum: pending / accepted / declined |
| created_at | timestamp |

---

## 10. API Routes

### Existing

| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh token |
| GET | `/api/v1/dashboard` | Aggregated dashboard |
| GET/POST | `/api/v1/personas` | List / Create |
| GET/PATCH/DELETE | `/api/v1/personas/{id}` | Single persona ops |
| POST | `/api/v1/personas/reorder` | Reorder |
| POST/DELETE | `/api/v1/personas/{id}/milestones` | Milestone ops |
| GET/POST | `/api/v1/principles` | List / Create |
| PATCH/DELETE | `/api/v1/principles/{id}` | Update / Delete |
| GET/POST | `/api/v1/tracker/non-negotiables` | List / Create |
| PATCH/DELETE | `/api/v1/tracker/non-negotiables/{id}` | Update / Delete |
| POST | `/api/v1/tracker/check` | Check off habit |
| DELETE | `/api/v1/tracker/check/{id}` | Uncheck |
| GET | `/api/v1/tracker/today` | Today's status |
| GET/PATCH | `/api/v1/settings` | Settings |
| GET/POST | `/api/v1/schedule` | List / Create block |
| PATCH/DELETE | `/api/v1/schedule/{id}` | Update / Delete block |

### New — Phase 2 (Calendar)

| Method | Route | Description |
|---|---|---|
| GET | `/api/v1/calendar/{year}/{month}` | Month overview: array of `{ date, total, completed, pct }` |
| GET | `/api/v1/calendar/{year}/{month}/{day}` | Day detail: list of non-negotiables with check status |

### New — Phase 3 (Accountability Partner)

| Method | Route | Description |
|---|---|---|
| POST | `/api/v1/partners/invite` | Send invite (email, frequency, share_level) |
| POST | `/api/v1/partners/{id}/accept` | Accept invite |
| POST | `/api/v1/partners/{id}/decline` | Decline invite |
| GET | `/api/v1/partners` | List my partnerships |
| GET | `/api/v1/partners/{id}/progress` | View partner's shared progress |
| PATCH | `/api/v1/partners/{id}` | Update share settings |
| DELETE | `/api/v1/partners/{id}` | Remove partnership |

---

## 11. Frontend Pages

| Route | Page | Phase |
|---|---|---|
| `/` | Landing | 1 (done) |
| `/login` | Login | 1 (done) |
| `/register` | Register | 1 (done) |
| `/dashboard` | Dashboard + Calendar | 1 (done), Calendar in 2 |
| `/tracker` | Daily checklist | 1 (done) |
| `/personas` | Persona management | 1 (done) |
| `/schedule` | Time-blocked schedule | 1 (done) |
| `/principles` | Guiding values | 1 (done) |
| `/settings` | Preferences | 1 (done) |
| `/partner` | Accountability partner | 3 |

---

## 12. Subscription Tiers

| Limit | Free | Pro |
|---|---|---|
| Personas | 3 | Unlimited |
| Schedule Blocks | 10 | Unlimited |
| Calendar History | 30 days | Unlimited |
| Accountability Partner | -- | 1 partner |
| Export | -- | PDF export |

---

## 13. Development Phases

### Phase 1: Foundation — COMPLETE
Auth, Personas, Principles, Non-Negotiables, Schedule, Dashboard, Settings.

### Phase 2: Calendar + Inline Edit + Polish — NEXT
- [ ] Calendar month-view component on dashboard
- [ ] Calendar API endpoints (`/calendar/{year}/{month}`, `/calendar/{year}/{month}/{day}`)
- [ ] Day-detail expansion panel
- [ ] Per-habit streak calendar (contribution grid)
- [ ] Inline edit pattern across all editable fields
- [ ] Light theme as default with color palette from Section 8
- [ ] Typography upgrade: Inter + Amiri fonts
- [ ] Streak grace day (configurable in settings)
- **New tables**: `calendar_cache` (optional)
- **New API routes**: `/api/v1/calendar/*`

### Phase 3: Accountability Partner
- [ ] Partnership model + invite/accept flow
- [ ] Share settings (frequency + visibility level)
- [ ] Partner read-only dashboard
- [ ] Automated progress notifications (email or in-app)
- [ ] Mutual accountability option
- **New tables**: `partnerships`
- **New API routes**: `/api/v1/partners/*`
- **New page**: `/partner`

### Phase 4: Depth
- [ ] Prayer time auto-calculation
- [ ] Quran progress tracker
- [ ] Weekly reflection (simple text entry)
- [ ] PWA (service worker + manifest)
- [ ] Progress report PDF export

---

## 14. File & Folder Conventions

```
niyyah/
├── apps/
│   ├── api/                    ← Python FastAPI backend
│   │   └── app/
│   │       ├── api/v1/         ← Route handlers (one file per domain)
│   │       ├── core/           ← Config, DB, security, deps
│   │       ├── models/         ← SQLAlchemy models
│   │       ├── schemas/        ← Pydantic schemas
│   │       └── services/       ← Business logic
│   └── web/                    ← Next.js frontend
│       └── src/
│           ├── app/(app)/      ← Authenticated pages
│           ├── app/(auth)/     ← Login / Register
│           ├── components/     ← Shared UI components
│           ├── hooks/          ← Custom React hooks
│           └── lib/            ← API client, auth utils
├── packages/
│   ├── shared-types/           ← TypeScript interfaces
│   └── ui/                     ← Shared React components
├── k8s/                        ← Kubernetes manifests
├── docker-compose.yml
├── turbo.json
└── PRD.md                      ← This document
```

---

## 15. Non-Functional Requirements

| Requirement | Target |
|---|---|
| API response time | < 200ms (p95) |
| Default theme | Light |
| Fonts | Inter (Latin), Amiri (Arabic) |
| Accessibility | WCAG 2.1 AA |
| Mobile | Responsive, mobile-first |
| Security | bcrypt, JWT rotation, HTTPS |
| Localization | English + Arabic |

---

## 16. Open Questions

1. **Calendar cache**: Compute month-view data on-the-fly from `daily_checks`, or maintain a `calendar_cache` table for performance?
2. **Partner notifications**: Email (requires SMTP/SendGrid) or in-app only for MVP?
3. **Prayer time library**: Python `adhan` package or external API?
4. **Pro tier billing**: Stripe or manual invite for MVP?
5. **Font loading**: Self-host Inter + Amiri or use Google Fonts CDN?

---

*This document is the single source of truth for Niyyah. All implementation work follows from here.*
