const express = require('express');
const router = express.Router();
const carService = require('../services/carService');
const { verifyToken, verifyAdmin } = require('../middleware/middleware');

// Create a car booking (Getaround)
router.post('/create', async (req, res) => {
  try {
    const { userId, bookingData } = req.body; // userId is typically taken from the auth token
    const newCarBooking = await carService.createCarBooking(userId, bookingData);
    res.status(201).json(newCarBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a car by ID
router.get('/:id', async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await carService.getCarById(carId);
    if (car) {
      res.status(200).json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only route: Update car details (for Getaround)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const carId = req.params.id;
    const updateData = req.body;
    const updatedCar = await carService.updateCarDetails(carId, updateData);
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only route: Delete car (soft delete)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const carId = req.params.id;
    const result = await carService.deleteCar(carId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
