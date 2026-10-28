const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Show.deleteMany({}),
      Seat.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    // 1. Create Users
    console.log('[Seed] Seeding Users...');
    const adminUser = await User.create({
      name: 'IMovies Admin',
      email: 'admin@imovies.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 019-2834',
    });

    const customerUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Customer@123',
      role: 'customer',
      phone: '+1 (555) 014-9988',
    });

    // 2. Create Movies
    console.log('[Seed] Seeding Movies...');
    const movies = await Movie.create([
      {
        title: 'Oppenheimer',
        description:
          'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral, political, and personal consequences of creating humanity’s most destructive weapon.',
        genre: ['Biography', 'Drama', 'History'],
        language: 'English',
        duration: 180,
        releaseDate: new Date('2023-07-21'),
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
        title: 'Interstellar',
        description:
          'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans through an Einstein-Rosen bridge wormhole.',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        language: 'English',
        duration: 169,
        releaseDate: new Date('2014-11-07'),
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
        title: 'Inception',
        description:
          'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        language: 'English',
        duration: 148,
        releaseDate: new Date('2010-07-16'),
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
        title: 'The Dark Knight',
        description:
          'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        genre: ['Action', 'Crime', 'Drama'],
        language: 'English',
        duration: 152,
        releaseDate: new Date('2008-07-18'),
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
        title: 'Dune: Part Two',
        description:
          'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        language: 'English',
        duration: 166,
        releaseDate: new Date('2024-03-01'),
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
        title: 'Spider-Man: Across the Spider-Verse',
        description:
          'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
        genre: ['Animation', 'Action', 'Adventure'],
        language: 'English',
        duration: 140,
        releaseDate: new Date('2023-06-02'),
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
    ]);

    // 3. Create Theatres
    console.log('[Seed] Seeding Theatres...');
    const theatres = await Theatre.create([
      {
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
        name: 'Regal LA Live & 4DX',
        location: {
          city: 'Los Angeles',
          address: '1000 W Olympic Blvd',
          state: 'CA',
        },
        screens: 5,
        facilities: ['4DX Motion', 'Dolby Cinema', 'Valet Parking', 'VIP Lounge'],
      },
      {
        name: 'ShowPlace ICON Theatre',
        location: {
          city: 'Chicago',
          address: '1011 S Delano Ct',
          state: 'IL',
        },
        screens: 3,
        facilities: ['Dolby Atmos', 'Laser Projection', 'Heated Recliners', 'Bistro Menu'],
      },
      {
        name: 'Metreon 16 IMAX Experience',
        location: {
          city: 'San Francisco',
          address: '135 4th St, Suite 3000',
          state: 'CA',
        },
        screens: 4,
        facilities: ['IMAX 70mm', 'Dolby Surround 7.1', 'Mobile Concessions'],
      },
    ]);

    // 4. Create Shows & Auto-Generate 60 Seats each
    console.log('[Seed] Seeding Shows & 60-Seat Layouts...');
    const showTimes = ['10:30 AM', '02:15 PM', '06:00 PM', '09:30 PM'];
    const formats = ['IMAX 2D', 'Dolby Atmos', '2D', 'IMAX 3D'];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const createdShows = [];

    // Schedule shows for first 3 movies in different theatres
    for (let i = 0; i < 3; i++) {
      const movie = movies[i];
      const theatre = theatres[i % theatres.length];

      for (let t = 0; t < 2; t++) {
        const show = await Show.create({
          movie: movie._id,
          theatre: theatre._id,
          screenNumber: t + 1,
          format: formats[t],
          showDate: today,
          showTime: showTimes[t * 2],
          ticketPrice: {
            regular: 12,
            premium: 16,
            vip: 22,
          },
          totalSeats: 60,
          availableSeatsCount: 60,
        });

        // Generate 60 seats for this show
        const rows = [
          { row: 'A', tier: 'vip', price: 22 },
          { row: 'B', tier: 'vip', price: 22 },
          { row: 'C', tier: 'premium', price: 16 },
          { row: 'D', tier: 'premium', price: 16 },
          { row: 'E', tier: 'regular', price: 12 },
          { row: 'F', tier: 'regular', price: 12 },
        ];

        const seatsToInsert = [];
        for (const { row, tier, price } of rows) {
          for (let col = 1; col <= 10; col++) {
            seatsToInsert.push({
              show: show._id,
              seatNumber: `${row}${col}`,
              row,
              column: col,
              tier,
              price,
              status: 'available',
            });
          }
        }

        const insertedSeats = await Seat.insertMany(seatsToInsert);
        createdShows.push({ show, seats: insertedSeats });
      }
    }

    // 5. Create a sample confirmed booking for the customer
    console.log('[Seed] Seeding Sample Confirmed Booking...');
    const sampleShow = createdShows[0].show;
    const sampleSeats = createdShows[0].seats.slice(0, 2); // seats A1, A2

    // Mark seats as booked
    await Seat.updateMany(
      { _id: { $in: sampleSeats.map((s) => s._id) } },
      { $set: { status: 'booked', lockedBy: customerUser._id } }
    );

    await Show.findByIdAndUpdate(sampleShow._id, {
      $inc: { availableSeatsCount: -2 },
    });

    await Booking.create({
      bookingId: 'IMV-2026-N7X4B',
      user: customerUser._id,
      show: sampleShow._id,
      selectedSeats: sampleSeats.map((s) => ({
        seatId: s._id,
        seatNumber: s.seatNumber,
        tier: s.tier,
        price: s.price,
      })),
      subtotal: 44,
      convenienceFee: 2.5,
      discount: 0,
      totalAmount: 46.5,
      paymentStatus: 'completed',
      paymentMethod: 'Credit Card',
      paymentTransactionId: 'TXN-IMV-99482',
      bookingStatus: 'confirmed',
    });

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('  Admin Account:    admin@imovies.com  / Admin@123');
    console.log('  Customer Account: john@example.com   / Customer@123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
