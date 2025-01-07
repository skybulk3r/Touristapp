// E:\Rental\services\roleService.js
const { Role } = require('../models'); // Import Role model from models

// Create a new role
const createRole = async (roleData) => {
  try {
    const role = await Role.create({
      role_name: roleData.role_name,
    });
    return role;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all roles
const getAllRoles = async () => {
  try {
    const roles = await Role.findAll();
    return roles;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get role by ID
const getRoleById = async (roleId) => {
  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update a role by ID
const updateRole = async (roleId, roleData) => {
  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new Error('Role not found');
    }
    role.role_name = roleData.role_name || role.role_name;
    await role.save();
    return role;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a role by ID
const deleteRole = async (roleId) => {
  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new Error('Role not found');
    }
    await role.destroy();
    return { message: 'Role deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
