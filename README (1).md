# KIIT Society Hub

A centralized, responsive web platform for students of **KIIT Deemed to be University** to discover student societies, explore upcoming events (recruitments, hackathons, workshops, and competitions), and register seamlessly.

Built with a strict lightweight architecture: **Vanilla HTML, CSS, JavaScript (ES Modules)** on the frontend, and **Node.js with Express.js** on the backend.

---

## 🏛️ Features & Architecture Overview

### 1. User Roles

#### **Society Admin**
- **Server-Generated Unique Codes**: Society admin accounts are tied to specific societies via unique alphanumeric codes (e.g., `KIIT-KRS-2026`).
- **Data Isolation**: Server-enforced permissions ensure that an admin can only manage their own society's details, events, and past archives (cross-society requests return `403 Forbidden`).
- **Dashboard Capabilities**:
  - Edit society details: Name, logo (URL or file upload via multer), short tagline, full description, website, Instagram, and LinkedIn links.
  - Publish upcoming events: Title, banner image (URL or upload), date, time, campus venue, category, full description, and optional external registration link.
  - Edit and delete upcoming events.
  - Archive past events with titles, dates, descriptions, and photo galleries.
  - View real-time registered student lists for on-site events (names, roll numbers, emails, branches, years, and timestamps).

#### **Student (User)**
- **Domain-Restricted Authentication**: Signup and login validated exclusively for `@kiit.ac.in` student email addresses with numeric roll numbers.
- **Session Security**: JWT stored in an `httpOnly` secure cookie; passwords hashed with `bcryptjs`.
- **Public Browsing**: Unauthenticated users can freely explore all societies, event schedules, venues, and past archives.
- **Dual-Mode Registration**:
  - *External*: Direct link to external hackathon / competition portals (e.g., Devfolio, Unstop).
  - *On-site*: Instant one-click registration saving student snapshots into the database with duplicate prevention.
- **Profile & Registrations**: Students can update profile details and manage registered events with cancellation options.

---

## 🚀 Setup & Running Instructions

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` values:
```env
PORT=3000
JWT_SECRET="kiit_society_hub_super_secret_jwt_key_2026"
# MONGO_URI is optional; the app ships with a reliable JSON storage data layer
MONGO_URI="mongodb://localhost:27017/kiit_society_hub"
```

### 3. Database Seeding
To re-seed or initialize the 10 KIIT societies, sample events, student account, and admin credentials:
```bash
npm run seed
```

### 4. Start the Application
Run the Express server:
```bash
npm run dev
# or
npm start
```
The server will start listening at `http://localhost:3000`.

---

## 🔑 Test Credentials & Admin Codes

### Pre-Seeded Student Account
- **Email**: `251551179@kiit.ac.in`
- **Password**: `asim1179`
- **Roll Number**: `251551179` (Asim, 2nd Year CSE)

### Society Admin Testing Codes
All admin accounts use the default password: **`kiitadmin2026`**

| Society Name | Category | Admin Code | Admin Email |
| :--- | :--- | :--- | :--- |
| **KIIT Robotics Society (KRS)** | Robotics & Hardware | `KIIT-KRS-2026` | `admin.krs@kiit.ac.in` |
| **Google Developer Student Clubs (GDSC)** | Technical & Coding | `KIIT-GDSC-2026` | `admin.gdsc@kiit.ac.in` |
| **KIIT E-Cell (Entrepreneurship Cell)** | E-Cell & Entrepreneurship | `KIIT-ECELL-2026` | `admin.ecell@kiit.ac.in` |
| **Kamakshi Dance Society** | Cultural & Arts | `KIIT-KMKS-2026` | `admin.kamakshi@kiit.ac.in` |
| **KRONICLE Literary & Debating** | Social & Literary | `KIIT-KRON-2026` | `admin.kronicle@kiit.ac.in` |
| **KIIT Fest Organizing Committee (KFOC)** | Cultural & Arts | `KIIT-KFOC-2026` | `admin.kfoc@kiit.ac.in` |
| **FET / IoT Lab** | Technical & Coding | `KIIT-FET-2026` | `admin.fet@kiit.ac.in` |
| **Korus Music Society** | Cultural & Arts | `KIIT-KORUS-2026` | `admin.korus@kiit.ac.in` |
| **KIIT Automobile Society (KAS)** | Technical & Coding | `KIIT-KAS-2026` | `admin.kas@kiit.ac.in` |
| **Klarity Photography & Film Club** | Cultural & Arts | `KIIT-KLAR-2026` | `admin.klarity@kiit.ac.in` |

---

## 📡 REST API Route Reference

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register student account (`@kiit.ac.in` required)
- `POST /api/auth/login` — Student authentication
- `POST /api/auth/admin-login` — Society admin authentication via code & password
- `GET  /api/auth/me` — Inspect current session and user role
- `POST /api/auth/logout` — Invalidate JWT cookie

### Societies (`/api/societies`)
- `GET  /api/societies` — List societies (supports `?category=` and `?search=`)
- `GET  /api/societies/:id` — Society details with upcoming and past event lists
- `PUT  /api/societies/:id` — Update society information (*Admin only, own society*)
- `POST /api/societies/upload-logo` — Upload society logo (*Admin only, Multer*)

### Events (`/api/events`)
- `GET    /api/events` — Query events (`?category=`, `?societyId=`, `?search=`, `?sort=`)
- `GET    /api/events/featured` — Top 4 upcoming events for home showcase
- `GET    /api/events/:id` — Single event details & student registration status
- `POST   /api/events` — Create event (*Admin only*)
- `PUT    /api/events/:id` — Update event (*Admin only, own society*)
- `DELETE /api/events/:id` — Delete event (*Admin only, own society*)
- `GET    /api/events/:id/registrations` — View registered students (*Admin only, own society*)
- `POST   /api/events/upload-banner` — Upload event banner (*Admin only, Multer*)
- `POST   /api/events/past` — Archive a past event (*Admin only*)
- `DELETE /api/events/past/:id` — Remove archived past event (*Admin only, own society*)

### Student Users (`/api/users`)
- `GET /api/users/profile` — Fetch student profile & active registrations
- `PUT /api/users/profile` — Update student profile details
- `PUT /api/users/change-password` — Change student account password

### Registrations (`/api/registrations`)
- `POST   /api/registrations` — Register for an on-site event (checks duplicates)
- `GET    /api/registrations/my` — Fetch all events registered by the current student
- `DELETE /api/registrations/:id` — Cancel registration

---

## 📁 Project Directory Structure
```
/
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── registrationController.js
│   │   ├── societyController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── storage.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── societyRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── upload.js
│   ├── seed.js
│   ├── seedData.js
│   └── server.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── admin-dashboard.js
│   │   ├── admin-login.js
│   │   ├── api.js
│   │   ├── event.js
│   │   ├── events.js
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── profile.js
│   │   ├── signup.js
│   │   ├── societies.js
│   │   └── society.js
│   ├── images/
│   │   ├── banners/
│   │   ├── gallery/
│   │   └── logos/
│   ├── admin-dashboard.html
│   ├── admin-login.html
│   ├── event.html
│   ├── events.html
│   ├── index.html
│   ├── login.html
│   ├── profile.html
│   ├── signup.html
│   ├── societies.html
│   └── society.html
├── data/              (Persistent JSON database storage)
├── uploads/           (Multer file uploads)
├── .env.example
├── package.json
└── README.md
```
