# 🎬 IMovies — Movie Ticket Booking Made Simple

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-success?style=for-the-badge)](https://github.com/Yashika-1605/IMovies---Movie-ticket-booking-made-simple.)
[![React 18](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-black?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**IMovies** is an enterprise-grade cinema management and real-time movie ticket booking web application built with the **MERN Stack (MongoDB, Express, React, Node.js)** and **Socket.io**. It delivers instant movie discovery, interactive visual seat selection with collision prevention, promotional checkout, digital tickets with printable passes, and a robust administrative control panel.

---

## 🌟 Key Highlights & Features

### 👤 Customer Experience
- **Cinematic Discovery**: Hero carousel featuring trending movies, full synopses, trailers, cast lists, and duration.
- **Dynamic Search & Filtering**: Instant search by title or keyword; filter by genre (Action, Sci-Fi, Drama, etc.) and city locations.
- **Multiplex Showtimes**: Browse upcoming shows grouped by theatre, screen format (2D, 3D, IMAX 2D, IMAX 3D, 4DX), and starting prices.
- **Interactive Visual Seating Grid**:
  - Curved cinema screen representation with eye-level indicator.
  - Tiered seating zones: **VIP Lounge ($22)**, **Premium ($16)**, and **Regular ($12)**.
  - **Real-Time Seat Locking via Socket.io**: Clicking a seat locks it for 10 minutes across all connected devices, preventing double bookings.
  - Live session countdown timer.
- **Checkout & Mock Payment**:
  - Itemized order breakdown with convenience fee and promotional coupon support (`IMOVIES20` for 20% off).
  - Multi-method mock payment gateway (Credit/Debit Card, UPI / QR, and Net Banking).
- **Instant Digital Tickets**:
  - Formatted ticket with booking reference ID, movie details, hall number, allocated seats, and simulated gate-entry QR code.
  - One-click **Print / Save as PDF** support.
- **User Dashboard**:
  - Full booking history (Upcoming, Completed, Cancelled).
  - Self-service booking cancellation with 90% instant refund calculation and automatic seat liberation.

### 🛡️ Admin Management Console
- **Analytics & Business Metrics**: Live tracking of gross revenue, total tickets booked, active movies, and multiplex screen counts.
- **Movie Catalog CRUD**: Add new movies with poster image uploads (via Multer) or external URLs, durations, genres, and trailers.
- **Theatre Management**: Manage multiplex locations across cities (New York, Los Angeles, Chicago, San Francisco) with screen configurations.
- **Show Scheduling Engine**: Schedule movies for specific dates and times; automatically generates 60 seats (VIP, Premium, Regular) with pricing matrix.
- **Transactions Viewer**: Monitor all customer transactions with status filters (`confirmed`, `cancelled`).

---

## 🏗️ Project Architecture & Monorepo Structure

```
IMovies/
├── .gitignore
├── package.json               # Monorepo task runner (concurrently)
├── vercel.json                # Frontend deployment rewrites for Vercel
├── render.yaml                # Full-stack Blueprint for Render
├── Procfile                   # Process file for backend deployment
├── README.md
│
├── server/                    # Backend API (Node.js & Express)
│   ├── .env.example
│   ├── package.json
│   ├── server.js              # Express entrypoint & Socket.io server
│   ├── config/
│   │   ├── db.js              # MongoDB Mongoose connection
│   │   └── multer.js          # Poster file upload configuration
│   ├── models/
│   │   ├── User.js            # Role-based auth (Admin vs Customer)
│   │   ├── Movie.js           # Movie titles, synopsis, poster, rating
│   │   ├── Theatre.js         # Multiplexes, cities, screens
│   │   ├── Show.js            # Scheduled showtimes & pricing
│   │   ├── Seat.js            # 60 seats per show (available/locked/booked)
│   │   └── Booking.js         # Transactions, tickets & refunds
│   ├── middleware/
│   │   ├── auth.js            # JWT protection & role authorization
│   │   ├── errorHandler.js    # Centralized JSON error responder
│   │   └── rateLimiter.js     # Brute-force & API DDoS limiter
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── theatreController.js
│   │   ├── showController.js
│   │   ├── seatController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── theatreRoutes.js
│   │   ├── showRoutes.js
│   │   ├── seatRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── sockets/
│   │   └── seatSocket.js      # Socket.io room management & seat sweeper
│   ├── seeds/
│   │   └── seed.js            # Complete mock database populator
│   └── uploads/               # Uploaded poster image storage
│
└── client/                    # Frontend SPA (React 18 + Vite + Redux)
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx           # React DOM root with Redux & BrowserRouter
        ├── App.jsx            # Application route tree
        ├── index.css          # Premium Cinema Dark Mode design system
        ├── api/
        │   ├── axios.js       # Axios instance with JWT interceptor
        │   └── socket.js      # Socket.io singleton connection
        ├── store/
        │   ├── index.js       # Redux Toolkit root store
        │   └── slices/
        │       ├── authSlice.js
        │       ├── movieSlice.js
        │       ├── theatreSlice.js
        │       └── bookingSlice.js
        ├── components/
        │   ├── Navbar.jsx     # Navigation, city switcher, user menu
        │   ├── Footer.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── MovieCard.jsx
        │   ├── LoadingSpinner.jsx
        │   ├── TicketModal.jsx# Printable digital ticket with QR code
        │   └── Toast.jsx
        └── pages/
            ├── Home.jsx
            ├── MovieDetails.jsx
            ├── SeatSelection.jsx # Visual grid + Socket.io locks
            ├── Checkout.jsx
            ├── BookingSuccess.jsx
            ├── UserDashboard.jsx
            ├── AdminDashboard.jsx
            ├── Login.jsx
            ├── Register.jsx
            └── NotFound.jsx
```

---

## 📡 RESTful API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Authenticate credentials and receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | Protected |
| `PUT` | `/api/auth/profile` | Update profile details (name, phone) | Protected |

### 🎥 Movies (`/api/movies`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/movies` | Get movies (filters: `genre`, `language`, `search`) | Public |
| `GET` | `/api/movies/featured` | Fetch top-rated featured movies | Public |
| `GET` | `/api/movies/:id` | Fetch movie details with upcoming shows | Public |
| `POST` | `/api/movies` | Create movie (with poster file or URL) | Admin |
| `PUT` | `/api/movies/:id` | Update movie metadata | Admin |
| `DELETE` | `/api/movies/:id` | Soft-delete / deactivate movie | Admin |

### 🏢 Theatres (`/api/theatres`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/theatres` | Fetch theatres (filter by `city`) | Public |
| `GET` | `/api/theatres/cities` | Fetch distinct list of cities | Public |
| `GET` | `/api/theatres/:id` | Fetch theatre details & schedule | Public |
| `POST` | `/api/theatres` | Create new multiplex theatre | Admin |
| `PUT` | `/api/theatres/:id` | Update theatre details | Admin |
| `DELETE` | `/api/theatres/:id` | Deactivate theatre | Admin |

### 🎟️ Shows & Seats (`/api/shows` & `/api/seats`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/shows` | Get scheduled shows by movie/theatre/date | Public |
| `GET` | `/api/shows/:id` | Get show details with populated references | Public |
| `POST` | `/api/shows` | Schedule show & auto-generate 60 seats | Admin |
| `DELETE` | `/api/shows/:id` | Cancel scheduled show | Admin |
| `GET` | `/api/seats/show/:showId` | Get live seat status matrix (sweeps expired locks) | Public |
| `POST` | `/api/seats/lock` | Lock seats for 10 minutes | Protected |
| `POST` | `/api/seats/unlock` | Release locked seats | Protected |

### 💳 Bookings (`/api/bookings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/bookings` | Create booking, process payment, confirm seats | Protected |
| `GET` | `/api/bookings/my-bookings` | Retrieve user's booking history | Protected |
| `GET` | `/api/bookings/:id` | Retrieve single booking receipt | Protected |
| `POST` | `/api/bookings/:id/cancel` | Cancel booking & release seats with 90% refund | Protected |

### 📊 Admin Analytics (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Platform metrics (revenue, tickets, occupancy) | Admin |
| `GET` | `/api/admin/bookings` | View all platform bookings | Admin |
| `GET` | `/api/admin/users` | View registered user directory | Admin |

---

## ⚡ Socket.io Real-Time Protocol

Clients subscribe to show-specific rooms: `show_<showId>`.

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `join:show` | Client ➔ Server | `{ showId, userId }` | Joins the showtime auditorium room |
| `leave:show` | Client ➔ Server | `{ showId }` | Leaves the room on navigation |
| `seat:lock` | Client ➔ Server | `{ showId, seatId, userId }` | Requests a 10-minute lock on a seat |
| `seat:locked` | Server ➔ Room | `{ seatId, seatNumber, lockedBy, lockedUntil }` | Notifies all viewers that seat is locked |
| `seat:unlock` | Client ➔ Server | `{ showId, seatId, userId }` | Voluntarily releases a selected seat |
| `seat:unlocked` | Server ➔ Room | `{ seatId, seatNumber }` | Notifies viewers that seat is free |
| `seat:booked` | Server ➔ Room | `{ seatIds, seatNumbers, bookingId }` | Confirms permanent seat reservation |
| `seat:lock:failed` | Server ➔ Client | `{ seatId, message }` | Warns if seat was claimed concurrently |

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local daemon on `localhost:27017` or free MongoDB Atlas URI)

### 2. Environment Configuration

#### Backend Environment (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/imovies?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend Environment (`client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Installation

From the project root:
```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

Or individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 4. Seed the Database
Populate high-definition movies (*Oppenheimer*, *Interstellar*, *Inception*, *The Dark Knight*, *Dune: Part Two*, *Spider-Man*), multiplex theatres, upcoming shows, 60-seat grids, and demo accounts:
```bash
npm run seed
```

### 5. Run Concurrently
Launch both backend and frontend servers in development mode:
```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@imovies.com` | `Admin@123` |
| **Customer** | `john@example.com` | `Customer@123` |

> *Tip: The Login page includes 1-click quick-fill buttons for both roles.*

---

## 🌐 Instant Deployment Guide (For Mentor Demo)

### Method A: Deploy Frontend to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
2. Import your GitHub repository: `IMovies---Movie-ticket-booking-made-simple`.
3. Set **Root Directory** to `client`.
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://imovies-backend.onrender.com`).
5. Click **Deploy**. Vercel will build and serve your React client with complete SPA routing (`vercel.json`).

### Method B: Deploy Backend & Socket.io to Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **"New +" ➔ "Web Service"**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random secret string.
   - `CLIENT_URL`: Your Vercel frontend URL (e.g., `https://imovies-yourname.vercel.app`).
5. Click **Create Web Service**.
6. Once deployed, run the seed script from Render Shell:
   ```bash
   node seeds/seed.js
   ```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
