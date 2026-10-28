const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'imovies_super_secure_jwt_secret_key_2026';

const MOCK_MOVIES = [
  {
    _id: '66a100000000000000000001',
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
    _id: '66a100000000000000000002',
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
    _id: '66a100000000000000000003',
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
    _id: '66a100000000000000000004',
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
    _id: '66a100000000000000000005',
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
    _id: '66a100000000000000000006',
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

const MOCK_THEATRES = [
  {
    _id: '66a200000000000000000001',
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
    _id: '66a200000000000000000002',
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
    _id: '66a200000000000000000003',
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
    _id: '66a200000000000000000004',
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

// Generate shows
const generateShows = () => {
  const shows = [];
  const times = ['10:30 AM', '02:15 PM', '06:00 PM', '09:30 PM'];
  const formats = ['IMAX 2D', 'Dolby Atmos', '2D', 'IMAX 3D', '4DX'];

  MOCK_MOVIES.forEach((movie, mIdx) => {
    MOCK_THEATRES.forEach((theatre, tIdx) => {
      for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
        const d = new Date();
        d.setDate(d.getDate() + dayOffset);
        d.setHours(0, 0, 0, 0);

        const chosenTimes = times.slice((tIdx + dayOffset) % 2, ((tIdx + dayOffset) % 2) + 2);
        chosenTimes.forEach((time, sIdx) => {
          const showId = `66a300000000000000${mIdx}${tIdx}${dayOffset}${sIdx}`;
          shows.push({
            _id: showId,
            movie: movie._id,
            movieObj: movie,
            theatre: theatre._id,
            theatreObj: theatre,
            screenNumber: (sIdx % theatre.screens) + 1,
            format: formats[(tIdx + sIdx) % formats.length],
            showDate: d.toISOString(),
            showTime: time,
            ticketPrice: {
              regular: 12,
              premium: 16,
              vip: 22,
            },
            totalSeats: 60,
            availableSeatsCount: 58,
            isActive: true,
          });
        });
      }
    });
  });

  return shows;
};

// Generate 60 seats for a show
const generateSeats = (showId) => {
  const seats = [];
  const rows = [
    { row: 'A', tier: 'vip', price: 22 },
    { row: 'B', tier: 'vip', price: 22 },
    { row: 'C', tier: 'premium', price: 16 },
    { row: 'D', tier: 'premium', price: 16 },
    { row: 'E', tier: 'regular', price: 12 },
    { row: 'F', tier: 'regular', price: 12 },
  ];

  rows.forEach(({ row, tier, price }) => {
    for (let col = 1; col <= 10; col++) {
      const isPreBooked = (row === 'C' && (col === 4 || col === 5)) || (row === 'D' && (col === 6 || col === 7));
      seats.push({
        _id: `66a400000000${showId.substring(12, 20)}${row}${col}`,
        show: showId,
        seatNumber: `${row}${col}`,
        row,
        column: col,
        tier,
        price,
        status: isPreBooked ? 'booked' : 'available',
        lockedBy: null,
        lockedUntil: null,
      });
    }
  });

  return seats;
};

// In-Memory state store
class MockStore {
  constructor() {
    this.movies = [...MOCK_MOVIES];
    this.theatres = [...MOCK_THEATRES];
    this.shows = generateShows();
    this.seatCache = new Map();
    this.users = [
      {
        _id: '66a000000000000000000001',
        name: 'IMovies Admin',
        email: 'admin@imovies.com',
        passwordHash: bcrypt.hashSync('Admin@123', 10),
        role: 'admin',
        phone: '+1 (555) 019-2834',
      },
      {
        _id: '66a000000000000000000002',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: bcrypt.hashSync('Customer@123', 10),
        role: 'customer',
        phone: '+1 (555) 014-9988',
      },
    ];
    this.bookings = [
      {
        _id: '66a500000000000000000001',
        bookingId: 'IMV-2026-N7X4B',
        user: '66a000000000000000000002',
        movie: this.movies[0],
        theatre: this.theatres[0],
        show: this.shows[0],
        selectedSeats: [
          { seatNumber: 'C4', tier: 'premium', price: 16 },
          { seatNumber: 'C5', tier: 'premium', price: 16 },
        ],
        subtotal: 32,
        convenienceFee: 2.5,
        discount: 6.4,
        totalAmount: 28.1,
        paymentStatus: 'completed',
        paymentMethod: 'Credit Card',
        bookingStatus: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  getSeats(showId) {
    if (!this.seatCache.has(showId)) {
      this.seatCache.set(showId, generateSeats(showId));
    }
    return this.seatCache.get(showId);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}

const mockStore = new MockStore();
module.exports = mockStore;
