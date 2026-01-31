# 🎯 Resume Planner - Easy Start Guide

## Current Status
- ✅ Frontend is running on port 3000
- ❌ Backend needs to be started on port 5000

---

## 🔧 Step-by-Step Fix

### Step 1: Stop All Node Processes (Clean Slate)
Open PowerShell as Administrator and run:
```powershell
taskkill /F /IM node.exe
```

Wait 5 seconds.

### Step 2: Start Backend
Open terminal in `d:\ResumeBuilder\backend` and run:
```powershell
npm run dev
```

**Wait for this message:**
```
✅ MongoDB Connected: localhost
🚀 URL: http://localhost:5000
```

### Step 3: Start Frontend (New Terminal Window)
Open a SECOND terminal in `d:\ResumeBuilder\frontend` and run:
```powershell
npm run dev
```

**Wait for this message:**
```
✓ Ready in 1-2s
- Local: http://localhost:3000
```

### Step 4: Open Browser
Go to: **http://localhost:3000**

---

## ✅ You're Done!

Both servers should now be running properly.

Keep both terminal windows open while using the app.

To stop: Press `Ctrl+C` in each terminal.
