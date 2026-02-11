-- Create database
CREATE DATABASE IF NOT EXISTS cinema_booking;
USE cinema_booking;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  poster VARCHAR(500),
  genre VARCHAR(200),
  duration VARCHAR(20),
  rating DECIMAL(3,1),
  price DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Show timings table
CREATE TABLE IF NOT EXISTS show_timings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  movie_id INT NOT NULL,
  timing VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  show_date DATE NOT NULL,
  show_time VARCHAR(20) NOT NULL,
  seats JSON NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage DECIMAL(5,2),
  discount_amount DECIMAL(10,2),
  max_usage INT DEFAULT 1,
  usage_count INT DEFAULT 0,
  expiry_date DATETIME NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admin (username, password) VALUES ('admin', '$2a$10$YourHashedPasswordHere');

-- Insert sample movies
INSERT INTO movies (title, poster, genre, duration, rating, price, description) VALUES
('The Dark Knight', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500', 'Action, Crime, Drama', '152 min', 9.0, 15, 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.'),
('Inception', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500', 'Action, Sci-Fi, Thriller', '148 min', 8.8, 18, 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.'),
('Interstellar', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500', 'Adventure, Drama, Sci-Fi', '169 min', 8.6, 20, 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.');

-- Insert sample show timings
INSERT INTO show_timings (movie_id, timing) VALUES
(1, '10:00 AM'), (1, '2:00 PM'), (1, '6:00 PM'), (1, '9:30 PM'),
(2, '11:00 AM'), (2, '3:00 PM'), (2, '7:00 PM'), (2, '10:00 PM'),
(3, '10:30 AM'), (3, '2:30 PM'), (3, '6:30 PM'), (3, '9:00 PM');
