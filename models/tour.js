module.exports = (sequelize, Sequelize) => {
  const Tour = sequelize.define('Tour', {
    tour_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    price: Sequelize.FLOAT,
    location: Sequelize.STRING,
    availability: { type: Sequelize.BOOLEAN, defaultValue: true },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  Tour.associate = (models) => {
    Tour.hasMany(models.Booking, { foreignKey: 'tour_id' });
    Tour.hasMany(models.Order, { foreignKey: 'tour_id' });
  };

  return Tour;
};
