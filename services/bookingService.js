const db = require('../models'); // assuming the models are in the 'models' folder
const Booking = db.Booking;
const Car = db.Car;
const Apartment = db.Apartment;
const Tour = db.Tour;

const createBooking = async (userId, bookingData) => {
  try {
    let associatedModelData = {};
    let totalPrice = 0;

    // Log bookingData for debugging
    console.log('Booking Data:', bookingData);
    console.log('Days:', bookingData.days);
    console.log('Nights:', bookingData.nights);
    console.log('Persons:', bookingData.persons);

    // Handle Getaround car booking
    if (bookingData.booking_type === 'getaround') {
      const car = await Car.findOne({ where: { car_id: bookingData.car_id } });
      if (!car) {
        throw new Error('Car not found for Getaround booking');
      }
      associatedModelData = { car_id: car.car_id };
      const days = parseInt(bookingData.days, 10) || Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / (1000 * 3600 * 24));
      if (isNaN(days) || days <= 0) {
        throw new Error('Invalid number of days');
      }
      totalPrice += car.price_per_day * days;  // Add car price to total
    } 
    // Handle Airbnb apartment booking
    else if (bookingData.booking_type === 'airbnb') {
      const apartment = await Apartment.findOne({ where: { apartment_id: bookingData.apartment_id } });
      if (!apartment) {
        throw new Error('Apartment not found for Airbnb booking');
      }
      associatedModelData = { apartment_id: apartment.apartment_id };
      const nights = parseInt(bookingData.nights, 10) || Math.ceil((new Date(bookingData.end_date) - new Date(bookingData.start_date)) / (1000 * 3600 * 24));
      if (isNaN(nights) || nights <= 0) {
        throw new Error('Invalid number of nights');
      }
      totalPrice += apartment.price_per_night * nights;  // Add apartment price to total
    }
    // Handle Tour booking
    else if (bookingData.booking_type === 'tour') {
      const tour = await Tour.findOne({ where: { tour_id: bookingData.tour_id } });
      if (!tour) {
        throw new Error('Tour not found for Tour booking');
      }
      
      console.log('Tour data:', tour);  // Log the tour object to check its contents
      
      associatedModelData = { tour_id: tour.tour_id };
      const persons = parseInt(bookingData.persons, 10) || 1;  // Default to 1 person if not specified
    
      if (!tour.price) {
        throw new Error('Tour price per person is missing');
      }
    
      totalPrice += tour.price * persons;  // Add tour price to total
    }    
    else {
      throw new Error('Invalid booking type');
    }

    // Check if there's any valid price
    if (totalPrice <= 0) {
      throw new Error('Invalid total price');
    }

    // Create the booking in the system
    const newBooking = await Booking.create({
      ...bookingData,
      user_id: userId,
      total_price: totalPrice,
      ...associatedModelData,  // Link to the correct model (car, apartment, or tour)
    });

    // Return the booking details
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
    // Perform the update
    await Booking.update(updateData, {
      where: { booking_id: bookingId },
    });

    // Fetch the updated booking after the update
    const updatedBooking = await Booking.findOne({
      where: { booking_id: bookingId },
    });

    if (!updatedBooking) {
      throw new Error('Booking not found');
    }

    return updatedBooking;
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
