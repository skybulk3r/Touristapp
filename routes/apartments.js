const express = require('express');
const router = express.Router();
const ApartmentService = require('../services/apartmentService');
const { verifyToken, verifyAdmin } = require('../middleware/middleware');

// Admin: Create a new apartment
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description, location, price_per_night, imgurls, isavailable } = req.body;

  if (!name || !description || !location || !price_per_night || !imgurls || !Array.isArray(imgurls) || imgurls.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "All fields (name, description, location, price_per_night, imgurls) are required and imgurls should be an array of URLs."
    });
  }

  try {
    const apartment = await ApartmentService.createApartment({
      name,
      description,
      location,
      price_per_night,
      imgurls,  // Now passing the array of image URLs
      isavailable
    });
    res.status(201).json({
      status: "success",
      message: "Apartment created successfully.",
      apartment
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});


// Admin: Update an apartment
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  console.log(req.body); 
  const { name, description, location, price_per_night, imgurls, isavailable } = req.body;
  try {
    const updated = await ApartmentService.updateApartment(req.params.id, { name, description, location, price_per_night, imgurls, isavailable });
    if (updated[0] === 0) {
      return res.status(404).json({ status: "fail", message: "Apartment not found" });
    }
    res.status(200).json({ status: "success", message: "Apartment updated" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Admin: Delete an apartment
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deleted = await ApartmentService.deleteApartment(req.params.id);
    if (deleted === 0) {
      return res.status(404).json({ status: "fail", message: "Apartment not found" });
    }
    res.status(200).json({ status: "success", message: "Apartment deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET all available apartments
router.get('/', async (req, res) => {
  try {
    const apartments = await ApartmentService.getAllApartments();
    res.status(200).json({
      status: "success",
      apartments
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET a specific apartment
router.get('/:id', async (req, res) => {
  try {
    const apartment = await ApartmentService.getApartmentById(req.params.id);
    if (!apartment) {
      return res.status(404).json({ status: "fail", message: "Apartment not found" });
    }
    res.status(200).json({
      status: "success",
      apartment
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Booking: User can book an apartment (redirected to Airbnb)
router.post('/:id/book', verifyToken, async (req, res) => {
  const { start_date, end_date } = req.body;
  if (!start_date || !end_date) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide both start and end dates.',
    });
  }

  try {
    const apartment = await ApartmentService.getApartmentById(req.params.id);
    if (!apartment) {
      return res.status(400).json({
        status: 'fail',
        message: 'Apartment not found.',
      });
    }

    if (!apartment.isavailable) {
      return res.status(400).json({
        status: 'fail',
        message: 'Apartment is not available for booking.',
      });
    }

    // Redirect user to Airbnb for actual booking (can be done via a URL or API integration)
    res.status(200).json({
      status: 'success',
      message: 'Redirecting to Airbnb to complete your booking.',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
