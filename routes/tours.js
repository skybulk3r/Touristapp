// E:\Rental\routes\tours.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/middleware');
const tourService = require('../services/tourService'); // Import the tourService

// GET all tours
router.get('/', (req, res) => {
  try {
    const tours = tourService.getAllTours(); // Get all tours from the service
    res.status(200).json({
      status: 'success',
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error.',
    });
  }
});

// GET a specific tour
router.get('/:id', (req, res) => {
  const tourId = parseInt(req.params.id, 10);

  try {
    const tour = tourService.getTourById(tourId); // Get tour by id from the service
    if (!tour) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tour not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error.',
    });
  }
});

// POST - Create an order for a tour
router.post('/:id/book', verifyToken, (req, res) => {
  const tourId = parseInt(req.params.id, 10);
  const { start_date } = req.body;

  // Validate input
  if (!start_date) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a start date for the tour.',
    });
  }

  try {
    // Create the order using the service
    tourService.createOrder(req.user, tourId, start_date)
      .then(order => {
        res.status(200).json({
          status: 'success',
          message: 'Tour booked successfully. Proceed to payment.',
          data: order,
        });
      })
      .catch(error => {
        res.status(500).json({
          status: 'fail',
          message: 'Error processing the booking.',
        });
      });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
});

module.exports = router;
