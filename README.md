# SmartClinic

An AI-powered clinic management platform that streamlines healthcare workflows for patients, doctors, and administrators. Built with Next.js 16, it integrates Groq's Llama 3.3-70B model for intelligent symptom triage, visit summarization, prescription drafting, and semantic medical record search.

## Features

### Patient Portal
- **AI Symptom Checker** - Describe symptoms and receive AI-powered urgency assessment (LOW/MEDIUM/HIGH/EMERGENCY) with actionable guidance
- **Appointment Booking** - Schedule consultations with verified doctors
- **Medical Records** - View diagnosis history, visit summaries, and prescriptions
- **Profile Management** - Manage personal health information (blood group, DOB, address)

### Doctor Portal
- **Live Session View** - Manage active appointments with AI-assisted tools
- **AI Visit Summary** - Auto-generate structured visit summaries from clinical notes
- **AI Prescription Drafting** - Convert shorthand instructions into formal prescriptions
- **Smart Search** - Natural language search across patient medical records
- **Availability Control** - Toggle availability status for new appointments

### Admin Panel
- **User Management** - CRUD operations on all platform users
- **Doctor Verification** - Review and approve/reject doctor registrations
- **Platform Analytics** - Overview statistics (users, appointments, records)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Radix UI |
| Backend | Next.js API Routes, Prisma 7 ORM |
| Database | PostgreSQL (Supabase) |
| AI/ML | Groq SDK + Llama 3.3-70B |
| Auth | JWT (jose) + HTTP-only cookies + bcryptjs |
| Validation | Zod |
| Testing | Playwright (E2E), Jest (Unit) |

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
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account (Patient/Doctor) |
| POST | `/api/auth/login` | Authenticate & receive JWT |
| POST | `/api/auth/logout` | Clear session |

### AI Features
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/symptom-check` | Patient | Analyze symptoms, return urgency + suggestions |
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
| GET | `/api/doctors` | List all doctors |
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
git clone https://github.com/Leonallr10/smartclinic.git
cd smartclinic
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-jwt-secret"
GROQ_API_KEY="your-groq-api-key"
```

### Database Setup

```bash
npx prisma db push
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo credentials

Use these accounts to explore the app after seeding / connecting to the project database:

| Role | Email | Password |
|------|--------|----------|
| **Admin** | `admin@smartclinic.com` | `Admin@123` |

- Admin cannot be created from the public register page (Patient / Doctor only).
- After login, open `/admin/dashboard` to manage users and verify doctors.
- If the password was changed, use **Forgot password?** on `/auth/login` to reset it.

### Testing & CI/CD

```bash
npm run lint          # ESLint
npm run test          # Jest unit tests
npm run test:e2e      # Playwright E2E (defaults to the live deploy URL)
npm run ci            # lint + unit tests + build
```

GitHub Actions runs on every push/PR to `main`:

1. **Lint, unit tests & build**
2. **Playwright E2E** against [https://smartclinic-edtech.vercel.app](https://smartclinic-edtech.vercel.app/) (override with repo variable `E2E_BASE_URL`)

Optional secrets: `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` (defaults to the demo admin above).

## Project Structure

```
src/
├── app/
│   ├── api/                # Backend API routes
│   │   ├── auth/           # Login, register, logout
│   │   ├── ai/            # Groq-powered AI endpoints
│   │   ├── appointments/   # Booking management
│   │   ├── patients/       # Patient data
│   │   ├── doctors/        # Doctor profiles
│   │   └── admin/          # Admin operations
│   ├── auth/               # Login & register pages
│   ├── patient/            # Patient dashboard & views
│   ├── doctor/             # Doctor dashboard & session
│   └── admin/              # Admin management pages
├── components/
│   ├── ui/                 # Radix-based primitives
│   ├── layout/             # Dashboard layouts
│   └── features/           # AI feature components
├── lib/
│   ├── ai.ts              # Groq client & prompts
│   ├── auth.ts            # JWT sign/verify
│   ├── prisma.ts          # Database client
│   ├── server-auth.ts     # Server-side session
│   └── validations.ts     # Zod schemas
prisma/
└── schema.prisma           # Database models
```

## Deployment

Live app: [https://smartclinic-edtech.vercel.app](https://smartclinic-edtech.vercel.app/)

Deployed on [Vercel](https://vercel.com) with Supabase PostgreSQL. Continuous integration is configured via GitHub Actions (`.github/workflows/ci.yml`).

```bash
npm run build   # Runs prisma generate + next build
```

Set the `DATABASE_URL` to the Supabase **transaction pooler** connection string (port 6543) with `?pgbouncer=true` for serverless compatibility.

## License

MIT
