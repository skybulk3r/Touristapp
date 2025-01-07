const db = require('../models'); // Assuming models are in the 'models' folder
const Car = db.Car;
const Booking = db.Booking;

const createCarBooking = async (userId, bookingData) => {
  try {
    // Fetch car data to associate with the booking
    const car = await Car.findOne({ where: { car_id: bookingData.car_id } });
    if (!car) {
      throw new Error('Car not found');
    }

    // Handle Getaround payment and availability check (this will be specific to the Getaround API)
    // For example, if you are using Stripe or another service to process payments, integrate here.
    // Assuming payment is processed successfully

    // After processing, create the booking in the system
    const newBooking = await Booking.create({
      ...bookingData,
      user_id: userId, // Associate with the logged-in user
      car_id: car.car_id, // Link to the selected car
    });

    // Update car availability (if needed)
    // Example: car.is_available = false; car.save();

    return newBooking;
  } catch (error) {
    throw new Error('Error creating car booking: ' + error.message);
  }
};

const getCarById = async (carId) => {
  try {
    const car = await Car.findOne({
      where: { car_id: carId },
    });
    return car;
  } catch (error) {
    throw new Error('Error fetching car: ' + error.message);
  }
};

const updateCarDetails = async (carId, updateData) => {
  try {
    const car = await Car.update(updateData, {
      where: { car_id: carId },
      returning: true,
    });
    return car[1][0]; // Return the updated car
  } catch (error) {
    throw new Error('Error updating car details: ' + error.message);
  }
};

const deleteCar = async (carId) => {
  try {
    await Car.destroy({ where: { car_id: carId } });
    return { message: 'Car deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting car: ' + error.message);
  }
};

module.exports = {
  createCarBooking,
  getCarById,
  updateCarDetails,
  deleteCar,
};
