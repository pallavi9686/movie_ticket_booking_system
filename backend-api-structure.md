# Express API Structure for Theatre Management

## Recommended Backend Structure

```
backend/
├── server.js
├── routes/
│   ├── movies.js
│   ├── theatres.js
│   ├── shows.js
│   ├── bookings.js
│   ├── users.js
│   ├── coupons.js
│   └── auth.js
├── models/
│   ├── Movie.js
│   ├── Theatre.js
│   ├── Show.js
│   ├── Booking.js
│   ├── User.js
│   └── Coupon.js
├── middleware/
│   ├── auth.js
│   └── validation.js
└── config/
    └── database.js
```

## API Endpoints to Implement

### Movies API
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Add new movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Theatres API
- `GET /api/theatres` - Get all theatres
- `GET /api/theatres/:id` - Get theatre by ID
- `POST /api/theatres` - Add new theatre (Admin only)
- `PUT /api/theatres/:id` - Update theatre (Admin only)
- `DELETE /api/theatres/:id` - Delete theatre (Admin only)
- `GET /api/theatres/movie/:movieId/date/:date` - Get theatres showing specific movie on date

### Theatre Shows API
- `GET /api/shows` - Get all shows (Admin only)
- `GET /api/shows/movie/:movieId` - Get shows for specific movie
- `GET /api/shows/theatre/:theatreId` - Get shows for specific theatre
- `GET /api/shows/movie/:movieId/date/:date` - Get shows for movie on specific date
- `POST /api/shows` - Add new show (Admin only)
- `DELETE /api/shows/:id` - Delete show (Admin only)

### Bookings API
- `GET /api/bookings` - Get all bookings (Admin only)
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/seats/:theatreId/:screenId/:movieId/:showDate/:showTime` - Get booked seats for specific show

### Users API
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/users` - Get all users (Admin only)

### Coupons API
- `GET /api/coupons` - Get all coupons (Admin only)
- `POST /api/coupons` - Create coupon (Admin only)
- `POST /api/coupons/validate` - Validate coupon
- `DELETE /api/coupons/:id` - Delete coupon (Admin only)