module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
      order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tour_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_price: Sequelize.FLOAT,
      payment_status: {
        type: Sequelize.STRING, // 'pending', 'paid', 'failed'
        defaultValue: 'pending',
      },
      stripe_payment_id: Sequelize.STRING, // For storing Stripe payment intent ID
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  
    Order.associate = (models) => {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.belongsTo(models.Tour, { foreignKey: 'tour_id' });
    };
  
    return Order;
  };
  