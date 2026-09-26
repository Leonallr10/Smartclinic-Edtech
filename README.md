# SmartClinic

An AI-powered clinic management platform that streamlines healthcare workflows for patients, doctors, and administrators. Built with Next.js 16, it integrates Groq for intelligent symptom triage, visit summarization, prescription drafting, and semantic medical record search.

**Live app:** [https://smartclinic-edtech.vercel.app](https://smartclinic-edtech.vercel.app/)  
**Repository:** [https://github.com/Leonallr10/Smartclinic-Edtech](https://github.com/Leonallr10/Smartclinic-Edtech)

## Screenshots

| Landing | Patient | Doctor | Admin |
|---------|---------|--------|-------|
| ![Landing](docs/screenshots/01-landing.png) | ![Patient](docs/screenshots/03-patient-dashboard.png) | ![Doctor](docs/screenshots/04-doctor-dashboard.png) | ![Admin](docs/screenshots/05-admin-dashboard.png) |

Mobile landing: ![Mobile](docs/screenshots/06-landing-mobile.png)

## Features

### Patient Portal
- **AI Symptom Checker** — urgency assessment (LOW/MEDIUM/HIGH/EMERGENCY) with guidance
- **Appointment Booking** — schedule consultations with verified doctors
- **Medical Records** — diagnosis history, visit summaries, and prescriptions
- **Profile Management** — blood group, DOB, address, and contact details

### Doctor Portal
- **Live Session View** — manage active appointments with AI-assisted tools
- **AI Visit Summary** — structured summaries from clinical notes
- **AI Prescription Drafting** — formal prescriptions from shorthand
- **Smart Search** — natural language search across medical records
- **Availability Control** — toggle availability for new appointments

### Admin Panel
- **User Management** — CRUD on platform users
- **Doctor Verification** — approve/reject doctor registrations
- **Platform Analytics** — users, appointments, and records overview

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Radix UI |
| Backend | Next.js API Routes, Prisma 7 ORM |
| Database | PostgreSQL (Supabase) |
| AI/ML | Groq SDK |
| Auth | JWT (`jose`) + HTTP-only cookies + bcryptjs |
| Validation | Zod |
| Testing | Playwright (E2E, multi-browser), Jest (unit) |

## Database Schema

```
User (id, name, email, password, role, isActive)
  ├── Patient (phone, dateOfBirth, bloodGroup, address)
  │     ├── Appointments[]
  │     ├── SymptomChecks[]
  │     ├── MedicalRecords[]
  │     └── Prescriptions[]
  └── Doctor (specialisation, licenseNumber, experienceYears, bio, isAvailable, isVerified)
        ├── Appointments[]
        ├── MedicalRecords[]
        └── Prescriptions[]

Appointment (patientId, doctorId, scheduledAt, durationMins, status, notes)
  └── MedicalRecords[]

MedicalRecord (patientId, doctorId, appointmentId, diagnosis, symptoms, aiSummary)
  └── Prescriptions[]

SymptomCheck (patientId, symptoms, aiUrgency, aiSuggestion, aiRawResponse)
```

**Roles:** `PATIENT` | `DOCTOR` | `ADMIN`  
**Appointment Status:** `PENDING` | `CONFIRMED` | `COMPLETED` | `CANCELLED`

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create Patient or Doctor account |
| POST | `/api/auth/login` | Public | Authenticate; sets HTTP-only JWT cookie |
| POST | `/api/auth/logout` | Session | Clear session cookie |
| POST | `/api/auth/forgot-password` | Public | Generate password reset link (returns relative `resetLink` for demo UX) |
| POST | `/api/auth/reset-password` | Public | Set new password with valid reset token |

### AI Features
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/symptom-check` | Patient | Analyze symptoms → urgency + suggestions |
| POST | `/api/ai/visit-summary` | Doctor | Generate structured visit summary |
| POST | `/api/ai/prescription` | Doctor | Draft formal prescription from notes |
| POST | `/api/ai/smart-search` | Doctor | Semantic search over medical records |

### Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PATCH | `/api/patients/[id]` | Patient profile |
| GET | `/api/patients/[id]/records` | Patient medical records |
| GET | `/api/patients/[id]/prescriptions` | Patient prescriptions |
| GET/PATCH | `/api/doctors/[id]` | Doctor profile |
| GET | `/api/doctors` | List doctors |
| POST/GET | `/api/appointments` | Create/list appointments |
| PATCH | `/api/appointments/[id]` | Update appointment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| POST/PATCH/DELETE | `/api/admin/users/[id]` | User CRUD |
| GET | `/api/admin/doctors` | Pending verifications |
| PATCH | `/api/admin/doctors/[id]/verify` | Verify/reject doctor |
| GET | `/api/admin/analytics` | Platform statistics |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Groq API key

### Installation

```bash
git clone https://github.com/Leonallr10/Smartclinic-Edtech.git
cd Smartclinic-Edtech
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-long-random-jwt-secret"
GROQ_API_KEY="your-groq-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

`JWT_SECRET` is **required** — the app fails closed if it is missing (no hard-coded fallback).

### Database Setup

```bash
npx prisma db push
npm run db:seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo credentials

| Role | Email | Password |
|------|--------|----------|
| **Admin** | `admin@smartclinic.com` | `Admin@123` |
| **Patient** | `patient@smartclinic.com` | `Patient@123` |
| **Doctor** | `doctor@smartclinic.com` | `Doctor@123` |

- Admin cannot be created from the public register page (Patient / Doctor only).
- After login, role dashboards are `/patient/dashboard`, `/doctor/dashboard`, `/admin/dashboard`.
- Use **Forgot password?** on `/auth/login` to generate a reset link (demo returns an on-page link).

### Testing & CI/CD

```bash
npm run lint          # ESLint
npm run test          # Jest unit tests
npm run test:e2e      # Playwright E2E (Chromium, Firefox, WebKit, Pixel 5)
npm run ci            # lint + unit tests + build
```

GitHub Actions runs on every push/PR to `main`:

1. **Lint, unit tests & build**
2. **Playwright E2E** against [https://smartclinic-edtech.vercel.app](https://smartclinic-edtech.vercel.app/) (override with `E2E_BASE_URL`)

Optional secrets: `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `E2E_PATIENT_EMAIL`, `E2E_PATIENT_PASSWORD`, `E2E_DOCTOR_EMAIL`, `E2E_DOCTOR_PASSWORD`.

### Database dump

A demo-scoped JSON dump lives in [`data/db-dump/`](data/db-dump/). See [`data/db-dump/README.md`](data/db-dump/README.md) for export/import steps.

```bash
npm run db:dump   # refresh demo dump (requires DATABASE_URL)
```

## Project Structure

```
src/
├── app/
│   ├── api/                # Backend API routes
│   │   ├── auth/           # Login, register, logout, forgot/reset password
│   │   ├── ai/             # Groq-powered AI endpoints
│   │   ├── appointments/   # Booking management
│   │   ├── patients/       # Patient data
│   │   ├── doctors/        # Doctor profiles
│   │   └── admin/          # Admin operations
│   ├── auth/               # Login, register, forgot/reset pages
│   ├── patient/            # Patient dashboard & views
│   ├── doctor/             # Doctor dashboard & session
│   └── admin/              # Admin management pages
├── components/
│   ├── ui/                 # Radix-based primitives
│   ├── layout/             # Dashboard layouts
│   └── features/           # AI & domain feature components
├── lib/
│   ├── ai.ts               # Groq client & prompts
│   ├── auth.ts             # JWT sign/verify
│   ├── prisma.ts           # Database client
│   ├── server-auth.ts      # Server-side session
│   └── validations.ts      # Zod schemas
prisma/
├── schema.prisma
└── seed.ts                 # Demo accounts
data/db-dump/               # Demo JSON dump + import docs
e2e/                        # Playwright smoke, flows, walkthrough
```

This is a **Next.js full-stack** app (UI + API in one repo), not separate `frontend/` / `backend/` folders.

## Deployment

Live app: [https://smartclinic-edtech.vercel.app](https://smartclinic-edtech.vercel.app/)

Deployed on [Vercel](https://vercel.com) with cloud PostgreSQL. CI via GitHub Actions (`.github/workflows/ci.yml`).

```bash
npm run build   # prisma generate + next build
```

Set `DATABASE_URL`, `JWT_SECRET`, `GROQ_API_KEY`, and `NEXT_PUBLIC_APP_URL` in the Vercel project env. Use the Supabase **transaction pooler** URL (port 6543) with `?pgbouncer=true` when applicable.

## Assumptions & limitations

- **Email delivery:** forgot-password generates a secure token and returns an on-page reset link for demos; production email (SMTP/Resend) is not wired.
- **AI quality:** triage/summary/prescription output depends on Groq model availability and is assistive only — not a medical diagnosis.
- **Monolith hosting:** frontend and API share one Vercel deployment (intentional for this stack).
- **RLS:** app authorization is enforced in Next.js (JWT + role checks). Supabase Row Level Security is not the primary access layer when using Prisma with a direct connection string.
- **Demo data:** seed/dump accounts are for reviewers; change passwords before any real production use.

### Future improvements
- Production email for password resets
- Broader appointment conflict / calendar UX
- Stronger audit logging and rate limiting on auth/AI routes
- Optional Supabase RLS policies if the Data API is exposed

## License

MIT
