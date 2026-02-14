# MySQL Setup Guide for Cinema Booking System

## Prerequisites
- MySQL Server installed and running
- Node.js installed

## Step 1: Create Database

1. Open MySQL command line or MySQL Workbench
2. Run the SQL script to create database and tables:

```bash
mysql -u root -p < server/config/schema.sql
```

Or copy-paste the contents of `server/config/schema.sql` into MySQL client.

## Step 2: Setup Backend

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cinema_booking
DB_PORT=3306
PORT=5000
JWT_SECRET=your_secret_key_here
```

5. Start the backend server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Step 3: Setup Frontend

1. In the root directory, install dependencies:
```bash
npm install
```

2. Create `.env` file in root:
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the React app:
```bash
npm start
```

The app will run on `http://localhost:3000`

## Step 4: Update Storage Functions

Replace localStorage calls with API calls in your components. Example:

**Before (localStorage):**
```javascript
import { getMovies } from '../utils/storage';
const movies = getMovies();
```

**After (MySQL via API):**
```javascript
import { getMovies } from '../utils/api';
const movies = await getMovies();
```

## Database Schema

### Tables Created:
- `admin` - Admin credentials
- `users` - User accounts
- `movies` - Movie information
- `show_timings` - Show times for each movie
- `bookings` - User bookings
- `coupons` - Discount coupons

## Default Admin Credentials
- Username: `admin`
- Password: `admin123` (hash this before production)

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/admin/login` - Admin login

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/seats/:movieId/:showTime` - Get booked seats
- `DELETE /api/bookings/:bookingId` - Cancel booking

### Coupons
- `POST /api/coupons/validate` - Validate coupon code

## Troubleshooting

**Connection refused error:**
- Make sure MySQL is running
- Check DB credentials in `.env`

**Port already in use:**
- Change PORT in `.env` to a different port
- Or kill the process using port 5000

**CORS errors:**
- Make sure backend is running on port 5000
- Check CORS configuration in server.js
