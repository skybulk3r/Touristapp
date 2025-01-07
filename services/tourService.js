const Order = require('../models/order'); // Assuming you have the order model defined

// Function to get all tours
const getAllTours = () => {
  const toursData = require('../public/json/data.json').tours;
  return toursData;
};

// Function to get a specific tour by id
const getTourById = (tourId) => {
  const toursData = require('../public/json/data.json').tours;
  return toursData.find(tour => tour.tour_id === tourId);
};

// Function to create an order for a tour
const createOrder = (user, tourId, start_date) => {
  const toursData = require('../public/json/data.json').tours;
  const tour = toursData.find(tour => tour.tour_id === tourId);

  if (!tour) {
    throw new Error('Tour not found.');
  }

  const order = {
    user_id: user.user_id,
    tour_id: tourId,
    total_price: tour.price,
    payment_status: 'pending',
  };

  // Simulate saving the order in the database
  return Order.create(order);
};

module.exports = {
  getAllTours,
  getTourById,
  createOrder,
};
