# 🎬 CineBook - Movie Management & Seat Booking System

A fully functional movie booking system built with React.js and LocalStorage. Features include user authentication, seat booking, and admin management.

## ✨ Features

### 🎟️ User Features
- User registration and login
- Browse available movies with pricing
- View movie details (poster, genre, duration, rating, show timings, price)
- Interactive seat selection (rows A-F, seats 1-10)
- Dynamic seat pricing based on row position:
  - Rows A-B: 20% discount (Front seats)
  - Rows C-D: Standard price (Middle seats)
  - Rows E-F: 20% premium (Back seats)
- Real-time seat availability
- Book multiple seats with automatic price calculation
- View total booking cost before confirmation
- View and cancel bookings with price details
- Prevent double booking

### 🎬 Admin Features
- Admin login (ID: `admin`, Password: `admin123`)
- Add new movies with details (including base price)
- Edit existing movies
- Delete movies
- View all registered users
- View all bookings with pricing information
- Cancel any booking

## 🛠️ Tech Stack

- **React.js** - Functional components with Hooks
- **React Router DOM** - Navigation
- **LocalStorage** - Data persistence
- **CSS** - Modern cinema-themed styling

## 🚀 Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Pages & Routes

- `/` - Home page with hero banner and features
- `/movies` - Browse all movies
- `/movie/:id` - Movie details and seat booking
- `/login` - User login
- `/register` - User registration
- `/admin-login` - Admin login
- `/admin` - Admin dashboard
- `/my-bookings` - User's booking history

## 🔐 Default Credentials

**Admin Login:**
- ID: `admin`
- Password: `admin123`

**Test User:** (Register your own)

## 💾 Data Storage

All data is stored in browser's LocalStorage:
- `admin` - Admin credentials
- `users` - Registered users
- `movies` - Movie catalog
- `bookings` - All bookings
- `currentUser` - Logged-in user session
- `currentAdmin` - Logged-in admin session

## 🎨 Features Breakdown

### Seat Layout
- 6 rows (A-F) with 10 seats each
- Visual seat selection
- Color-coded seats:
  - Gray - Available
  - Red - Selected
  - Dark - Booked

### Booking System
- Select show time
- Choose multiple seats
- Real-time availability check
- Booking confirmation
- View booking history

### Admin Dashboard
- Three tabs: Movies, Users, Bookings
- Full CRUD operations for movies
- User management
- Booking management

## 📦 Project Structure

```
src/
├── components/
│   ├── Navbar.js
│   ├── MovieCard.js
│   └── SeatLayout.js
├── pages/
│   ├── Home.js
│   ├── Movies.js
│   ├── MovieDetails.js
│   ├── Login.js
│   ├── Register.js
│   ├── AdminLogin.js
│   ├── AdminDashboard.js
│   └── MyBookings.js
├── utils/
│   └── storage.js
├── App.js
└── index.js
```

## 🎯 Key Functionalities

1. **Authentication System**
   - Separate user and admin login
   - Session management
   - Protected routes

2. **Movie Management**
   - Add/Edit/Delete movies
   - Movie details with poster
   - Multiple show timings

3. **Seat Booking**
   - Interactive seat selection
   - Dynamic pricing based on seat location
   - Real-time availability
   - Booking validation
   - Prevent double booking
   - Automatic price calculation

4. **User Dashboard**
   - View all bookings
   - Cancel bookings
   - Booking history

5. **Admin Dashboard**
   - Manage movies
   - View users
   - Manage all bookings

## 🌟 UI/UX Features

- Modern cinema-themed gradient design
- Responsive layout for all devices
- Smooth animations and transitions
- Intuitive navigation
- Visual feedback for user actions
- Error and success messages

## 📝 Notes

- All data persists in LocalStorage
- No backend required
- Refresh-safe (data persists)
- Mobile responsive
- Cross-browser compatible

## 🔄 Future Enhancements

- Payment gateway integration
- Email notifications
- Movie search and filters
- User reviews and ratings
- Custom seat pricing per movie
- QR code generation
- Print tickets
- Discount codes and promotions

---

Built with ❤️ using React.js
