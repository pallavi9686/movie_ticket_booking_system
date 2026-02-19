# Movie Booking System - Complete Overview

## 🎬 System Features

### 1. User Authentication
- **User Registration**: New users can create accounts with name, email, phone, and password
- **User Login**: Secure login with JWT token authentication
- **Admin Login**: Separate admin panel access with admin credentials
- **Forgot Password**: Password reset functionality with email verification (UI ready)

### 2. Movie Management
- **Browse Movies**: View all available movies with posters, ratings, and details
- **Movie Details**: Detailed view with description, genre, duration, and pricing
- **Search Movies**: Search functionality in navbar to find movies quickly
- **Admin Movie Management**: Add, edit, and delete movies from admin dashboard

### 3. Theater & Showtime Management
- **Theaters Page**: Display of 8 theaters across 4 cities (Mumbai, Delhi, Bangalore, Pune)
- **Theater Filtering**: Filter theaters by city
- **Theater Details**: View facilities (IMAX, 4DX, Dolby Atmos, etc.)
- **Multiple Show Times**: 4 show times per movie (Morning, Afternoon, Evening, Night)
- **Date Selection**: Choose show date for booking

### 4. Seat Selection System
- **Interactive Seat Layout**: Visual seat selection interface
- **Seat Categories**: 
  - Regular seats
  - Premium seats
  - VIP seats
- **Real-time Availability**: Shows booked seats in real-time
- **Multi-seat Selection**: Select multiple seats in one booking
- **Seat Pricing**: Different pricing for different seat categories

### 5. Coupon System
- **Coupon Codes**: Apply discount coupons at checkout
- **Coupon Validation**: Real-time validation of coupon codes
- **Discount Types**: Percentage-based discounts
- **Coupon Display**: Active coupons shown in navbar with "Offers" dropdown
- **Usage Limits**: Max usage count and expiry date tracking
- **Admin Coupon Management**: Create and manage coupons from admin panel

### 6. Booking & Payment
- **Booking Summary**: Review selected seats, show time, and total price
- **Payment Methods**: 
  - Credit/Debit Card
  - UPI
  - Net Banking
  - Wallet
- **Price Calculation**: Automatic calculation with seat prices and discounts
- **Booking Confirmation**: Confirmation page with booking details
- **Booking ID**: Unique booking reference number

### 7. User Dashboard
- **My Bookings**: View all past and upcoming bookings
- **Booking Details**: Detailed view of each booking
- **Cancel Booking**: Option to cancel bookings
- **Booking History**: Track all booking activities

### 8. Admin Dashboard
- **User Management**: View all registered users
- **Movie Management**: Add, edit, delete movies
- **Booking Management**: View and manage all bookings
- **Coupon Management**: Create and manage discount coupons
- **Statistics**: Overview of total users, movies, and bookings

## 🗄️ Database Schema

### Tables:
1. **admin** - Admin credentials
2. **users** - User accounts
3. **password_resets** - Password reset tokens
4. **movies** - Movie information
5. **show_timings** - Show times for each movie
6. **bookings** - User bookings with seats and pricing
7. **coupons** - Discount coupons

## 🎨 UI Features

### Design Elements:
- Modern gradient backgrounds
- Glassmorphism effects
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Interactive hover effects
- Color-coded seat selection
- Modal dialogs for forms
- Toast notifications for actions

### Navigation:
- Home
- Movies
- Theaters
- My Bookings (for logged-in users)
- Admin Dashboard (for admins)
- Offers dropdown with active coupons
- Search bar for movies
- Login/Register/Logout

### Footer:
- Quick links
- Contact information
- Social media links
- 24/7 customer support info

## 🔧 Technical Stack

### Frontend:
- React.js
- React Router for navigation
- CSS3 with modern features
- LocalStorage for session management

### Backend:
- Node.js with Express
- MySQL database
- JWT authentication
- bcrypt for password hashing
- CORS enabled

### API Endpoints:
- `/api/auth/*` - Authentication
- `/api/movies/*` - Movie operations
- `/api/bookings/*` - Booking operations
- `/api/coupons/*` - Coupon validation
- `/api/admin/*` - Admin operations

## 🚀 Getting Started

### Prerequisites:
- Node.js installed
- MySQL server running
- npm or yarn package manager

### Setup Steps:

1. **Database Setup**:
   ```bash
   mysql -u root -p < server/config/schema.sql
   ```

2. **Install Dependencies**:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   ```

3. **Configure Environment**:
   - Copy `server/.env.example` to `server/.env`
   - Update database credentials
   - Set JWT secret

4. **Setup Admin Account**:
   ```bash
   cd server
   node setup-admin.js
   ```

5. **Start Backend Server**:
   ```bash
   cd server
   node server.js
   ```
   Server runs on: http://localhost:5001

6. **Start Frontend**:
   ```bash
   npm start
   ```
   App runs on: http://localhost:3000

## 📱 User Flow

1. **Browse Movies** → Home page or Movies page
2. **Select Movie** → View details, ratings, and show times
3. **Login/Register** → Create account or login
4. **Choose Show** → Select date and time
5. **Select Seats** → Pick seats from interactive layout
6. **Apply Coupon** → Optional discount code
7. **Payment** → Choose payment method and confirm
8. **Confirmation** → Receive booking confirmation
9. **My Bookings** → View and manage bookings

## 🔐 Default Credentials

### Admin:
- Username: `admin`
- Password: `admin123`

### Test User:
- Create your own account via registration

## 📊 Key Features Summary

✅ User authentication with JWT
✅ Movie browsing and search
✅ Theater listings with filtering
✅ Interactive seat selection
✅ Real-time seat availability
✅ Coupon system with validation
✅ Multiple payment methods
✅ Booking management
✅ Admin dashboard
✅ Responsive design
✅ Forgot password functionality
✅ Booking history
✅ Cancel bookings

## 🎯 Future Enhancements (Optional)

- Email notifications for bookings
- SMS confirmations
- QR code tickets
- Movie reviews and ratings
- Trailer integration
- Food & beverage ordering
- Loyalty points system
- Multi-language support
- Payment gateway integration
- Real-time seat updates with WebSocket

---

**System Status**: ✅ Fully Functional
**Last Updated**: February 14, 2026
