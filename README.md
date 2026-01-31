# 🚀 Resume Planner - AI-Assisted Smart Resume Builder

<div align="center">

![Resume Planner](https://img.shields.io/badge/Resume-Planner-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple?style=for-the-badge)

**Create professional, ATS-friendly resumes with AI assistance. Perfect for students and job seekers.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Hackathon Pitch](#-hackathon-pitch)
- [Future Scope](#-future-scope)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Resume Planner** is a modern, full-stack web and mobile application that empowers job seekers and students to create professional resumes without any design skills. The platform features:

- **Step-by-step wizard** for easy resume creation
- **AI-powered suggestions** for content improvement
- **Live preview** while editing
- **Multiple professional templates** (ATS-friendly)
- **PDF generation** with one click
- **Mobile-responsive PWA** (installable on phones)
- **Admin dashboard** for template and user management

**Problem it solves:** Many students struggle to create professional resumes due to poor design skills, lack of structure, and confusing tools. Existing platforms are often complex, paid, or not beginner-friendly.

---

## ✨ Features

### 👤 User Features

- ✅ Email/Password authentication
- ✅ Step-by-step resume wizard (wizard-based forms)
- ✅ Live preview while typing
- ✅ Upload profile photo
- ✅ Add personal details, education, skills, projects, work experience, certifications
- ✅ Add social links (LinkedIn, GitHub, Portfolio)
- ✅ Select from multiple resume templates
- ✅ Download resume as PDF
- ✅ Save & edit resume anytime
- ✅ One-click resume duplication
- ✅ Shareable resume links with QR codes
- ✅ Resume completeness/score meter
- ✅ Dark/light mode toggle
- ✅ Fully mobile responsive

### 🛠️ Admin Features

- ✅ Admin login & dashboard
- ✅ View all registered users
- ✅ Analytics dashboard (resumes created, downloads, user growth)
- ✅ Create, update, delete resume templates
- ✅ Enable/disable templates
- ✅ View all resumes

### 🤖 Innovative Features (Hackathon Edge)

- 🎨 **AI Suggestions** - Get recommendations for resume content
- 📊 **Resume Score** - Real-time completeness meter (0-100%)
- 🎯 **ATS-Friendly** - Templates optimized for Applicant Tracking Systems
- 📱 **PWA Support** - Install on mobile home screen
- 🔗 **Shareable Links** - Unique link for each resume
- 📲 **QR Code** - Auto-generated QR on resume
- 💾 **Auto-save** - Drafts saved locally

---

## 🧩 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Custom CSS
- **UI:** Custom components with Framer Motion animations
- **State:** React Context API
- **Forms:** React Hook Form
- **PWA:** next-pwa

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Tokens)
- **File Upload:** Cloudinary
- **PDF Generation:** Puppeteer
- **Validation:** Joi

### Deployment
- **Frontend:** Vercel (recommended)
- **Backend:** Render / Railway / AWS
- **Database:** MongoDB Atlas
- **CDN:** Cloudinary

---

## 📁 Project Structure

```
ResumeBuilder/
├── backend/                # Node.js/Express API
│   ├── src/
│   │   ├── config/        # Database, Cloudinary config
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth, validation
│   │   ├── services/      # PDF, upload, AI services
│   │   ├── utils/         # Helpers
│   │   └── server.js      # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # Pages (App Router)
│   │   ├── components/   # React components
│   │   ├── context/      # Context providers
│   │   ├── lib/          # API client, utils
│   │   └── styles/       # Global styles
│   ├── public/           # Static assets
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Cloudinary account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resume-planner.git
cd resume-planner
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Seed database with admin user and templates
node src/seedDatabase.js

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local if needed

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/resume-planner
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-planner

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin credentials (for seeding)
ADMIN_EMAIL=admin@resumeplanner.com
ADMIN_PASSWORD=Admin@123
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 💻 Usage

### For Users

1. **Register** at `/register`
2. **Login** at `/login`
3. **Create Resume:**
   - Click "Create New Resume"
   - Fill step-by-step wizard
   - See live preview
   - Select template
   - Download as PDF
4. **Manage Resumes:**
   - View all resumes in dashboard
   - Edit, duplicate, or delete
   - Share via link

### For Admins

1. **Login** at `/admin/login` (use seeded credentials)
2. **Dashboard:**
   - View analytics
   - Manage users
   - Create/edit templates
   - View all resumes

---

## 📚 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/update-profile` | Update profile |

### Resume

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/create` | Create resume |
| GET | `/resume` | Get all user resumes |
| GET | `/resume/:id` | Get single resume |
| PUT | `/resume/:id` | Update resume |
| DELETE | `/resume/:id` | Delete resume |
| POST | `/resume/:id/duplicate` | Duplicate resume |
| GET | `/resume/:id/pdf` | Download PDF |
| GET | `/resume/share/:link` | Get public resume |

### Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/template` | Get all templates |
| GET | `/template/:id` | Get single template |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/login` | Admin login |
| GET | `/admin/users` | Get all users |
| GET | `/admin/analytics` | Get analytics |
| POST | `/admin/template` | Create template |
| PUT | `/admin/template/:id` | Update template |
| DELETE | `/admin/template/:id` | Delete template |

---

## 🌐 Deployment

### Deploy Backend (Render)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Set environment variables
5. Deploy!

### Deploy Frontend (Vercel)

1. Create account on [Vercel](https://vercel.com)
2. Import your repository
3. Set environment variables
4. Deploy!

### MongoDB Atlas

1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in backend env

---

## 🏆 Hackathon Pitch

### Problem Statement
Students and job seekers struggle with creating professional resumes due to:
- Poor design skills
- Lack of structure
- Complex existing tools
- Expensive platforms

### Our Solution
**Resume Planner** - A simple, free, AI-assisted resume builder that:
- Guides users step-by-step
- Provides real-time suggestions
- Generates ATS-friendly resumes
- Works on mobile & web

### Why We'll Win

1. **Simplicity** - Anyone can create a professional resume in 5 minutes
2. **Accessibility** - Free, mobile-friendly, PWA installable
3. **Innovation** - AI suggestions, completeness scoring, QR codes
4. **Real Impact** - Helps students land jobs
5. **Scalability** - Ready for SaaS model with premium features
6. **Technical Excellence** - Production-ready, clean code, modern stack

### Demo Flow

1. Show landing page (beautiful UI)
2. Quick registration
3. Create resume using wizard (live preview)
4. AI suggestions in action
5. Download PDF with QR code
6. Show mobile responsiveness
7. Admin analytics dashboard

---

## 🎯 Future Scope

- Premium templates (paid tier)
- Cover letter generation
- LinkedIn profile sync
- ATS parsing & score
- Job matching AI
- Multi-language support
- Video resume introduction
- Interview preparation module

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

Created with ❤️ by the Resume Planner Team for [Hackathon Name]

---

## 📞 Support

For issues or questions:
- Email: support@resumeplanner.com
- GitHub Issues: [Create Issue](https://github.com/yourusername/resume-planner/issues)

---

<div align="center">

**⭐ Star this repo if you found it helpful! ⭐**

Made with Next.js, Express, MongoDB, and lots of coffee ☕

</div>
