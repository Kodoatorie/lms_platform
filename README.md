# EduTech LMS

> A full-stack Learning Management System built with **Next.js**, **Node.js**, **PostgreSQL**, **MinIO** and **Docker** — supporting multi-role workflows for students, teachers and admins with trilingual UI (EN / RU / KZ).

<p align="center">
  <img src="docs/screenshots/dashboard-teacher.png" alt="Teacher Dashboard" width="700"/>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Run with Docker](#run-with-docker)
  - [Run Locally (dev)](#run-locally-dev)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

EduTech LMS is a production-ready e-learning platform where:

- **Teachers** create and publish courses with modules, lessons (text/video), assignments and materials; grade student submissions; track analytics and revenue.
- **Students** enroll in courses, watch/read lessons, submit homework (text or Google Drive link), receive grades and certificates, leave reviews.
- **Admins** manage users, issue refunds, oversee all content.

The platform supports **paid courses** with a provider-agnostic payment structure (Stripe, Kaspi, CloudPayments) and **file storage** via MinIO — keeping PostgreSQL clean of binaries.

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 (ESM) |
| Framework | Express 5 |
| Database | PostgreSQL 16 |
| Cache / Queues | Redis 7 + BullMQ |
| File Storage | MinIO (S3-compatible) |
| Auth | JWT (access + refresh) |
| Validation | Joi |
| PDF Generation | PDFKit |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) |
| Security | Helmet, express-rate-limit, input sanitization |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| State | Redux Toolkit + redux-persist |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| HTTP | Axios |
| Markdown | react-markdown + remark-gfm |
| i18n | Custom hook (EN / RU / KZ) |

### Infrastructure
| Component | Technology |
|---|---|
| Containerisation | Docker + Docker Compose |
| Reverse Proxy | Nginx (rate limiting, gzip, SSL-ready) |
| Object Storage | MinIO |
| CI-ready | Dockerfile (multi-stage, non-root) |

---

## Features

### 🎓 Courses
- Create, edit and delete courses with rich descriptions
- Upload cover images (stored in MinIO `public-assets` bucket)
- Publish / unpublish workflow — draft courses hidden from students
- Set price and currency (USD, KZT, RUB, EUR) or mark as free
- Structured curriculum: Modules → Lessons → Assignments

### 📖 Lessons
- Three content types: **Text** (Markdown editor with toolbar + live preview), **Video** (YouTube embed), **Practice**
- Per-lesson open date and deadline
- File attachments (PDF, DOCX, ZIP, images, video — up to 200 MB) stored in MinIO `course-files` bucket
- Temporary presigned download URLs (1-hour expiry) — private files never exposed directly

### 📝 Assignments & Grading
- Teachers create assignments with max score and deadline
- Students submit via **text answer** or **Google Drive link**
- Teachers grade with score + written feedback
- Grades visible on student's grades page with full submission history

### 🏆 Certificates
- Auto-generated PDF certificates on course completion
- Unique verification codes
- Publicly verifiable via `/certificates/verify/:code`

### 💳 Orders & Payments
- Provider-agnostic order model (Stripe / Kaspi / CloudPayments)
- Webhook endpoint auto-enrolls student after confirmed payment
- Full order history for students
- Revenue analytics for teachers per course
- Refund flow for admins

### ⭐ Reviews
- Two review types: **Course review** and **Teacher review**
- Star rating (1–5) with comment
- Filterable by teacher and rating
- Teachers see their own course reviews highlighted

### 📊 Analytics
- Teacher dashboard: total students, active courses, avg completion rate
- Per-course: submission stats, pending reviews
- Student dashboard: enrolled courses with progress bars, awaiting grades

### 🔔 Notifications
- In-app notifications (grade received, course update, etc.)
- Unread count badge
- Mark all as read

### 🌐 Internationalisation
- Full UI in **English**, **Russian** and **Kazakh**
- Language switcher in the navbar
- All validation messages and dynamic content translated

### 🔒 Security
- Rate limiting: auth (5 req/min), uploads (10 req/min), general API (30 req/s)
- Private files accessible only through API with auth + enrollment check
- Input sanitization on all lesson content (XSS prevention)
- Helmet security headers
- Non-root Docker containers

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                      Nginx                           │
│  :80/:443  rate limiting · gzip · SSL termination   │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
    ┌──────▼──────┐        ┌──────▼──────┐
    │  Next.js    │        │  Express    │
    │  Frontend   │        │  API :3000  │
    │  :3001      │        │             │
    └─────────────┘        └──────┬──────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
       ┌──────▼──────┐   ┌────────▼──────┐   ┌───────▼──────┐
       │ PostgreSQL  │   │    Redis       │   │    MinIO     │
       │  :5432      │   │   :6379        │   │  :9000/:9001 │
       │  (metadata) │   │ (cache/queues) │   │  (files)     │
       └─────────────┘   └───────────────┘   └──────────────┘
```

### Storage buckets

| Bucket | Access | Contents |
|--------|--------|----------|
| `public-assets` | Public (no auth) | Course cover images |
| `course-files` | Private (presigned URLs only) | Lesson materials, submission files |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose v2
- Node.js 20+ (for local dev only)

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```env
# Server
PORT=3000

# PostgreSQL
POSTGRES_URI=postgresql://edu:edu@localhost:5432/edutech

# Redis
REDIS_URL=redis://localhost:6379

# JWT — use strong random secrets in production
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_REGION=us-east-1
```

> ⚠️ Never commit `.env` to version control. The `.gitignore` excludes it automatically.

### Run with Docker

```bash
# 1. Clone the repository
git clone https://github.com/your-username/edutech-lms.git
cd edutech-lms

# 2. Copy environment file
cp .env.example .env
# Edit .env — at minimum set JWT_SECRET and JWT_REFRESH_SECRET

# 3. Start all services
docker compose up -d

# 4. Run database migrations
docker compose exec api node -e "
  import('./db/migrate.js').then(m => m.runMigrations())
"
# Or run SQL files directly:
docker compose exec postgres psql -U edu -d edutech \
  -f /migrations/add_minio_files.sql \
  -f /migrations/add_publishing_and_orders.sql
```

Services will be available at:

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost/api |
| Swagger docs | http://localhost/api-docs |
| MinIO Console | http://localhost:9001 |

### Run Locally (dev)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev         # nodemon, restarts on change

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev         # Next.js dev server on :3001
```

You'll also need PostgreSQL, Redis and MinIO running locally or via Docker:

```bash
# Start only infrastructure services
docker compose up -d postgres redis minio
```

---

## API Reference

Full interactive documentation is available at `/api-docs` (Swagger UI) when the server is running.

### Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Tokens expire in 15 minutes. Use `POST /api/auth/refresh` with your refresh token to get a new access token.

### Core Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login, returns access + refresh tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Invalidate refresh token |
| `GET` | `/api/auth/me` | Current user profile |

#### Courses
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/courses` | All | List courses (students see published only) |
| `POST` | `/api/courses` | Teacher | Create course |
| `GET` | `/api/courses/:id` | All | Course details + curriculum |
| `PATCH` | `/api/courses/:id` | Teacher | Update title, description, price |
| `DELETE` | `/api/courses/:id` | Teacher | Delete course |
| `PATCH` | `/api/courses/:id/publish` | Teacher | Publish course |
| `PATCH` | `/api/courses/:id/unpublish` | Teacher | Unpublish course |
| `POST` | `/api/courses/:id/cover` | Teacher | Upload cover image (≤ 5 MB) |

#### Lessons & Materials
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/modules/:id/lessons` | Teacher | Create lesson |
| `GET` | `/api/lessons/:id` | Enrolled | Get lesson content |
| `POST` | `/api/lessons/:id/complete` | Student | Mark lesson complete |
| `POST` | `/api/lessons/:id/files` | Teacher | Upload material (≤ 200 MB) |
| `GET` | `/api/lessons/:id/files` | Enrolled | List lesson materials |
| `GET` | `/api/files/:id/download` | Enrolled | Get presigned download URL (1h) |

#### Assignments & Submissions
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/lessons/:id/assignments` | Teacher | Create assignment |
| `POST` | `/api/assignments/:id/submit` | Student | Submit answer or Drive link |
| `GET` | `/api/assignments/:id/my-submission` | Student | My submission + grade |
| `GET` | `/api/assignments/:id/submissions` | Teacher | All submissions |
| `POST` | `/api/submissions/:id/grade` | Teacher | Grade a submission |

#### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/orders` | Student | Create order for paid course |
| `GET` | `/api/orders/me` | Student | My order history |
| `POST` | `/api/orders/webhook` | Public | Payment provider webhook |
| `PATCH` | `/api/orders/:id/refund` | Admin | Issue refund |

#### Reviews
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/courses/:id/reviews` | Student | Leave course review |
| `GET` | `/api/courses/:id/reviews` | All | Course reviews |
| `POST` | `/api/teachers/:id/reviews` | Student | Leave teacher review |
| `GET` | `/api/teachers/:id/reviews` | All | Teacher reviews |

### File Upload Limits

| File type | Max size | Allowed formats |
|-----------|----------|-----------------|
| Course cover | 5 MB | JPEG, PNG, WEBP, GIF |
| Lesson material | 200 MB | PDF, DOCX, XLSX, PPTX, ZIP, images, video, audio |
| Submission | 50 MB | Same as materials |

---

## Project Structure

```
edutech-lms/
├── backend/
│   ├── config/
│   │   └── index.js              # env config (DB, JWT, MinIO, upload limits)
│   ├── controllers/              # HTTP handlers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── fileController.js
│   │   ├── orderController.js
│   │   └── ...
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── roleMiddleware.js     # RBAC
│   │   ├── uploadMiddleware.js   # Multer + size/type validation
│   │   ├── rateLimiter.js        # express-rate-limit
│   │   ├── validationMiddleware.js # Joi schemas
│   │   └── errorHandler.js       # Structured error responses
│   ├── models/                   # PostgreSQL queries (no ORM)
│   │   ├── courseModel.js
│   │   ├── fileModel.js          # MinIO file metadata
│   │   ├── orderModel.js
│   │   └── ...
│   ├── services/                 # Business logic
│   │   ├── storageService.js     # MinIO upload/download/delete
│   │   ├── orderService.js       # Payment flow + auto-enroll
│   │   └── ...
│   ├── routes/
│   ├── lib/
│   │   └── minio.js              # MinIO client + bucket init
│   ├── utils/
│   │   ├── logger.js             # Structured JSON logger
│   │   └── sanitize.js           # XSS sanitization
│   ├── migrations/
│   │   ├── add_minio_files.sql
│   │   └── add_publishing_and_orders.sql
│   ├── nginx/
│   │   └── nginx.conf
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── dashboard/
    │   │       ├── page.tsx           # Dashboard (role-aware)
    │   │       ├── courses/           # Course list + detail + lesson viewer
    │   │       ├── grading/           # Teacher grading interface
    │   │       ├── grades/            # Student grades
    │   │       ├── orders/            # Student order history
    │   │       ├── reviews/           # Reviews (course + teacher)
    │   │       ├── analytics/
    │   │       └── ...
    │   ├── components/
    │   │   ├── FileUploader.tsx       # Drag-and-drop file uploader
    │   │   ├── LessonMaterials.tsx    # Lesson file list + download
    │   │   └── MarkdownEditor.tsx     # Editor with toolbar + live preview
    │   ├── store/
    │   │   ├── courses/coursesSlice.ts
    │   │   └── ...
    │   ├── lib/
    │   │   ├── api/client.ts          # Axios instance
    │   │   └── i18n/                  # EN / RU / KZ translations
    │   └── types/index.ts
    ├── Dockerfile
    └── next.config.ts
```

---

## Roadmap

- [ ] **Stripe / Kaspi integration** — connect payment provider to existing order model
- [ ] **Real-time notifications** — WebSocket or SSE (BullMQ workers already in place)
- [ ] **Mobile app** — React Native (API is already mobile-ready)
- [ ] **Promo codes** — discount system tied to order creation
- [ ] **Avatar uploads** — MinIO `public-assets/avatars/:userId`
- [ ] **Unit & integration tests** — Jest + Supertest on critical endpoints
- [ ] **Full-text search** — PostgreSQL `tsvector` on course/lesson content

---

## License

MIT © 2025
