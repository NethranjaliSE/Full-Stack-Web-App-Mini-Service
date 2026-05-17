# 🚀 GlobalTNA TaskBoard  Full-Stack Service Marketplace

A responsive full-stack **MERN & Next.js** service marketplace that connects **Homeowners** looking to post repair or renovation requests with **Tradespeople** ready to fulfill local jobs. Built with automated data validation, role-based authentication, and secure cloud deployment.

---
## 📺 Walkthrough & Demo Video

If you want a quick 2-minute overview of the full-stack architecture, role-based login profiles, and backend test executions, check out the video walkthrough link below:

👉 **[Watch the Live Project Demo Video on Google Drive](https://drive.google.com/file/d/1trJo6hHVmf2RTqfVzR1EGAsNf0iFiG38/view?usp=sharing)**

---

## 📂 Repository Architecture

This project is structured as a unified monorepo:

```
Full-Stack-Web-App-Mini-Service/
├── backend/        # Express.js REST API (Node.js + Mongoose + MongoDB)
└── frontend/       # Server-rendered Next.js UI (Tailwind CSS)
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Testing | Jest |
| Deployment | Vercel (frontend), Railway (backend) |

---

## 🔐 Environment Variables

### Backend — `backend/.env`

Create this file inside the `/backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secure_jwt_secret_string

```

### Frontend — `frontend/.env.local`

Create this file inside the `/frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/jobs
NEXT_PUBLIC_AUTH_URL=http://localhost:5000/api/auth
```

---

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/NethranjaliSE/Full-Stack-Web-App-Mini-Service.git
cd Full-Stack-Web-App-Mini-Service
```

### 2. Set Up the Backend

```bash
cd backend
npm install
# Add your .env file with MongoDB URI and JWT secret
```

### 3. Seed the Database *(Optional)*

Wipes existing data and populates the database with default test users and job listings:

```bash
npm run seed
```

### 4. Set Up the Frontend

Open a new terminal from the project root:

```bash
cd frontend
npm install
# Add your .env.local file with API endpoint URLs
```

---

## ▶️ Running the App

| Scope | Command | URL |
|---|---|---|
| Backend (dev) | `cd backend && npm run dev` | http://localhost:5000 |
| Backend (tests) | `cd backend && npm test` | Runs 5 core endpoint tests |
| Frontend (dev) | `cd frontend && npm run dev` | http://localhost:3000 |

---

## 🌐 Production Deployment

| Service | Platform | URL |
 
| Frontend | Vercel | |https://full-stack-web-app-mini-service.vercel.app|
| Backend API | Railway 
| Database | MongoDB Atlas | Cloud-hosted cluster |

> **💡 Cold Start Notice:** Both services run on free-tier cloud infrastructure. After 15 minutes of inactivity, the backend enters a sleep state. The first request may take up to **30 seconds** to wake the server subsequent requests will be fast.

---

## 🔑 Test Credentials

Use these pre-seeded accounts to explore both user roles:

### 🏠 Homeowner *(Job Poster)*
| Field | Value |
|---|---|
| Email | `homeowner@test.com` |
| Password | `password123` |
| Permissions | Post jobs, edit listings, manage tasks |

### 🔧 Tradesperson *(Job Seeker)*
| Field | Value |
|---|---|
| Email | `tasker@test.com` |
| Password | `password123` |
| Permissions | Browse open jobs, review requirements, track completions |

---

