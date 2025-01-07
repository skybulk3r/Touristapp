// E:\Rental\services\userService.js
const User = require('../models/user'); // Assuming you have the User model defined
const bcrypt = require('bcryptjs'); // Assuming bcrypt is used for hashing passwords

// Function to get all users (Admin only)
const getAllUsers = () => {
  return User.findAll();
};

// Function to get a specific user by id
const getUserById = (userId) => {
  return User.findByPk(userId);
};

// Function to update user information
const updateUser = (userId, userData) => {
  return User.update(userData, {
    where: { user_id: userId },
    returning: true, // Returns the updated user data
  });
};

// Function to delete a user (admin only)
const deleteUser = (userId) => {
  return User.destroy({
    where: { user_id: userId },
  });
};

// Function to change a user's password
const changePassword = (userId, newPassword) => {
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  return User.update({ password: hashedPassword }, {
    where: { user_id: userId },
    returning: true,
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
};
