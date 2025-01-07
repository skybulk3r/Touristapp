const db = require('../models'); // assuming the models are in the 'models' folder
const Booking = db.Booking;
const Car = db.Car;
const Apartment = db.Apartment;
const Tour = db.Tour;

const createBooking = async (userId, bookingData) => {
  try {
    let associatedModelData;

    // Handle Getaround car booking logic
    if (bookingData.booking_type === 'getaround') {
      // Find the car based on car_id in the booking data
      const car = await Car.findOne({ where: { car_id: bookingData.car_id } });
      if (!car) {
        throw new Error('Car not found for Getaround booking');
      }

      // Optionally, process payment using the Getaround API (this could be Stripe or another service)
      // Assume payment is successful, update the car availability, etc.
      associatedModelData = { car_id: car.car_id };

    } else if (bookingData.booking_type === 'airbnb') {
      // Handle Airbnb apartment booking logic
      const apartment = await Apartment.findOne({ where: { apartment_id: bookingData.apartment_id } });
      if (!apartment) {
        throw new Error('Apartment not found for Airbnb booking');
      }

      // Process payment for Airbnb booking (via Stripe or another service)
      associatedModelData = { apartment_id: apartment.apartment_id };

    } else if (bookingData.booking_type === 'tour') {
      // Handle Tour booking logic
      const tour = await Tour.findOne({ where: { tour_id: bookingData.tour_id } });
      if (!tour) {
        throw new Error('Tour not found for Tour booking');
      }

      // Process payment using Stripe or another payment service
      associatedModelData = { tour_id: tour.tour_id };

    } else {
      throw new Error('Invalid booking type');
    }

    // After processing, create the booking in the system
    const newBooking = await Booking.create({
      ...bookingData,
      user_id: userId, // Associate with the logged-in user
      ...associatedModelData, // Link to the correct model (car, apartment, or tour)
    });

    return newBooking;
  } catch (error) {
    throw new Error('Error creating booking: ' + error.message);
  }
};

const getBookingById = async (bookingId) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_id: bookingId },
      include: [db.User, db.Apartment, db.Car, db.Tour], // Include related models
    });
    return booking;
  } catch (error) {
    throw new Error('Error fetching booking: ' + error.message);
  }
};

const updateBooking = async (bookingId, updateData) => {
  try {
    const booking = await Booking.update(updateData, {
      where: { booking_id: bookingId },
      returning: true,
    });
    return booking[1][0]; // Return the updated booking
  } catch (error) {
    throw new Error('Error updating booking: ' + error.message);
  }
};

const deleteBooking = async (bookingId) => {
  try {
    await Booking.destroy({ where: { booking_id: bookingId } });
    return { message: 'Booking deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting booking: ' + error.message);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
};
