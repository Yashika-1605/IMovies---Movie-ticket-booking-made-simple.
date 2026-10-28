const Seat = require('../models/Seat');

/**
 * Socket.IO Handler for Real-Time Seat Tracking & Locking
 * @param {import('socket.io').Server} io
 */
module.exports = function (io) {
  // Store connected users mapping: socket.id -> { userId, showId, lockedSeatIds: Set }
  const socketSessions = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join show room to receive real-time updates for that specific showtime
    socket.on('join:show', ({ showId, userId }) => {
      if (!showId) return;
      const room = `show_${showId}`;
      socket.join(room);
      socketSessions.set(socket.id, {
        userId: userId || null,
        showId,
        lockedSeatIds: new Set(),
      });
      console.log(`[Socket.io] User ${userId || 'guest'} (${socket.id}) joined ${room}`);
    });

    // Leave show room
    socket.on('leave:show', ({ showId }) => {
      if (!showId) return;
      const room = `show_${showId}`;
      socket.leave(room);
      console.log(`[Socket.io] Socket ${socket.id} left ${room}`);
    });

    // Request to lock a seat (when user clicks an available seat)
    socket.on('seat:lock', async ({ showId, seatId, userId }) => {
      try {
        if (!showId || !seatId || !userId) return;

        const seat = await Seat.findOne({ _id: seatId, show: showId });
        if (!seat) return;

        const now = new Date();

        // Check if already booked
        if (seat.status === 'booked') {
          socket.emit('seat:lock:failed', {
            seatId,
            message: 'Seat has already been booked by another user.',
          });
          return;
        }

        // Check if locked by someone else and lock hasn't expired
        if (
          seat.status === 'locked' &&
          seat.lockedBy &&
          seat.lockedBy.toString() !== userId.toString() &&
          seat.lockedUntil &&
          seat.lockedUntil > now
        ) {
          socket.emit('seat:lock:failed', {
            seatId,
            message: 'Seat is currently reserved by another customer.',
          });
          return;
        }

        // Set lock for 10 minutes
        const lockedUntil = new Date(Date.now() + 10 * 60 * 1000);
        seat.status = 'locked';
        seat.lockedBy = userId;
        seat.lockedUntil = lockedUntil;
        await seat.save();

        // Track in session
        const session = socketSessions.get(socket.id);
        if (session) {
          session.lockedSeatIds.add(seatId.toString());
        }

        // Broadcast to all users in the show room
        io.to(`show_${showId}`).emit('seat:locked', {
          seatId: seat._id,
          seatNumber: seat.seatNumber,
          lockedBy: userId,
          lockedUntil,
        });

        console.log(`[Seat Lock] Seat ${seat.seatNumber} locked for user ${userId}`);
      } catch (err) {
        console.error('[Seat Lock Error]', err);
      }
    });

    // Request to unlock a seat (when user deselects)
    socket.on('seat:unlock', async ({ showId, seatId, userId }) => {
      try {
        if (!showId || !seatId) return;

        const seat = await Seat.findOne({ _id: seatId, show: showId });
        if (!seat) return;

        // If seat is already booked, do nothing
        if (seat.status === 'booked') return;

        // Release lock
        seat.status = 'available';
        seat.lockedBy = null;
        seat.lockedUntil = null;
        await seat.save();

        const session = socketSessions.get(socket.id);
        if (session) {
          session.lockedSeatIds.delete(seatId.toString());
        }

        // Broadcast to show room
        io.to(`show_${showId}`).emit('seat:unlocked', {
          seatId: seat._id,
          seatNumber: seat.seatNumber,
        });

        console.log(`[Seat Unlock] Seat ${seat.seatNumber} unlocked`);
      } catch (err) {
        console.error('[Seat Unlock Error]', err);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      const session = socketSessions.get(socket.id);
      if (session) {
        console.log(`[Socket.io] Disconnected: ${socket.id} (Show: ${session.showId})`);
        socketSessions.delete(socket.id);
      }
    });
  });

  // Background interval: sweep expired locks every 30 seconds
  setInterval(async () => {
    try {
      const now = new Date();
      const expiredSeats = await Seat.find({
        status: 'locked',
        lockedUntil: { $lte: now },
      });

      if (expiredSeats.length > 0) {
        for (const seat of expiredSeats) {
          seat.status = 'available';
          seat.lockedBy = null;
          seat.lockedUntil = null;
          await seat.save();

          io.to(`show_${seat.show}`).emit('seat:unlocked', {
            seatId: seat._id,
            seatNumber: seat.seatNumber,
            reason: 'Lock expired',
          });
        }
        console.log(`[Seat Sweeper] Auto-released ${expiredSeats.length} expired seat lock(s)`);
      }
    } catch (err) {
      console.error('[Seat Sweeper Error]', err);
    }
  }, 30000);
};
