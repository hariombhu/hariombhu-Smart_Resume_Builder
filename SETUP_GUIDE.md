# 🚀 STEP-BY-STEP SETUP GUIDE - Resume Planner

## ⚠️ Prerequisites Setup

### 1. Install MongoDB (Required)

MongoDB is not installed on your system. Choose ONE option:

#### **Option A: Install MongoDB Locally (Recommended for Development)**

1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows service automatically

**OR**

#### **Option B: Use MongoDB Atlas (Cloud - No Installation)**

1. Create free account: https://www.mongodb.com/cloud/atlas/register
2. Create a FREE cluster (M0)
3. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Update `backend\.env` file:
   ```
   MONGODB_URI=your-atlas-connection-string-here
   ```

---

## 📦 Installation Steps

### Step 1: Backend Setup

```powershell
# Navigate to backend folder
cd d:\ResumeBuilder\backend

# Install dependencies (ALREADY DONE ✅)
npm install

# Seed database (creates admin user & templates)
node src/seedDatabase.js
```

**Expected Output:**
```
✅ MongoDB Connected
✅ Admin user created
✅ Default templates created
✅ Database seeded successfully
```

### Step 2: Frontend Setup

```powershell
# Navigate to frontend folder
cd d:\ResumeBuilder\frontend

# Dependencies are already installed ✅
```

---

## ▶️ Running the Application

### Method 1: Two Separate Terminals

**Terminal 1 - Backend:**
```powershell
cd d:\ResumeBuilder\backend
npm run dev
```
**Expected:** Server running on http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
cd d:\ResumeBuilder\frontend
npm run dev
```
**Expected:** App running on http://localhost:3000

### Method 2: Using Start Scripts (Easier)

I'll create start scripts for you...

---

## 🧪 Testing the Application

Once both servers are running:

1. **Open Browser:** http://localhost:3000
2. **Register:** Create a new user account
3. **Login:** Sign in with your credentials
4. **Create Resume:** Click "Create New Resume"

### Admin Access:
- **URL:** http://localhost:3000/admin/login
- **Email:** admin@resumeplanner.com
- **Password:** Admin@123

---

## ❌ Troubleshooting

### "MongoDB Connection Error"
**Problem:** MongoDB is not running

**Solutions:**
- **If installed locally:** Start MongoDB service
  ```powershell
  net start MongoDB
  ```
- **If using Atlas:** Check your connection string in `backend\.env`

### "Port 5000 already in use"
**Solution:** Change port in `backend\.env`:
```
PORT=5001
```
And update `frontend\.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### "Cannot find module"
**Solution:** Reinstall dependencies
```powershell
cd backend
npm install

cd ../frontend
npm install
```

---

## ✅ Current Status

- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed (with security updates)
- ✅ Environment files created
- ⏳ **WAITING:** MongoDB installation
- ⏳ **WAITING:** Database seeding
- ⏳ **WAITING:** Start servers

---

## 🎯 Next Steps

1. **Install MongoDB** (choose Option A or B above)
2. **Seed Database:** `node src/seedDatabase.js` (from backend folder)
3. **Start Backend:** `npm run dev` (from backend folder)
4. **Start Frontend:** `npm run dev` (from frontend folder)
5. **Open:** http://localhost:3000

---

## 💡 Quick Links

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health
- Admin Panel: http://localhost:3000/admin/login

---

Need help? Let me know which MongoDB option you prefer, and I'll guide you through it!
