const { Apartment, sequelize } = require('../models'); // Assuming Apartment model is defined in your models folder.

class ApartmentService {
  async createApartment(apartmentData) {
    return await Apartment.create(apartmentData);
  }

  async getAllApartments() {
    const query = `
      SELECT 
        apartments.apartment_id,
        apartments.name,
        apartments.description,
        apartments.location,
        apartments.price_per_night,
        apartments.imgurls,
        apartments.isavailable,
        apartments.created_at,
        apartments.createdAt,
        apartments.updatedAt
      FROM apartments
    `;
    const [results] = await sequelize.query(query);
    return results;
  }

  async getApartmentById(apartmentId) {
    return await Apartment.findOne({
      where: { apartment_id: apartmentId }
    });
  }

  async updateApartment(apartmentId, apartmentData) {
    return await Apartment.update(apartmentData, {
      where: { apartment_id: apartmentId }
    });
  }

  async deleteApartment(apartmentId) {
    return await Apartment.destroy({
      where: { apartment_id: apartmentId }
    });
  }
}

module.exports = new ApartmentService();
