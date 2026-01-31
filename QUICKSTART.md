# Quick Start Guide - Resume Planner

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Setup Environment

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-planner
JWT_SECRET=af28d0bbc7c4481b
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000

# Optional for image uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin credentials
ADMIN_EMAIL=admin@resumeplanner.com
ADMIN_PASSWORD=Admin@123
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 3: Seed Database

```bash
cd backend
node src/seedDatabase.js
```

This creates:
- Admin user (admin@resumeplanner.com / Admin@123)
- 4 default templates

### Step 4: Run Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 5: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

---

## 🎯 Quick Demo Flow

1. **Register** new user account
2. **Create Resume** - Click "Create New Resume"
3. **Download PDF** - Test PDF generation
4. **Admin Login** - Use admin credentials
5. **View Analytics** - Check dashboard metrics

---

## ⚠️ Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or install MongoDB Community Edition
# Visit: https://www.mongodb.com/try/download/community
```

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=5001

# Update NEXT_PUBLIC_API_URL in frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Cloudinary Not Working
- Images will work with placeholder URLs
- Create free account at cloudinary.com to enable uploads

---

## 📦 Deployment Quick Guide

### Vercel (Frontend)
```bash
cd frontend
vercel deploy
```

### Render (Backend)
1. Push code to GitHub
2. Connect repository on Render
3. Add environment variables
4. Deploy!

---

## 💡 Need Help?

Check the main [README.md](./README.md) for detailed documentation.

Happy Building! 🎉
