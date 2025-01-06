module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: Sequelize.STRING,
      email: { type: Sequelize.STRING, unique: true },
      password: Sequelize.STRING,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  
    User.associate = (models) => {
      User.hasMany(models.Booking, { foreignKey: 'user_id' });
      User.belongsTo(models.Role, { foreignKey: 'RoleId' });
    };
  
    return User;
  };
  