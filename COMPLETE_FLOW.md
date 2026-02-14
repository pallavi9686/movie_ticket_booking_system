# Complete Cinema Booking System Flow

## Database Connection ✅
- MySQL database: `cinema_booking`
- Backend running on: `http://localhost:5001`
- Frontend running on: `http://localhost:3000`

## User Flow

### 1. User Registration
- User goes to `/register`
- Fills in: Name, Email, Phone, Password
- Data is saved to MySQL `users` table
- User is redirected to login page

### 2. User Login
- User goes to `/login`
- Enters email and password
- Backend validates credentials from MySQL
- JWT token is generated and stored in localStorage
- User is redirected to Movies page

### 3. Browse Movies
- User sees all movies from MySQL `movies` table
- Can search movies by title or genre
- Can click on movie to see details

### 4. Book Movie
- User selects a movie
- Chooses show time
- Selects seats
- Booking is saved to MySQL `bookings` table
- User can view their bookings in "My Bookings" page

---

## Admin Flow

### 1. Admin Login
- Admin goes to `/admin-login`
- Default credentials: username: `admin`, password: `admin123`
- JWT token is generated and stored in localStorage
- Admin is redirected to Admin Dashboard

### 2. Admin Dashboard - Manage Movies
- Admin can add new movies to MySQL `movies` table
- Admin can edit existing movies
- Admin can delete movies
- All changes are saved to database

### 3. Admin Dashboard - View Users
- Admin can see all registered users from MySQL `users` table
- Shows: User ID, Name, Email, Phone, Join Date

### 4. Admin Dashboard - View Bookings
- Admin can see all bookings from MySQL `bookings` table
- Shows: Booking ID, User Name, Movie, Show Time, Seats, Total Price
- Admin can cancel bookings

### 5. Admin Dashboard - Manage Coupons
- Admin can create discount coupons in MySQL `coupons` table
- Admin can set: Code, Discount %, Expiry Date, Max Usage
- Admin can delete coupons
- Shows coupon status: Active, Expired, Max Used

---

## Database Tables

### users
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- phone
- created_at

### movies
- id (Primary Key)
- title
- poster
- genre
- duration
- rating
- price
- description
- created_at

### bookings
- id (Primary Key)
- user_id (Foreign Key → users)
- movie_id (Foreign Key → movies)
- show_time
- seats (JSON array)
- total_price
- booking_date

### coupons
- id (Primary Key)
- code (Unique)
- discount_percentage
- discount_amount
- max_usage
- usage_count
- expiry_date
- active
- created_at

### admin
- id (Primary Key)
- username (Unique)
- password (Hashed)
- created_at

---

## API Endpoints

### Authentication
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

### Admin - Movies
- `POST /api/admin/movies` - Add movie
- `PUT /api/admin/movies/:id` - Update movie
- `DELETE /api/admin/movies/:id` - Delete movie

### Admin - Users
- `GET /api/admin/users` - Get all users

### Admin - Bookings
- `GET /api/admin/bookings` - Get all bookings
- `DELETE /api/admin/bookings/:id` - Cancel booking

### Admin - Coupons
- `GET /api/admin/coupons` - Get all coupons
- `POST /api/admin/coupons` - Create coupon
- `DELETE /api/admin/coupons/:id` - Delete coupon

### Coupons
- `POST /api/coupons/validate` - Validate coupon code

---

## Testing Checklist

- [ ] Register a new user → Check in phpMyAdmin users table
- [ ] Login with registered user → Should see movies
- [ ] Admin login → Should see admin dashboard
- [ ] Add a movie as admin → Check in phpMyAdmin movies table
- [ ] Create a coupon as admin → Check in phpMyAdmin coupons table
- [ ] Book a movie as user → Check in phpMyAdmin bookings table
- [ ] Cancel booking as admin → Should be removed from bookings table
- [ ] Delete movie as admin → Should be removed from movies table

---

## Running the Application

### Terminal 1 - Backend
```bash
cd server
npm start
```
Backend runs on: `http://localhost:5001`

### Terminal 2 - Frontend
```bash
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

### Terminal 3 - phpMyAdmin (Optional)
```bash
# Usually already running at http://localhost/phpmyadmin
```

---

## Key Features Implemented

✅ User Registration with password hashing
✅ User Login with JWT authentication
✅ Admin Login with JWT authentication
✅ Movie Management (Add, Edit, Delete)
✅ Movie Booking System
✅ Coupon Management
✅ Real-time seat availability
✅ User booking history
✅ Admin dashboard with statistics
✅ MySQL database integration
✅ CORS enabled for frontend-backend communication
✅ Error handling and validation

---

## Next Steps (Optional Enhancements)

- [ ] Add payment gateway integration
- [ ] Add email notifications
- [ ] Add user profile management
- [ ] Add movie ratings and reviews
- [ ] Add advanced search and filters
- [ ] Add booking cancellation with refund
- [ ] Add admin analytics and reports
- [ ] Add mobile app version
