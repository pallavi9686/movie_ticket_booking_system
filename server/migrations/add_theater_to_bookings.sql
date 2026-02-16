-- Migration to add theater information to bookings table
-- Run this if you have existing bookings data

USE cinema_booking;

-- Add theater columns to bookings table
ALTER TABLE bookings 
ADD COLUMN theater_id INT AFTER total_price,
ADD COLUMN theater_name VARCHAR(200) AFTER theater_id,
ADD COLUMN theater_location VARCHAR(300) AFTER theater_name;

-- Update existing bookings with default theater (optional)
-- UPDATE bookings SET 
--   theater_id = 1,
--   theater_name = 'PVR Cinemas',
--   theater_location = 'Phoenix Mall, Mumbai'
-- WHERE theater_id IS NULL;