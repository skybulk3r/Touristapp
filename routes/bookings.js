const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');
const { verifyToken, verifyAdmin } = require('../middleware/middleware');

// Create a booking
router.post('/create', async (req, res) => {
  try {
    const bookingData = req.body;

    // Ensure bookingType is provided
    if (!bookingData.booking_type || !['airbnb', 'getaround', 'tour'].includes(bookingData.booking_type)) {
      return res.status(400).json({ message: 'Invalid booking type' });
    }

    const newBooking = await bookingService.createBooking(bookingData);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await bookingService.getBookingById(bookingId);
    
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings for a user, with optional filter by booking type
router.get('/', async (req, res) => {
  const { userId, bookingType } = req.query; // Optional filter for booking type
  try {
    const bookings = await bookingService.getBookings(userId, bookingType); // Pass filter to service
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only route: Update booking
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updateData = req.body;
    const updatedBooking = await bookingService.updateBooking(bookingId, updateData);
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only route: Delete booking
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const result = await bookingService.deleteBooking(bookingId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
