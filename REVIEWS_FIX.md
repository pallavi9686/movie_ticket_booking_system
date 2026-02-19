# Reviews Feature Setup

## Issue
The reviews API is returning 500 errors because the `reviews` table doesn't exist in the database.

## Quick Fix

1. Navigate to the server directory:
```bash
cd server
```

2. Run the setup script:
```bash
node setup-reviews.js
```

3. Restart your server

## What the Script Does
- Connects to your MySQL database
- Checks if the reviews table exists
- Creates the table with proper structure if missing
- Adds performance indexes
- Verifies the setup

## Alternative: Manual SQL Setup

If you prefer to set up manually, connect to MySQL and run:

```sql
USE cinema_booking;

CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_movie (user_id, movie_id)
);

CREATE INDEX idx_movie_reviews ON reviews(movie_id);
CREATE INDEX idx_user_reviews ON reviews(user_id);
```

## Verification

After setup, the following features will work:

1. **Movie Details Page**: View all reviews and ratings
2. **Booking Details Page**: Review prompt after watching
3. **My Bookings Page**: "Write Review" button for past shows

## Features Included

- ⭐ 1-5 star rating system
- 💬 Text comments/reviews
- 🔒 One review per user per movie (can update)
- 📊 Automatic average rating calculation
- 🎯 Smart prompts after movie shows
- 🗑️ Users can delete their own reviews

## Troubleshooting

If you still see errors:

1. Check database connection in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cinema_booking
```

2. Verify MySQL is running:
```bash
mysql -u root -p
```

3. Check server logs for detailed error messages

4. Ensure the server is restarted after running setup

