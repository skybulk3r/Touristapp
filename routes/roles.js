// E:\Rental\routes\roles.js
const express = require('express');
const router = express.Router();
const roleService = require('../services/roleService'); // Import the roleService
const { verifyToken, verifyAdmin } = require('../middleware/middleware');; // Import the middleware

// Create a new role - Only Admins
router.post('/create', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { role_name } = req.body;
    if (!role_name) {
      return res.status(400).json({ message: 'Role name is required' });
    }
    const newRole = await roleService.createRole({ role_name });
    res.status(201).json({ message: 'Role created successfully', role: newRole });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all roles - Accessible to all logged-in users (No admin needed)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a role by ID - Accessible to all logged-in users (No admin needed)
router.get('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a role - Only Admins
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { role_name } = req.body;
    const updatedRole = await roleService.updateRole(req.params.id, { role_name });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a role - Only Admins
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await roleService.deleteRole(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
