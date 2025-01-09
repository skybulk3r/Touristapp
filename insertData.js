const { Apartment, Car, Tour, Role, sequelize } = require('./models'); // Import your models
const fs = require('fs');

// Read the JSON data from the file (you can store the JSON in a file or directly embed it here)
const jsonData = JSON.parse(fs.readFileSync('E:/Rental/public/json/data.json', 'utf-8'));

// Function to insert apartments into the database
const insertApartments = async () => {
  for (const apartment of jsonData.apartments) {
    await Apartment.create({
      name: apartment.name,
      location: apartment.location,
      price_per_night: apartment.price_per_night,
      weekly_rental: apartment.weekly_rental,
      monthly_rental: apartment.monthly_rental,
      description: apartment.description,
      availability: apartment.availability,
      imgurls: apartment.imgurls || []  // Use an empty array if imgurls is not present
    });
  }
};

// Function to insert cars into the database
const insertCars = async () => {
  for (const car of jsonData.cars) {
    await Car.create({
      make: car.make,
      model: car.model,
      year: car.year,
      price_per_day: car.price_per_day,
      extra_km_charge: car.extra_km_charge,
      availability: car.availability,
    });
  }
};

// Function to insert tours into the database
const insertTours = async () => {
  for (const tour of jsonData.tours) {
    await Tour.create({
      name: tour.name,
      description: tour.description,
      price: tour.price,
      location: tour.location,
      availability: tour.availability,
    });
  }
};

// Function to insert roles into the database
const insertRoles = async () => {
  for (const role of jsonData.roles) {
    await Role.create({
      role_name: role.role_name,
    });
  }
};

// Function to insert booking rules (you can adjust based on your model structure)
const insertBookingRules = async () => {
  // Insert booking rules directly or use them in relevant models if needed
  console.log("Booking rules:", jsonData.booking_rules);
};

// Run all the insert functions inside an async function
const insertData = async () => {
  try {
    await sequelize.sync(); // Sync the models with the database
    await insertApartments();
    await insertRoles();
    await insertCars();
    await insertTours();
    await insertBookingRules();
    console.log('Data successfully inserted into the database!');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    sequelize.close(); // Close the connection
  }
};

// Call the insert function
insertData();
