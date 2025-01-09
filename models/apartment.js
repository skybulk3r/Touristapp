module.exports = (sequelize, Sequelize) => {
  const Apartment = sequelize.define('Apartment', {
    apartment_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    location: Sequelize.STRING,
    price_per_night: Sequelize.FLOAT,
    description: Sequelize.STRING,
    isavailable: { type: Sequelize.BOOLEAN, defaultValue: true },
    imgurls: {
      type: Sequelize.JSON,  // Use JSON to store an array of URLs
      allowNull: false,
    },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  Apartment.associate = (models) => {
    Apartment.hasMany(models.Booking, { foreignKey: 'apartment_id' });
  };

  return Apartment;
};
