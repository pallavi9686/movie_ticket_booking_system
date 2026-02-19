# 🚀 How to Start the Movie Booking System

## Quick Start Guide

### 1. Start the Backend Server (Required)

Open a **new terminal** and run:

```bash
cd server
node server.js
```

You should see:
```
Server running on port 5001
Database connected successfully
```

### 2. Start the Frontend (if not already running)

In another terminal:

```bash
npm start
```

The app will open at: http://localhost:3000

## ⚠️ Common Issues

### "Server not available" Error
- **Cause**: Backend server is not running
- **Solution**: Make sure you started the backend server first (step 1 above)

### Database Connection Error
- **Cause**: MySQL is not running or wrong credentials
- **Solution**: 
  1. Start MySQL server
  2. Check credentials in `server/.env`
  3. Run database setup: `mysql -u root -p < server/config/schema.sql`

### Port Already in Use
- **Backend (5001)**: Kill the process or change port in `server/server.js`
- **Frontend (3000)**: Kill the process or React will suggest another port

## 🔧 Setup Checklist

- [ ] MySQL server is running
- [ ] Database is created and tables are set up
- [ ] Backend server is running on port 5001
- [ ] Frontend is running on port 3000
- [ ] No console errors in browser

## 📱 Test the System

1. Go to http://localhost:3000
2. Browse movies
3. Register a new account
4. Login and book a movie
5. Check admin panel at `/admin-login` (admin/admin123)

## 🆘 Still Having Issues?

Check the browser console (F12) for specific error messages and ensure both servers are running properly.