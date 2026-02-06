# Movie Ticket Booking System (React)

A beginner-friendly **Movie Ticket Booking System** built with **React 18** and **Vite**. This is a production-ready frontend application that demonstrates movie search, details, showtimes, seat selection, and a complete booking flow with **LocalStorage persistence**.

**Project Type:** Full-Stack Frontend Application (Single-Page Application)  
**Status:** ✅ Complete and Runnable | No Backend Required

---

## 🎬 Tech Stack
- **Frontend:** React 18 + Vite (Fast build tool)
- **Routing:** react-router-dom v6 (Client-side routing)
- **State Management:** React Context API + LocalStorage
- **Styling:** Plain CSS (responsive, mobile-friendly)
- **Build Tool:** Vite (optimized for development & production)
- **Package Manager:** npm

---

## ✨ Core Features Implemented

### 1. **Movie Listing & Search**
   - Display movies with poster, title, genre, duration, rating
   - Real-time search/filter by title
   - Filter by genre dynamically
   - Filter by date (showtime availability)

### 2. **Movie Details Page**
   - Full movie description
   - Cast information
   - Embedded YouTube trailer player
   - Available showtimes with clickable buttons

### 3. **Seat Selection**
   - Interactive seat grid (6 rows × 8 columns)
   - Color-coded seats:
     - 🔵 **Blue** = Available (clickable)
     - 🟦 **Dark Blue** = Selected (your choice)
     - ⚫ **Gray** = Booked (disabled)
   - Select/deselect seats dynamically
   - Real-time price calculation ($8/seat)

### 4. **Booking & Checkout**
   - Booking summary with movie, showtime, selected seats
   - Total price calculation
   - Save bookings to LocalStorage (persistent across sessions)
   - Confirmation page

### 5. **User Experience**
   - Responsive design (mobile, tablet, desktop)
   - Clean navigation between pages
   - Loading indicators
   - Error handling
   - localStorage-backed persistence

---

## 📁 Project Structure

```
src/
 ├── components/                  # Reusable React components
 │   ├── MovieCard.jsx           # Movie card with poster & button
 │   ├── SearchBar.jsx           # Search/filter input fields
 │   ├── SeatGrid.jsx            # Interactive seat selection grid
 │   └── BookingSummary.jsx      # Booking summary display
 │
 ├── pages/                       # Page components (routed)
 │   ├── Home.jsx                # Movie listing with filters
 │   ├── MovieDetails.jsx        # Movie details & showtimes
 │   ├── SeatSelection.jsx       # Seat grid & booking
 │   └── Checkout.jsx            # Confirm & save booking
 │
 ├── context/                     # React Context for state
 │   └── BookingContext.jsx      # Booking context + localStorage
 │
 ├── data/                        # Static data
 │   └── movies.json             # Sample movie data
 │
 ├── App.jsx                      # Main app component + routing
 ├── main.jsx                     # React entry point
 └── index.css                    # Global styling
```

---

## 🚀 Quick Start (Windows)

### 1️⃣ Clone or Navigate to Project
```powershell
cd c:\Users\kaver\movie_ticket_booking_system
```

### 2️⃣ Install Dependencies
```powershell
npm install
```
This installs:
- `react` (UI library)
- `react-dom` (React rendering)
- `react-router-dom` (routing)
- `vite` (dev server & build tool)

### 3️⃣ Start Development Server
```powershell
npm run dev
```

### 4️⃣ Open in Browser
Visit: **http://localhost:5173**

---

## 📖 How to Use

1. **Home Page:** Browse movies, search by title/genre, filter by date
2. **Movie Details:** Click a movie → view description, cast, trailer, showtimes
3. **Seat Selection:** Pick a showtime → select seats (blue) → click "Proceed"
4. **Checkout:** Review booking → click "Confirm & Save" → Booking saved to LocalStorage
5. **View Bookings:** Check browser's LocalStorage (DevTools → Application → LocalStorage → `bookings`)

### Booking Data Structure (LocalStorage)
```json
[
  {
    "movieId": "1",
    "movieTitle": "The Grand Adventure",
    "showtime": "2026-02-06T14:00",
    "seats": ["A1", "A2", "B1"],
    "total": 24
  }
]
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server (port 5173) |
| `npm run build` | Build for production (creates `dist/` folder) |
| `npm run preview` | Preview production build locally |

---

## 🎨 Customize & Extend

### Add Your Own Movies
Replace `src/data/movies.json` with your dataset:
```json
[
  {
    "id": "1",
    "title": "Your Movie Title",
    "genre": "Action",
    "duration": "2h 30m",
    "rating": "8.5",
    "poster": "https://your-image-url.jpg",
    "description": "Movie description...",
    "cast": ["Actor 1", "Actor 2"],
    "trailer": "https://www.youtube.com/embed/VIDEO_ID",
    "showtimes": ["2026-02-06T14:00", "2026-02-06T17:30"]
  }
]
```

### Connect to Backend API
Replace fetch calls in `Home.jsx` & `MovieDetails.jsx`:
```javascript
// Current:
const response = await fetch('/src/data/movies.json');

// Replace with your API:
const response = await fetch('https://api.example.com/movies');
```

### Change Seat Price
Edit in `SeatSelection.jsx`:
```javascript
const total = selected.length * 12  // Change 8 to your price
```

### Add More Features
- User authentication (login/signup)
- Payment gateway (Stripe, PayPal)
- Booking history dashboard
- Admin panel for managing movies/showtimes
- Email confirmation for bookings
- Real database (MongoDB, PostgreSQL)

---

## 🧪 Development Tips

### Debug Bookings
Open browser DevTools → Console → Run:
```javascript
JSON.parse(localStorage.getItem('bookings'))
```

### Clear All Bookings
```javascript
localStorage.removeItem('bookings')
```

### Add ESLint for Code Quality
```powershell
npm install --save-dev eslint eslint-plugin-react
```

### Add Tests with Vitest
```powershell
npm install --save-dev vitest @testing-library/react
```

### Format with Prettier
```powershell
npm install --save-dev prettier
npm run prettier -- --write src/
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Blank movie list** | Ensure `src/data/movies.json` exists with valid data |
| **Bookings not saving** | Check if LocalStorage is enabled (DevTools → Application → Storage) |
| **Dev server not starting** | Kill process on port 5173: `Get-Process -Name node \| Stop-Process` |
| **Module not found errors** | Run `npm install` again to reinstall dependencies |
| **Styles not loading** | Clear browser cache (Ctrl+Shift+Delete) and restart dev server |

---

## 📦 Production Build

Create optimized build for deployment:
```powershell
npm run build
```

This creates a `dist/` folder with:
- Minified JavaScript & CSS
- Optimized images
- Source maps (for debugging)

Deploy `dist/` to:
- Vercel (recommended for React apps)
- Netlify
- GitHub Pages
- Your own server

---

## 🔄 Next Steps & Roadmap

### Quick Enhancements
- [ ] Add Tailwind CSS for modern styling
- [ ] Implement Material UI components
- [ ] Add user authentication (login/register)
- [ ] Create admin dashboard to manage movies

### Backend Integration
- [ ] Build Node.js/Express backend
- [ ] Set up MongoDB or PostgreSQL
- [ ] Create REST API endpoints
- [ ] Add JWT authentication

### Advanced Features
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications for bookings
- [ ] Seat hold timeout (15 min auto-release)
- [ ] User booking history & profile
- [ ] Reviews & ratings
- [ ] Multi-language support (i18n)

---

## 📝 Component Reference

### MovieCard
Displays a single movie with poster and details.
```jsx
<MovieCard movie={movieObject} />
```

### SearchBar
Filter movies by title, genre, date.
```jsx
<SearchBar filters={filters} setFilters={setFilters} />
```

### SeatGrid
Interactive seat selection for movies.
```jsx
<SeatGrid rows={6} cols={8} bookedSeats={[]} selected={[]} onToggle={toggleSeat} />
```

### BookingSummary
Shows booking details and confirmation button.
```jsx
<BookingSummary summary={bookingData} />
```

---

## 🤝 Contributing

To improve this project:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the **MIT License**. Feel free to use, modify, and distribute it.

---

## 💡 Support & Questions

If you encounter issues or have questions:
1. Check the **Troubleshooting** section above
2. Review component code in `src/components/`
3. Check browser DevTools for error messages
4. Verify your `src/data/movies.json` is valid JSON

---

## 🎯 What's Next?

Would you like me to help with:
- ✅ Add Tailwind CSS styling for a modern look
- ✅ Implement a Node.js/Express mock backend
- ✅ Add user authentication system
- ✅ Create automated tests
- ✅ Deploy to Vercel or Netlify
- ✅ Add payment integration

Just let me know!
