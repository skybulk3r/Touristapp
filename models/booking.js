module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define('Booking', {
    booking_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_date: Sequelize.DATEONLY,
    end_date: Sequelize.DATEONLY,
    total_price: Sequelize.FLOAT,
    payment_status: {
      type: Sequelize.STRING, // 'pending', 'paid'
      defaultValue: 'pending',
    },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    booking_type: { 
      type: Sequelize.STRING, 
      allowNull: false, 
      validate: { 
        isIn: [['airbnb', 'getaround', 'tour']] 
      }, 
      defaultValue: 'tour' // Assuming tours as default for your app
    }
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'user_id' });
    Booking.belongsTo(models.Apartment, { foreignKey: 'apartment_id', allowNull: true });
    Booking.belongsTo(models.Car, { foreignKey: 'car_id', allowNull: true });
    Booking.belongsTo(models.Tour, { foreignKey: 'tour_id', allowNull: true });
  };

  return Booking;
};
