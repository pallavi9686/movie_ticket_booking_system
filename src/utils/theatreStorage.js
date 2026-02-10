// Theatre Management Storage Functions

// Initialize theatres if not exists
export const initializeTheatres = () => {
  if (!localStorage.getItem('theatres')) {
    const defaultTheatres = [
      {
        id: '1',
        name: 'PVR Cinemas - Phoenix Mall',
        location: 'Phoenix Mall, Whitefield, Bangalore',
        address: '2nd Floor, Phoenix Marketcity, Whitefield Road, Bangalore - 560066',
        facilities: ['Dolby Atmos', 'Recliner Seats', 'Food Court', 'Parking'],
        screens: [
          {
            id: 'screen1',
            name: 'Screen 1',
            type: 'Premium',
            totalSeats: 120,
            seatLayout: {
              rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
              seatsPerRow: 15,
              premiumRows: ['G', 'H'],
              standardRows: ['D', 'E', 'F'],
              economyRows: ['A', 'B', 'C']
            }
          },
          {
            id: 'screen2',
            name: 'Screen 2',
            type: 'Standard',
            totalSeats: 80,
            seatLayout: {
              rows: ['A', 'B', 'C', 'D', 'E', 'F'],
              seatsPerRow: 14,
              premiumRows: ['E', 'F'],
              standardRows: ['C', 'D'],
              economyRows: ['A', 'B']
            }
          }
        ]
      },
      {
        id: '2',
        name: 'INOX - Forum Mall',
        location: 'Forum Mall, Koramangala, Bangalore',
        address: '3rd Floor, Forum Mall, Hosur Road, Koramangala, Bangalore - 560029',
        facilities: ['IMAX', '4DX', 'Premium Dining', 'Valet Parking'],
        screens: [
          {
            id: 'screen1',
            name: 'IMAX Screen',
            type: 'IMAX',
            totalSeats: 200,
            seatLayout: {
              rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
              seatsPerRow: 20,
              premiumRows: ['G', 'H', 'I', 'J'],
              standardRows: ['D', 'E', 'F'],
              economyRows: ['A', 'B', 'C']
            }
          },
          {
            id: 'screen2',
            name: '4DX Screen',
            type: '4DX',
            totalSeats: 60,
            seatLayout: {
              rows: ['A', 'B', 'C', 'D', 'E'],
              seatsPerRow: 12,
              premiumRows: ['D', 'E'],
              standardRows: ['B', 'C'],
              economyRows: ['A']
            }
          }
        ]
      },
      {
        id: '3',
        name: 'Cinepolis - Nexus Mall',
        location: 'Nexus Mall, Koramangala, Bangalore',
        address: '4th Floor, Nexus Mall, Hosur Road, Koramangala, Bangalore - 560095',
        facilities: ['Luxury Recliners', 'Gourmet Food', 'Premium Lounge', 'Valet Service'],
        screens: [
          {
            id: 'screen1',
            name: 'Premium Screen',
            type: 'Premium',
            totalSeats: 100,
            seatLayout: {
              rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
              seatsPerRow: 15,
              premiumRows: ['F', 'G'],
              standardRows: ['D', 'E'],
              economyRows: ['A', 'B', 'C']
            }
          }
        ]
      }
    ];
    localStorage.setItem('theatres', JSON.stringify(defaultTheatres));
  }

  // Initialize theatre shows if not exists
  if (!localStorage.getItem('theatreShows')) {
    localStorage.setItem('theatreShows', JSON.stringify([]));
  }
};

// Theatre CRUD Operations
export const getTheatres = () => {
  return JSON.parse(localStorage.getItem('theatres') || '[]');
};

export const getTheatreById = (id) => {
  const theatres = getTheatres();
  return theatres.find(t => t.id === id);
};

export const addTheatre = (theatreData) => {
  const theatres = getTheatres();
  const newTheatre = {
    id: Date.now().toString(),
    ...theatreData
  };
  theatres.push(newTheatre);
  localStorage.setItem('theatres', JSON.stringify(theatres));
  return newTheatre;
};

export const updateTheatre = (id, theatreData) => {
  const theatres = getTheatres();
  const index = theatres.findIndex(t => t.id === id);
  if (index !== -1) {
    theatres[index] = { ...theatres[index], ...theatreData };
    localStorage.setItem('theatres', JSON.stringify(theatres));
    return true;
  }
  return false;
};

export const deleteTheatre = (id) => {
  const theatres = getTheatres();
  const filtered = theatres.filter(t => t.id !== id);
  localStorage.setItem('theatres', JSON.stringify(filtered));
};

// Theatre Show Management
export const getTheatreShows = () => {
  return JSON.parse(localStorage.getItem('theatreShows') || '[]');
};

export const addTheatreShow = (showData) => {
  const shows = getTheatreShows();
  const newShow = {
    id: Date.now().toString(),
    ...showData,
    createdAt: new Date().toISOString()
  };
  shows.push(newShow);
  localStorage.setItem('theatreShows', JSON.stringify(shows));
  return newShow;
};

export const getShowsByMovie = (movieId) => {
  const shows = getTheatreShows();
  return shows.filter(show => show.movieId === movieId);
};

export const getShowsByTheatre = (theatreId) => {
  const shows = getTheatreShows();
  return shows.filter(show => show.theatreId === theatreId);
};

export const getShowsByMovieAndDate = (movieId, date) => {
  const shows = getTheatreShows();
  return shows.filter(show => 
    show.movieId === movieId && 
    show.showDate === date
  );
};

export const deleteTheatreShow = (showId) => {
  const shows = getTheatreShows();
  const filtered = shows.filter(s => s.id !== showId);
  localStorage.setItem('theatreShows', JSON.stringify(filtered));
};

// Enhanced Booking Functions with Theatre Support
export const getBookedSeatsForTheatreShow = (theatreId, screenId, movieId, showDate, showTime) => {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const relevantBookings = bookings.filter(b => 
    b.theatreId === theatreId &&
    b.screenId === screenId &&
    b.movieId === movieId && 
    b.showDate === showDate &&
    b.showTime === showTime
  );
  
  const bookedSeats = [];
  relevantBookings.forEach(booking => {
    bookedSeats.push(...booking.seats);
  });
  
  return bookedSeats;
};

export const createTheatreBooking = (bookingData) => {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Check if seats are already booked for this specific theatre show
  const existingBooking = bookings.find(b => 
    b.theatreId === bookingData.theatreId &&
    b.screenId === bookingData.screenId &&
    b.movieId === bookingData.movieId && 
    b.showDate === bookingData.showDate &&
    b.showTime === bookingData.showTime &&
    b.seats.some(seat => bookingData.seats.includes(seat))
  );

  if (existingBooking) {
    return { success: false, message: 'Some seats are already booked for this show' };
  }

  const newBooking = {
    id: Date.now().toString(),
    userId: currentUser.userId,
    userName: currentUser.name,
    userEmail: currentUser.email,
    ...bookingData,
    bookingDate: new Date().toISOString()
  };

  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  return { success: true, booking: newBooking };
};

// Calculate seat price based on theatre, screen, and seat category
export const calculateTheatreSeatPrice = (seat, basePrice, theatre, screen) => {
  const row = seat.charAt(0);
  const seatLayout = screen.seatLayout;
  
  let multiplier = 1.0;
  
  if (seatLayout.premiumRows.includes(row)) {
    multiplier = 1.5; // Premium seats - 50% more
  } else if (seatLayout.standardRows.includes(row)) {
    multiplier = 1.0; // Standard price
  } else if (seatLayout.economyRows.includes(row)) {
    multiplier = 0.8; // Economy seats - 20% less
  }
  
  // Additional multiplier based on screen type
  const screenMultiplier = {
    'IMAX': 1.8,
    '4DX': 2.0,
    'Premium': 1.3,
    'Standard': 1.0
  };
  
  return basePrice * multiplier * (screenMultiplier[screen.type] || 1.0);
};

export const calculateTheatreTotalPrice = (seats, basePrice, theatre, screen) => {
  return seats.reduce((total, seat) => {
    return total + calculateTheatreSeatPrice(seat, basePrice, theatre, screen);
  }, 0);
};

// Get theatres showing a specific movie
export const getTheatresForMovie = (movieId, date) => {
  const shows = getShowsByMovieAndDate(movieId, date);
  const theatres = getTheatres();
  
  const theatreMap = new Map();
  
  shows.forEach(show => {
    const theatre = theatres.find(t => t.id === show.theatreId);
    if (theatre) {
      if (!theatreMap.has(theatre.id)) {
        theatreMap.set(theatre.id, {
          ...theatre,
          shows: []
        });
      }
      theatreMap.get(theatre.id).shows.push(show);
    }
  });
  
  return Array.from(theatreMap.values());
};