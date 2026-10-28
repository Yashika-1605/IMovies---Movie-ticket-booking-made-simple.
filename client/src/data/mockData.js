// IMovies - High-Fidelity Client-Side Fallback & Demo Dataset
// Ensures 100% interactive functionality on static demo links and offline environments

export const MOCK_MOVIES = [
  {
    _id: 'm-oppenheimer',
    title: 'Oppenheimer',
    description:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral, political, and personal consequences of creating humanity’s most destructive weapon.',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    releaseDate: '2023-07-21',
    posterUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    rating: 8.9,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    isActive: true,
  },
  {
    _id: 'm-interstellar',
    title: 'Interstellar',
    description:
      'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans through an Einstein-Rosen bridge wormhole.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    releaseDate: '2014-11-07',
    posterUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    rating: 8.7,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    isActive: true,
  },
  {
    _id: 'm-inception',
    title: 'Inception',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    language: 'English',
    duration: 148,
    releaseDate: '2010-07-16',
    posterUrl:
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    rating: 8.8,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    isActive: true,
  },
  {
    _id: 'm-darkknight',
    title: 'The Dark Knight',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    language: 'English',
    duration: 152,
    releaseDate: '2008-07-18',
    posterUrl:
      'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    rating: 9.0,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman'],
    isActive: true,
  },
  {
    _id: 'm-dune2',
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    language: 'English',
    duration: 166,
    releaseDate: '2024-03-01',
    posterUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    rating: 8.6,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    isActive: true,
  },
  {
    _id: 'm-spiderman',
    title: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    releaseDate: '2023-06-02',
    posterUrl:
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    rating: 8.7,
    director: 'Joaquim Dos Santos',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    isActive: true,
  },
];

export const MOCK_THEATRES = [
  {
    _id: 't-amc-empire',
    name: 'AMC Empire 25 IMAX',
    location: {
      city: 'New York',
      address: '234 W 42nd St, Times Square',
      state: 'NY',
    },
    screens: 4,
    facilities: ['IMAX Laser', 'Dolby Atmos', 'Recliner Seats', 'Full Bar', 'Gourmet Dine-In'],
  },
  {
    _id: 't-regal-la',
    name: 'Regal LA Live & 4DX',
    location: {
      city: 'Los Angeles',
      address: '1000 W Olympic Blvd',
      state: 'CA',
    },
    screens: 3,
    facilities: ['4DX Motion', 'Dolby Atmos', 'VIP Lounges', 'Reserved Seating'],
  },
  {
    _id: 't-amc-river',
    name: 'AMC River East 21',
    location: {
      city: 'Chicago',
      address: '322 E Illinois St',
      state: 'IL',
    },
    screens: 4,
    facilities: ['Dolby Cinema', 'Laser Projection', 'Heated Recliners'],
  },
  {
    _id: 't-alamo-sf',
    name: 'Alamo Drafthouse Cinema',
    location: {
      city: 'San Francisco',
      address: '2550 Mission St',
      state: 'CA',
    },
    screens: 3,
    facilities: ['35mm Projection', 'Full Table Service', 'Curated Craft Beers'],
  },
];

export const MOCK_CITIES = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];

// Dynamically generate shows for today and upcoming 4 days
export const generateMockShows = () => {
  const shows = [];
  const times = ['10:30 AM', '01:45 PM', '05:00 PM', '08:30 PM', '11:15 PM'];
  const formats = ['IMAX 2D', 'Dolby Atmos 2D', 'RealD 3D', 'IMAX 3D', '4DX'];

  MOCK_MOVIES.forEach((movie) => {
    MOCK_THEATRES.forEach((theatre, tIdx) => {
      for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
        const d = new Date();
        d.setDate(d.getDate() + dayOffset);
        d.setHours(0, 0, 0, 0);

        // Pick 2-3 showtimes per theatre per movie
        const chosenTimes = times.slice((tIdx + dayOffset) % 2, ((tIdx + dayOffset) % 2) + 3);

        chosenTimes.forEach((time, sIdx) => {
          const showId = `show-${movie._id}-${theatre._id}-d${dayOffset}-s${sIdx}`;
          shows.push({
            _id: showId,
            movie: movie,
            theatre: theatre,
            screenNumber: (sIdx % theatre.screens) + 1,
            format: formats[(tIdx + sIdx) % formats.length],
            showDate: d.toISOString(),
            showTime: time,
            pricing: {
              regular: 12,
              premium: 16,
              vip: 22,
            },
            isActive: true,
          });
        });
      }
    });
  });

  return shows;
};

// Generates 60 seats (Rows A to F, 10 columns each) with VIP, Premium, and Regular tiers
export const generateMockSeats = (showId) => {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = 10;

  rows.forEach((row, rIdx) => {
    for (let c = 1; c <= cols; c++) {
      let tier = 'regular';
      let price = 12;

      if (rIdx === 0) {
        tier = 'vip';
        price = 22;
      } else if (rIdx >= 1 && rIdx <= 3) {
        tier = 'premium';
        price = 16;
      }

      // Pre-book a couple of seats for realistic cinema appearance
      const isPreBooked = (row === 'C' && (c === 4 || c === 5)) || (row === 'D' && (c === 6 || c === 7));

      seats.push({
        _id: `seat-${showId}-${row}${c}`,
        show: showId,
        seatNumber: `${row}${c}`,
        row: row,
        col: c,
        tier: tier,
        price: price,
        status: isPreBooked ? 'booked' : 'available',
        lockedBy: null,
        lockedUntil: null,
      });
    }
  });

  return seats;
};

// Seed bookings in localStorage if empty
export const getStoredBookings = () => {
  try {
    const raw = localStorage.getItem('imovies_user_bookings');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }

  // Initial seed booking
  const initial = [
    {
      _id: 'bk-demo-101',
      bookingReference: 'IMV-84920419',
      movie: MOCK_MOVIES[0],
      theatre: MOCK_THEATRES[0],
      show: {
        _id: 'show-demo-1',
        showDate: new Date(Date.now() + 86400000).toISOString(),
        showTime: '08:30 PM',
        screenNumber: 1,
        format: 'IMAX 2D',
      },
      seats: [
        { seatNumber: 'B4', tier: 'premium', price: 16 },
        { seatNumber: 'B5', tier: 'premium', price: 16 },
      ],
      totalAmount: 32,
      discountAmount: 6.4,
      finalAmount: 28.1,
      paymentMethod: 'Credit Card',
      paymentStatus: 'completed',
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem('imovies_user_bookings', JSON.stringify(initial));
  return initial;
};

export const saveBookingToStorage = (booking) => {
  const list = getStoredBookings();
  const updated = [booking, ...list];
  localStorage.setItem('imovies_user_bookings', JSON.stringify(updated));
  return booking;
};

export const cancelBookingInStorage = (bookingId) => {
  const list = getStoredBookings();
  const index = list.findIndex((b) => b._id === bookingId);
  if (index >= 0) {
    list[index].bookingStatus = 'cancelled';
    list[index].refundAmount = parseFloat((list[index].finalAmount * 0.9).toFixed(2));
    list[index].cancelledAt = new Date().toISOString();
    localStorage.setItem('imovies_user_bookings', JSON.stringify(list));
    return list[index];
  }
  return null;
};
