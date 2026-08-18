# CareerPilot 🚀

A full-stack job application tracker built with **React**, **Node.js/Express**, **PostgreSQL**, and **Prisma**. CareerPilot helps job seekers organize every opportunity, monitor their interview pipeline, and take the stress out of the job hunt. The backend is built as a REST API and tested using **Postman**.

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
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Axios
- Lucide React

### Backend
- Node.js
- Express 5
- TypeScript
- REST API
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcryptjs
- Zod

**API Testing**
- Postman
  
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

## 🔌 API Reference

### Base URL: `http://localhost:5000/api`

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

## 🔒 Authentication Flow

1. **Register** → Creates a user account with a bcrypt-hashed password. Automatically redirects to the Login page with the registered email pre-filled.
2. **Login** → Validates credentials, returns a signed JWT token.
3. **Dashboard** → JWT is stored in `localStorage` and attached to all API requests via an Axios interceptor.
4. **Logout** → Clears JWT and user data from `localStorage`, redirects to landing page.

