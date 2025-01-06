module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        role_name: { type: Sequelize.DataTypes.STRING, unique: true }
    }, {
        timestamps: false,
    });
  
    Role.associate = function(models) {
        Role.hasMany(models.User, { foreignKey: 'RoleId' });
    };
  
    return Role;
  };
  