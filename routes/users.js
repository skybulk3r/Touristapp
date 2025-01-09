// E:\Rental\routes\users.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/middleware');
const userService = require('../services/userService'); // Import the userService

// GET all users (Admin only)
router.get('/', verifyToken, verifyAdmin, (req, res) => {
  userService.getAllUsers()
    .then(users => {
      res.status(200).json({
        status: 'success',
        data: users,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: 'fail',
        message: 'Error fetching users.',
      });
    });
});

// GET a specific user by id
router.get('/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  userService.getUserById(userId)
    .then(user => {
      if (!user) {
        return res.status(400).json({
          status: 'fail',
          message: 'User not found.',
        });
      }

      res.status(200).json({
        status: 'success',
        data: user,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: 'fail',
        message: 'Error fetching user.',
      });
    });
});

// PUT - Update user information (Admin or user can update their own data)
router.put('/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userData = req.body;

  if (req.user.user_id !== userId && req.user.role !== 1) {
    return res.status(403).json({
      status: 'fail',
      message: 'You do not have permission to update this user.',
    });
  }

  userService.updateUser(userId, userData)
    .then(([rowsUpdated, [updatedUser]]) => {
      if (!rowsUpdated) {
        return res.status(400).json({
          status: 'fail',
          message: 'User not found or no changes made.',
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'User updated successfully.',
        data: updatedUser,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: 'fail',
        message: 'Error updating user.',
      });
    });
});

// DELETE - Delete a user (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  userService.deleteUser(userId)
    .then(deletedCount => {
      if (!deletedCount) {
        return res.status(400).json({
          status: 'fail',
          message: 'User not found.',
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully.',
      });
    })
    .catch(error => {
      res.status(500).json({
        status: 'fail',
        message: 'Error deleting user.',
      });
    });
});

// PUT - Change user password
router.put('/:id/change-password', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { newPassword } = req.body;

  if (req.user.user_id !== userId && req.user.role !== 1) {
    return res.status(403).json({
      status: 'fail',
      message: 'You do not have permission to change this user\'s password.',
    });
  }

  userService.changePassword(userId, newPassword)
    .then(([rowsUpdated, [updatedUser]]) => {
      if (!rowsUpdated) {
        return res.status(400).json({
          status: 'fail',
          message: 'User not found or password not changed.',
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Password changed successfully.',
        data: updatedUser,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: 'fail',
        message: 'Error changing password.',
      });
    });
});

module.exports = router;
