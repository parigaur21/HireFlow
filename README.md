# HireFlow 🚀

A modern, full-stack **Recruitment Workflow System** built with the MERN stack. HireFlow connects recruiters with candidates through intelligent job matching, real-time notifications, and a beautiful, responsive interface.

![HireFlow](https://img.shields.io/badge/Stack-MERN-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Status](https://img.shields.io/badge/Status-Active-success)

## ✨ Features

### Core
- 🔐 **Authentication** — Secure JWT-based login & registration with role-based access (Candidate, Recruiter, Admin)
- 💼 **Job Listings** — Browse, search, and filter jobs with pagination
- 📋 **Application Tracking** — Apply to jobs and track your application through the pipeline (Applied → Screening → Interview → Technical → HR → Offer → Hired)
- 🧠 **AI Matching Engine** — Automatically calculates match scores based on skills, experience, and location

### New Features
- 👤 **Profile Page** — Manage your profile with skills, experience, bio, and social links
- 🌙 **Dark/Light Mode** — Toggle between themes with persistent preference
- 🔍 **Advanced Filters** — Filter jobs by location, skills, and experience level
- 📊 **Analytics Dashboard** — Visual stats for both recruiters and candidates
- 🔔 **In-App Notifications** — Real-time notification bell with read/unread states
- 💬 **Chat/Messaging** — Direct messaging between recruiters and candidates
- 📄 **Resume Analyzer** — Analyze resumes for skill matching
- 📱 **Mobile Responsive** — Fully responsive design with hamburger menu

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide Icons |
| **Backend** | Node.js, Express 5, Mongoose, JWT, bcrypt |
| **Database** | MongoDB |
| **Security** | Helmet, CORS, Rate Limiting, XSS Protection |

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+
- **MongoDB** (local or [Atlas](https://www.mongodb.com/cloud/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/parigaur21/HireFlow.git
cd HireFlow
```

### 2. Environment Setup
Create `server/.env`:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/hireflow
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CLIENT_URL=http://127.0.0.1:5173
```

### 3. Install Dependencies
```bash
npm install
npm run install-all
```

### 4. Seed Sample Data (Optional)
```bash
node server/scripts/seed.js
```

### 5. Run the App
```bash
npm run dev
```
- **Frontend:** http://localhost:5173
- **Backend:** http://127.0.0.1:5001

## 📁 Project Structure

```
HireFlow/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── StatusBoard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/           # React Contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── JobList.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   └── ResumeAnalyzer.jsx
│   │   ├── services/          # API client
│   │   ├── App.jsx
│   │   └── index.css
│   └── vite.config.js
├── server/                    # Express Backend
│   ├── config/                # DB configuration
│   ├── controllers/           # Route handlers
│   ├── middleware/             # Auth, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── scripts/               # Seeding scripts
│   └── server.js
└── package.json
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/jobs` | List jobs (with filters) | Public |
| GET | `/api/jobs/:id` | Get job details | Public |
| POST | `/api/jobs` | Create job | Recruiter |
| POST | `/api/applications` | Apply to job | Candidate |
| GET | `/api/applications/my` | My applications | Candidate |
| GET/PUT | `/api/profile/me` | Get/Update profile | Private |
| GET | `/api/notifications` | Get notifications | Private |
| GET | `/api/analytics` | Get analytics data | Private |
| GET/POST | `/api/chat/*` | Chat endpoints | Private |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by [parigaur21](https://github.com/parigaur21)**
