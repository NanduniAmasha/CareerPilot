# CareerPilot 🚀

A full-stack job application tracker built with **React**, **Node.js/Express**, **PostgreSQL**, and **Prisma**. CareerPilot helps job seekers organize every opportunity, monitor their interview pipeline, and take the stress out of the job hunt.

---

## ✨ Features

- **Application Pipeline** — Track every application across stages: `Saved → Applied → Interview → Offer → Rejected`
- **Real-time Metrics** — Dashboard counters for total applications, interviews, and offers at a glance
- **Instant Search & Filtering** — Search by company or position, and filter by status
- **Add / Edit / Delete Applications** — Full CRUD with notes per application
- **User Authentication** — Secure register & login with JWT tokens, bcrypt-hashed passwords
- **Form Validation** — Email regex, password strength, confirm-password match on all auth forms
- **Auto Login Redirect** — After signup, automatically loads the login page with the registered email pre-filled
- **Premium Dark UI** — Glassmorphism cards, gradient accents, smooth hover animations

---

## 🛠️ Tech Stack

### Frontend
| Tool | Version |
|------|---------|
| React | 19 |
| TypeScript | 6 |
| Vite | 8 |
| Tailwind CSS | 4 |
| Lucide React | Icons |
| Axios | HTTP client |

### Backend
| Tool | Version |
|------|---------|
| Node.js | — |
| Express | 5 |
| TypeScript | 7 |
| Prisma ORM | 7 |
| PostgreSQL | — |
| JSON Web Tokens (JWT) | Auth |
| bcryptjs | Password hashing |
| Zod | Request validation |

---

## 📁 Project Structure

```
CareerPilot/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Database models (User, Application)
│   │   └── migrations/          # SQL migration history
│   ├── src/
│   │   ├── controllers/         # Auth & Application controllers
│   │   ├── middleware/          # JWT auth middleware
│   │   ├── routes/              # authRoutes, applicationRoutes
│   │   ├── validators/          # Zod request validators
│   │   └── server.ts            # Express app entry point
│   ├── .env                     # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── LandingPage.tsx  # Marketing landing page
    │   │   ├── Login.tsx        # Sign in page
    │   │   ├── Register.tsx     # Sign up page
    │   │   ├── Dashboard.tsx    # Stats dashboard
    │   │   ├── ApplicationForm.tsx      # Add application form
    │   │   └── EditApplicationForm.tsx  # Edit application form
    │   ├── services/
    │   │   └── api.ts           # Axios instance with JWT interceptor
    │   ├── App.tsx              # Root routing (landing/login/signup/dashboard)
    │   └── main.tsx
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **PostgreSQL** (running locally or remote)
- **npm** or **yarn**

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CareerPilot.git
cd CareerPilot
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/career_pilot?schema=public"
JWT_SECRET="your_super_secret_key"
```

#### Run Database Migrations

```bash
npx prisma migrate deploy
```

> Or to apply schema without migration history (development):
> ```bash
> npx prisma db push
> ```

#### Start the Backend Dev Server

```bash
npm run dev
```

The API will be available at **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Start the Frontend Dev Server

```bash
npm run dev
```

The app will be available at **http://localhost:5174**

---

## 🔌 API Reference

### Base URL: `http://localhost:5000/api`

All application routes require the `Authorization: Bearer <token>` header.

#### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Log in and receive a JWT |

#### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/applications` | Get all applications for logged-in user |
| `POST` | `/applications` | Add a new application |
| `PATCH` | `/applications/:id` | Update an application |
| `DELETE` | `/applications/:id` | Delete an application |
| `GET` | `/applications/stats` | Get pipeline stats (counts per status) |

---

## 🗄️ Database Schema

```prisma
model User {
  id           Int           @id @default(autoincrement())
  name         String
  email        String        @unique
  passwordHash String
  createdAt    DateTime      @default(now())
  applications Application[]
}

model Application {
  id          Int               @id @default(autoincrement())
  company     String
  position    String
  status      ApplicationStatus @default(APPLIED)
  appliedDate DateTime          @default(now())
  notes       String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  userId      Int
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum ApplicationStatus {
  SAVED
  APPLIED
  INTERVIEW
  OFFER
  REJECTED
}
```

---

## 📜 Available Scripts

### Backend (`/backend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run compiled production server |

### Frontend (`/frontend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check & build for production |
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Preview production build |

---

## 🔒 Authentication Flow

1. **Register** → Creates a user account with a bcrypt-hashed password. Automatically redirects to the Login page with the registered email pre-filled.
2. **Login** → Validates credentials, returns a signed JWT token.
3. **Dashboard** → JWT is stored in `localStorage` and attached to all API requests via an Axios interceptor.
4. **Logout** → Clears JWT and user data from `localStorage`, redirects to landing page.

---

## 🚀 Production Build

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd ../backend && npm run build && npm run start
```

---

## 📄 License

MIT
