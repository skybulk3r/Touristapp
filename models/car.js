module.exports = (sequelize, Sequelize) => {
  const Car = sequelize.define('Car', {
    car_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    make: Sequelize.STRING,
    model: Sequelize.STRING,
    year: Sequelize.INTEGER,
    price_per_day: Sequelize.FLOAT,
    availability: { type: Sequelize.BOOLEAN, defaultValue: true },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  Car.associate = (models) => {
    Car.hasMany(models.Booking, { foreignKey: 'car_id' });
  };

  return Car;
};
