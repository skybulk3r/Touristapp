const { User, Role } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Create a new user
const createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Find a user by ID
const findUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      include: [{ model: Role }],
    });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update user information
const updateUser = async (id, updates) => {
  try {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const [updated] = await User.update(updates, {
      where: { user_id: id },
    });

    if (!updated) {
      throw new Error('User not found');
    }
    return await findUserById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a user
const deleteUser = async (id) => {
  try {
    const deleted = await User.destroy({
      where: { user_id: id },
    });

    if (!deleted) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Find users with filters (for admin)
const findUsers = async (filters) => {
  try {
    const users = await User.findAll({
      where: filters,
      include: [{ model: Role }],
    });
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createUser,
  findUserById,
  updateUser,
  deleteUser,
  findUsers,
};
